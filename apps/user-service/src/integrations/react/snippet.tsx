/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { Snippet as NextUISnippet } from '@nextui-org/snippet';

export const Snippet = qwikify$(NextUISnippet, { eagerness: 'visible' });
