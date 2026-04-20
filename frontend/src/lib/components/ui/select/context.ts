import { getContext, setContext } from 'svelte';

export interface SelectContext {
  isOpen: () => boolean;
  setOpen: (open: boolean) => void;
  selectedValue: () => string;
  setSelectedValue: (value: string) => void;
  getTriggerElement: () => HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
  getContentElement: () => HTMLElement | null;
  setContentElement: (element: HTMLElement | null) => void;
}

const SELECT_CONTEXT = Symbol('select');

export function setSelectContext(context: SelectContext) {
  setContext(SELECT_CONTEXT, context);
}

export function getSelectContext() {
  return getContext<SelectContext>(SELECT_CONTEXT);
}
