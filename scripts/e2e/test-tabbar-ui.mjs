#!/usr/bin/env node

const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:3003/';
const DEVTOOLS_LIST_URL = process.env.DEVTOOLS_LIST_URL ?? 'http://127.0.0.1:9222/json/list';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CDPClient {
  #ws;
  #id = 0;
  #pending = new Map();

  constructor(wsUrl) {
    this.#ws = new WebSocket(wsUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.#ws.addEventListener('open', resolve, { once: true });
      this.#ws.addEventListener('error', reject, { once: true });
    });

    this.#ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!('id' in message)) {
        return;
      }

      const pending = this.#pending.get(message.id);
      if (!pending) {
        return;
      }

      this.#pending.delete(message.id);

      if (message.error) {
        pending.reject(new Error(message.error.message ?? 'CDP command failed'));
        return;
      }

      pending.resolve(message.result ?? {});
    });

    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: 1400,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  send(method, params = {}) {
    const id = ++this.#id;

    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
    }

    return result.result?.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await sleep(1200);
  }

  async reload() {
    await this.send('Page.reload');
    await sleep(1200);
  }

  async close() {
    this.#ws.close();
  }
}

async function getPageWebSocketUrl() {
  const response = await fetch(DEVTOOLS_LIST_URL);
  const targets = await response.json();
  const page = targets.find((target) => target.type === 'page' && target.url.startsWith(APP_URL));

  if (!page?.webSocketDebuggerUrl) {
    throw new Error(`Could not find Chrome DevTools page target for ${APP_URL}`);
  }

  return page.webSocketDebuggerUrl;
}

function pageExpression(source) {
  return `(${source})()`;
}

function escapeForPage(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

async function clickSelector(cdp, selector) {
  const ok = await cdp.evaluate(pageExpression(() => {
    const el = document.querySelector('__SELECTOR__');
    if (!(el instanceof HTMLElement)) {
      return false;
    }

    el.click();
    return true;
  }).replace('__SELECTOR__', escapeForPage(selector)));

  if (!ok) {
    throw new Error(`Selector not clickable: ${selector}`);
  }

  await sleep(250);
}

async function clickExplorerItem(cdp, sectionLabel, index = 0) {
  const expression = pageExpression(() => {
    const explorer = [...document.querySelectorAll('aside')].find((node) => node.textContent?.includes('Current Project'));
    if (!explorer) {
      return null;
    }

    const sections = [...explorer.querySelectorAll('[data-state]')];
    const section = sections.find((node) => node.querySelector('button')?.textContent?.includes('__LABEL__'));
    if (!section) {
      return null;
    }

    const body = section.querySelector('.divide-y');
    if (!body) {
      return null;
    }

    const items = [...body.querySelectorAll('button')];
    const target = items[__INDEX__];
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const text = target.querySelector('.font-medium, .truncate')?.textContent?.trim() ?? target.textContent?.trim() ?? null;
    target.click();
    return text;
  })
    .replace('__LABEL__', escapeForPage(sectionLabel))
    .replace('__INDEX__', String(index));

  const name = await cdp.evaluate(expression);
  if (!name) {
    throw new Error(`Could not open explorer item from section ${sectionLabel}`);
  }

  await sleep(300);
  return name;
}

async function ctrlClickExplorerItem(cdp, sectionLabel, index = 0) {
  const expression = pageExpression(() => {
    const explorer = [...document.querySelectorAll('aside')].find((node) => node.textContent?.includes('Current Project'));
    if (!explorer) {
      return null;
    }

    const sections = [...explorer.querySelectorAll('[data-state]')];
    const section = sections.find((node) => node.querySelector('button')?.textContent?.includes('__LABEL__'));
    if (!section) {
      return null;
    }

    const body = section.querySelector('.divide-y');
    if (!body) {
      return null;
    }

    const items = [...body.querySelectorAll('button')];
    const target = items[__INDEX__];
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const text = target.querySelector('.font-medium, .truncate')?.textContent?.trim() ?? target.textContent?.trim() ?? null;
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    return text;
  })
    .replace('__LABEL__', escapeForPage(sectionLabel))
    .replace('__INDEX__', String(index));

  const name = await cdp.evaluate(expression);
  if (!name) {
    throw new Error(`Could not ctrl-click explorer item from section ${sectionLabel}`);
  }

  await sleep(300);
  return name;
}

async function openExplorerItemContextMenu(cdp, sectionLabel, index = 0) {
  const expression = pageExpression(() => {
    const explorer = [...document.querySelectorAll('aside')].find((node) => node.textContent?.includes('Current Project'));
    if (!explorer) {
      return null;
    }

    const sections = [...explorer.querySelectorAll('[data-state]')];
    const section = sections.find((node) => node.querySelector('button')?.textContent?.includes('__LABEL__'));
    if (!section) {
      return null;
    }

    const body = section.querySelector('.divide-y');
    if (!body) {
      return null;
    }

    const items = [...body.querySelectorAll('button')];
    const target = items[__INDEX__];
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const rect = target.getBoundingClientRect();
    target.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: rect.left + 8,
      clientY: rect.top + 8,
    }));

    return target.querySelector('.font-medium, .truncate')?.textContent?.trim() ?? target.textContent?.trim() ?? null;
  })
    .replace('__LABEL__', escapeForPage(sectionLabel))
    .replace('__INDEX__', String(index));

  const name = await cdp.evaluate(expression);
  if (!name) {
    throw new Error(`Could not open explorer item context menu from section ${sectionLabel}`);
  }

  await sleep(250);
  return name;
}

async function clickContextMenuItem(cdp, label) {
  const selected = await cdp.evaluate(pageExpression(() => {
    const items = [...document.querySelectorAll('[role="menuitem"]')];
    const target = items.find((node) => node.textContent?.includes('__LABEL__'));
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    target.click();
    return true;
  }).replace('__LABEL__', escapeForPage(label)));

  if (!selected) {
    throw new Error(`Could not select context menu item: ${label}`);
  }

  await sleep(300);
}

async function doubleClickTab(cdp, tabName) {
  const clicked = await cdp.evaluate(pageExpression(() => {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const target = tabs.find((node) => node.querySelector('span')?.textContent?.trim() === '__TAB_NAME__');
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    return true;
  }).replace('__TAB_NAME__', escapeForPage(tabName)));

  if (!clicked) {
    throw new Error(`Could not double-click tab: ${tabName}`);
  }

  await sleep(250);
}

async function setPreviewTabsEnabled(cdp, enabled) {
  const changed = await cdp.evaluate(pageExpression(() => {
    const input = document.querySelector('input[aria-label="Enable preview tabs"]');
    if (!(input instanceof HTMLInputElement)) {
      return null;
    }

    const desired = __ENABLED__;
    if (input.checked !== desired) {
      input.click();
      return true;
    }

    return false;
  }).replace('__ENABLED__', enabled ? 'true' : 'false'));

  if (changed === null) {
    throw new Error('Could not find preview tabs toggle');
  }

  await sleep(300);
}

async function getPreviewTabsToggleState(cdp) {
  return cdp.evaluate(pageExpression(() => {
    const input = document.querySelector('input[aria-label="Enable preview tabs"]');
    return input instanceof HTMLInputElement ? input.checked : null;
  }));
}

async function getExplorerItemDetails(cdp, sectionLabel, index = 0) {
  const expression = pageExpression(() => {
    const normalizeText = (value) => value?.replace(/\s+/g, ' ').trim() ?? '';
    const explorer = [...document.querySelectorAll('aside')].find((node) => node.textContent?.includes('Current Project'));
    if (!explorer) {
      return null;
    }

    const sections = [...explorer.querySelectorAll('[data-state]')];
    const section = sections.find((node) => node.querySelector('button')?.textContent?.includes('__LABEL__'));
    if (!section) {
      return null;
    }

    const body = section.querySelector('.divide-y');
    if (!body) {
      return null;
    }

    const items = [...body.querySelectorAll('button')];
    const target = items[__INDEX__];
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const label = target.querySelector('.font-medium, .truncate');
    const content = target.querySelector('.min-w-0.flex-1');
    const contentChildren = content ? [...content.children] : [];
    const metadata = contentChildren.find((node, childIndex) => childIndex > 0 && node instanceof HTMLElement) ?? null;
    const progress = target.querySelector('[data-slot="progress"]');

    return {
      visibleLabel: normalizeText(label?.textContent),
      title: label?.getAttribute('title') ?? null,
      metadataText: normalizeText(metadata?.textContent),
      metadataItems: metadata ? [...metadata.querySelectorAll('span')].map((node) => normalizeText(node.textContent)) : [],
      hasProgress: Boolean(progress),
      progressContainerClass: progress?.parentElement?.className ?? null,
    };
  })
    .replace('__LABEL__', escapeForPage(sectionLabel))
    .replace('__INDEX__', String(index));

  const details = await cdp.evaluate(expression);
  if (!details) {
    throw new Error(`Could not inspect explorer item from section ${sectionLabel}`);
  }

  return details;
}

async function waitFor(cdp, predicateExpression, label, timeoutMs = 8000, intervalMs = 200) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const result = await cdp.evaluate(predicateExpression);
    if (result) {
      return result;
    }
    await sleep(intervalMs);
  }

  throw new Error(`Timed out waiting for: ${label}`);
}

function getStateExpression() {
  return pageExpression(() => {
    const tabList = document.querySelector('[role="tablist"]');
    const tabs = [...document.querySelectorAll('[role="tab"]')].map((node) => {
      const label = node.querySelector('span');
      const text = label?.textContent?.trim() ?? node.textContent?.trim() ?? null;

      return {
        text,
        selected: node.getAttribute('aria-selected') === 'true',
        closeVisible: Boolean(node.querySelector('button[aria-label="Close tab"]')),
        pinVisible: Boolean(node.querySelector('button[aria-label="Pin tab"], button[aria-label="Unpin tab"], button[aria-label="Pinned Dashboard tab"]')),
        isPreview: node.getAttribute('data-preview') === 'true',
        previewItalic: label?.classList.contains('italic') ?? false,
        ariaLabel: node.getAttribute('aria-label') ?? '',
        title: node.getAttribute('title') ?? '',
      };
    });

    const firstTab = document.querySelector('[role="tab"]');

    return {
      path: location.pathname,
      tabListClass: tabList?.className ?? '',
      firstTabInset: firstTab && tabList
        ? Math.round(firstTab.getBoundingClientRect().left - tabList.getBoundingClientRect().left)
        : null,
      activeTab: tabs.find((tab) => tab.selected)?.text ?? null,
      homeTab: tabs.find((tab) => tab.text === 'Dashboard') ?? null,
      tabs,
      tabNames: tabs.map((tab) => tab.text).filter(Boolean),
    };
  });
}

async function getState(cdp) {
  return cdp.evaluate(getStateExpression());
}

async function getViewerSubtitle(cdp) {
  return cdp.evaluate(pageExpression(() => {
    const heading = document.querySelector('h1');
    const subtitle = heading?.parentElement?.querySelector('p');
    return subtitle?.textContent?.replace(/\s+/g, ' ').trim() ?? null;
  }));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function formatArchivedChangeName(name) {
  return name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function assertCompactDate(value, message) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), message);
}

function getTabByName(state, name) {
  return state.tabs.find((tab) => tab.text === name) ?? null;
}

async function main() {
  const wsUrl = await getPageWebSocketUrl();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  try {
    await cdp.navigate(APP_URL);

    await cdp.evaluate(pageExpression(() => {
      localStorage.removeItem('openspec-ui-preferences');
      localStorage.setItem('openspec-layout', JSON.stringify({
        explorerCollapsed: false,
        rememberedExplorerWidth: 320,
        sectionCollapsed: {
          'active-changes': false,
          archive: false,
          specs: false,
        },
      }));

      return true;
    }));

    await cdp.reload();

    await waitFor(
      cdp,
      pageExpression(() => Boolean(document.querySelector('[role="tablist"]') && document.querySelector('[aria-label="Archive"]'))),
      'tab bar and archive activity button',
    );

    let state = await getState(cdp);
    assert(state.homeTab?.pinVisible === true, 'Dashboard tab should stay pinned');
    assert(state.homeTab?.closeVisible === false, 'Dashboard tab should not show a close button');
    assert(state.tabListClass.includes('pl-2'), 'Tab list should keep pl-2 for left-edge alignment');
    assert(typeof state.firstTabInset === 'number' && state.firstTabInset >= 6 && state.firstTabInset <= 10, `Expected first tab inset near 8px, received ${state.firstTabInset}`);

    await clickSelector(cdp, '[aria-label="Settings"]');
    await waitFor(cdp, pageExpression(() => document.querySelector('input[aria-label="Enable preview tabs"]') instanceof HTMLInputElement), 'preview tabs toggle');
    assert(await getPreviewTabsToggleState(cdp) === true, 'Preview tabs should default to enabled');
    await clickSelector(cdp, '[aria-label="Settings"]');

    await clickSelector(cdp, '[aria-label="Specs"]');
    const previewSpecName = await clickExplorerItem(cdp, 'Specs', 0);
    state = await getState(cdp);
    const previewSpecTab = getTabByName(state, previewSpecName);
    assert(state.tabNames.length === 2, `Preview open should reuse a single extra tab slot, received ${state.tabNames.length} tabs`);
    assert(previewSpecTab?.isPreview === true, 'Single-clicked spec should open as a preview tab');
    assert(previewSpecTab?.previewItalic === true, 'Preview tab should render italic text');
    assert(previewSpecTab?.ariaLabel.includes('Preview') || previewSpecTab?.title.includes('Preview'), 'Preview tab should expose Preview in aria-label or tooltip');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    const previewChangeName = await clickExplorerItem(cdp, 'Active Changes', 0);
    state = await getState(cdp);
    const previewChangeTab = getTabByName(state, previewChangeName);
    assert(state.tabNames.length === 2, `Second single-click should reuse the same preview tab, received ${state.tabNames.length} tabs`);
    assert(previewChangeTab?.isPreview === true, 'Preview slot should be reused for the next single-clicked item');

    await doubleClickTab(cdp, previewChangeName);
    state = await getState(cdp);
    const tabbarConfirmedChangeTab = getTabByName(state, previewChangeName);
    assert(tabbarConfirmedChangeTab?.isPreview === false, 'TabBar double-click should confirm an existing preview tab');
    assert(tabbarConfirmedChangeTab?.previewItalic === false, 'TabBar-confirmed tab should not stay italic');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    const previewChangeNameAgain = await clickExplorerItem(cdp, 'Active Changes', 0);
    state = await getState(cdp);
    const previewChangeTabAgain = getTabByName(state, previewChangeNameAgain);
    assert(previewChangeTabAgain?.isPreview === true, 'Single-click should still create a preview tab after TabBar confirmation');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    await ctrlClickExplorerItem(cdp, 'Active Changes', 0);
    state = await getState(cdp);
    const confirmedChangeTab = getTabByName(state, previewChangeNameAgain);
    assert(confirmedChangeTab?.isPreview === false, 'Ctrl+Click should confirm an existing preview tab');
    assert(confirmedChangeTab?.previewItalic === false, 'Confirmed tab should not stay italic');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    const contextMenuSpecName = await openExplorerItemContextMenu(cdp, 'Specs', 0);
    await clickContextMenuItem(cdp, 'Open in New Tab');
    state = await getState(cdp);
    const contextMenuSpecTab = getTabByName(state, contextMenuSpecName);
    assert(contextMenuSpecTab?.isPreview === false, 'Explorer context menu should open a confirmed tab');

    await clickSelector(cdp, '[aria-label="Settings"]');
    await setPreviewTabsEnabled(cdp, false);
    assert(await getPreviewTabsToggleState(cdp) === false, 'Preview tabs toggle should allow disabling the mode');
    await clickSelector(cdp, '[aria-label="Settings"]');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    await cdp.reload();
    await waitFor(
      cdp,
      pageExpression(() => Boolean(document.querySelector('[role="tablist"]') && document.querySelector('[aria-label="Settings"]'))),
      'tab bar after disabling preview tabs',
    );

    await clickSelector(cdp, '[aria-label="Settings"]');
    await waitFor(cdp, pageExpression(() => document.querySelector('input[aria-label="Enable preview tabs"]') instanceof HTMLInputElement), 'preview tabs toggle after reload');
    assert(await getPreviewTabsToggleState(cdp) === false, 'Preview tabs disabled state should persist after reload');
    await clickSelector(cdp, '[aria-label="Settings"]');

    await clickSelector(cdp, '[aria-label="Specs"]');
    const confirmedSpecName = await clickExplorerItem(cdp, 'Specs', 0);
    state = await getState(cdp);
    const confirmedSpecTab = getTabByName(state, confirmedSpecName);
    assert(confirmedSpecTab?.isPreview === false, 'Single-click should open a confirmed tab when preview mode is disabled');

    await clickSelector(cdp, '[aria-label="Dashboard"]');
    const secondConfirmedChangeName = await clickExplorerItem(cdp, 'Active Changes', 0);
    state = await getState(cdp);
    const secondConfirmedChangeTab = getTabByName(state, secondConfirmedChangeName);
    assert(state.tabNames.length === 3, `Disabled preview mode should keep adding confirmed tabs, received ${state.tabNames.length} tabs`);
    assert(secondConfirmedChangeTab?.isPreview === false, 'Disabled preview mode should not create preview tabs');

    const activeRow = await getExplorerItemDetails(cdp, 'Active Changes', 0);
    assert(activeRow.visibleLabel.length > 0, 'Expected an active change row');
    assert(activeRow.metadataItems.length === 3, `Active change row should expose three compact metadata items, received ${activeRow.metadataItems.length}`);
    assertCompactDate(activeRow.metadataItems[0], 'Active change row should show compact date metadata');
    assert(/^\d+$/.test(activeRow.metadataItems[1]), 'Active change row should show compact spec delta count');
    assert(/^\d+\/\d+$/.test(activeRow.metadataItems[2]), 'Active change row should show compact task progress');
    assert(activeRow.hasProgress, 'Active change row should show a progress bar');
    assert(activeRow.progressContainerClass?.includes('w-14'), 'Active change row should keep the compact progress width');
    assert(!activeRow.metadataText.includes('Updated'), 'Active change row should not use the old Updated label');

    await clickSelector(cdp, '[aria-label="Archive"]');

    const archivedRow = await getExplorerItemDetails(cdp, 'Archive', 0);
    const archivedChangeName = archivedRow.title ?? archivedRow.visibleLabel;
    assert(/^\d{4}-\d{2}-\d{2}-/.test(archivedChangeName), 'Archived change row tooltip should preserve the full archived name');
    assert(archivedRow.visibleLabel === formatArchivedChangeName(archivedChangeName), 'Archived change row label should hide the date prefix');
    assert(archivedRow.metadataItems.length === 3, `Archived change row should expose three compact metadata items, received ${archivedRow.metadataItems.length}`);
    assertCompactDate(archivedRow.metadataItems[0], 'Archived change row should show archived date metadata');
    assert(/^\d+$/.test(archivedRow.metadataItems[1]), 'Archived change row should show compact spec delta count');
    assert(/^\d+\/\d+$/.test(archivedRow.metadataItems[2]), 'Archived change row should show compact task progress');
    assert(!archivedRow.hasProgress, 'Archived change row should not render a progress bar');
    assert(!archivedRow.metadataText.includes('Updated'), 'Archived change row should not use the old Updated label');

    await clickExplorerItem(cdp, 'Archive', 0);
    state = await getState(cdp);

    assert(state.path === `/changes/${encodeURIComponent(archivedChangeName)}`, 'Archived change route should keep the full archived name');
    assert(state.activeTab === formatArchivedChangeName(archivedChangeName), 'Archived change tab label should hide the date prefix');

    await clickSelector(cdp, '[aria-label="Specs"]');

    const specRow = await getExplorerItemDetails(cdp, 'Specs', 0);
    assert(specRow.visibleLabel.length > 0, 'Expected a spec row');
    assertCompactDate(specRow.metadataText, 'Spec row should show compact date metadata');
    assert(!specRow.metadataText.includes('Updated'), 'Spec row should not use the old Updated label');

    const specName = await clickExplorerItem(cdp, 'Specs', 0);
    state = await getState(cdp);
    assert(state.path === `/specs/${encodeURIComponent(specName)}`, 'Spec route should use the visible spec name');

    const subtitle = await getViewerSubtitle(cdp);
    assertCompactDate(subtitle ?? '', 'Spec viewer subtitle should show compact calendar/date metadata');
    assert(subtitle === specRow.metadataText, 'Spec viewer subtitle should match the explorer metadata date');
    assert(!subtitle?.includes('Updated'), 'Spec viewer subtitle should not use the old Updated label');

    console.log(JSON.stringify({
      ok: true,
      checks: [
        'home-tab-pinned',
        'tabbar-left-edge-inset',
        'preview-tabs-default-enabled',
        'preview-tabs-reuse-and-confirmed-open',
        'preview-tabs-tabbar-double-click-confirm',
        'preview-tabs-settings-persist-off',
        'active-change-compact-metadata',
        'archived-change-label-format',
        'archived-change-compact-metadata',
        'spec-row-date-metadata',
        'spec-viewer-compact-subtitle',
      ],
    }, null, 2));
  } finally {
    await cdp.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
