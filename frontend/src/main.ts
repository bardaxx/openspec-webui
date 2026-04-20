import './app.css';
import { initializeLocaleSystem } from '$lib/i18n';
import { mount } from 'svelte';

initializeLocaleSystem();

const target = document.getElementById('app')!;

const app = import('./App.svelte').then(({ default: App }) =>
  mount(App, {
    target,
  })
);

export default app;
