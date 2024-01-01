/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { Button as NextUiButton } from '@nextui-org/react';

export const Button = qwikify$(NextUiButton, { eagerness: 'visible' });
