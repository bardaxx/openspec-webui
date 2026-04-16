import { Clipboard, FileText, Search } from '@lucide/svelte';

import type { MenuItem } from '$lib/components/ui/item-context-menu';

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
  return kind === 'spec' ? 'Spec name' : 'Change name';
}

export function createItemContextMenuItems(config: ItemContextMenuConfig): MenuItem[] {
  const items: MenuItem[] = [
    {
      label: 'Open in New Tab',
      icon: FileText,
      onSelect: config.onOpenInNewTab,
    },
    {
      label: 'Copy Name',
      icon: Clipboard,
      onSelect: () => copyToClipboard(config.name, copyLabelFor(config.kind)),
    },
  ];

  if (config.kind === 'spec') {
    items.push({
      label: 'Search Related Changes',
      icon: Search,
      onSelect: config.onSearchRelatedChanges,
    });
  }

  return items;
}
