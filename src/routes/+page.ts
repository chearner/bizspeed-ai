import { dev } from '$app/environment';
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const csr = dev;
export const prerender = true;
