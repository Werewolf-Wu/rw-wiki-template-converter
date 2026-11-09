import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [
    viteSingleFile(),
    {
      name: 'offline-content-security-policy',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'";
          return html.replace('<head>', `<head>\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`);
        },
      },
    },
  ],
  build: {
    target: 'es2022',
    modulePreload: false,
    outDir: 'dist',
  },
});
