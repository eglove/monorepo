/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { Input as NextUiInput } from '@nextui-org/react';

export const Input = qwikify$(NextUiInput, { eagerness: 'visible' });
