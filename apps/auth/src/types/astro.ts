import type { AstroCookies, Params, Props } from 'astro';

export type AstroRequest = {
  clientAddress: string;
  cookies: AstroCookies;
  params: Params;
  props: Props;
  redirect: () => void;
  request: Request;
  url: URL;
};
