// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages note:
  // Set env var SITE to your final production origin (e.g. https://yourdomain.com).
  // Otherwise we fall back to a placeholder Pages URL.
  site: process.env.SITE ?? 'https://codetocall.com',
  integrations: [sitemap()],
});
