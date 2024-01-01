import './global.css';

import { component$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';

import { RouterHead } from './components/router-head/router-head';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link href="/manifest.json" rel="manifest" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body class="mx-auto max-w-7xl p-4" lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
