import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link href={loc.url.href} rel="canonical" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

      {head.meta.map(m => {
        return <meta key={m.key} {...m} />;
      })}

      {head.links.map(l => {
        return <link key={l.key} {...l} />;
      })}

      {head.styles.map(s => {
        return (
          // eslint-disable-next-line react/no-danger
          <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
        );
      })}

      {head.scripts.map(s => {
        return (
          // eslint-disable-next-line react/no-danger
          <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
        );
      })}
    </>
  );
});
