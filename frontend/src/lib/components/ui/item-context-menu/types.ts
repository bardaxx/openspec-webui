import type { Component } from 'svelte';

export type MenuItem = {
  label: string;
  icon?: Component<{ class?: string }>;
  onSelect: () => void;
};
