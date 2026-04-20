import { Clipboard, FileText, Search } from '@lucide/svelte';
import { t } from '$lib/i18n';
import * as m from '$lib/paraglide/messages.js';

import type { MenuItem } from '$lib/components/shared/item-context-menu';

import { copyToClipboard } from './utils';

export type ItemContextMenuKind = 'active-change' | 'archived-change' | 'spec';

type BaseItemContextMenuConfig = {
  kind: ItemContextMenuKind;
  name: string;
  onOpenInNewTab: () => void;
};

type SpecItemContextMenuConfig = BaseItemContextMenuConfig & {
  kind: 'spec';
  onSearchRelatedChanges: () => void;
};

type ChangeItemContextMenuConfig = BaseItemContextMenuConfig & {
  kind: 'active-change' | 'archived-change';
};

export type ItemContextMenuConfig = ChangeItemContextMenuConfig | SpecItemContextMenuConfig;

function copyLabelFor(kind: ItemContextMenuKind) {
  return kind === 'spec' ? t(m.copy_label_spec_name) : t(m.copy_label_change_name);
}

export function createItemContextMenuItems(config: ItemContextMenuConfig): MenuItem[] {
  const items: MenuItem[] = [
    {
      label: t(m.context_menu_open_in_new_tab),
      icon: FileText,
      onSelect: config.onOpenInNewTab,
    },
    {
      label: t(m.context_menu_copy_name),
      icon: Clipboard,
      onSelect: () => copyToClipboard(config.name, copyLabelFor(config.kind)),
    },
  ];

  if (config.kind === 'spec') {
    items.push({
      label: t(m.context_menu_search_related_changes),
      icon: Search,
      onSelect: config.onSearchRelatedChanges,
    });
  }

  return items;
}
