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
    {
      // Cloudflare Rocket Loader rewrites module scripts and breaks the inline app.
      // The attribute is added after vite-plugin-singlefile has inlined the bundle.
      name: 'cfasync-offline-script',
      apply: 'build',
      enforce: 'post',
      generateBundle(_options, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type !== 'asset' || !file.fileName.endsWith('.html')) continue;
          const html = typeof file.source === 'string' ? file.source : Buffer.from(file.source).toString('utf8');
          file.source = html.replace(/<script type="module"/g, '<script type="module" data-cfasync="false"');
        }
      },
    },
  ],
  build: {
    target: 'es2022',
    modulePreload: false,
    outDir: 'dist',
  },
});
