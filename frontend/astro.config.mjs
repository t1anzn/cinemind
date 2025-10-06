// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.BACKEND_URL': `"${process.env.BACKEND_URL || 'http://backend:5000'}"`
    }
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
  },

  output: 'server', 
  adapter: node({
    mode: 'standalone'
  }),
});