import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// During development/SSR, also serve static assets from the source `src/assets`
// so files like `/assets/i18n/en.json` are available without a built browser bundle.
const srcAssets = join(process.cwd(), 'src', 'assets');
app.use('/assets', express.static(srcAssets, { index: false, redirect: false }));

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Fallback: for any request not handled by the SSR engine or static files,
// serve the browser `index.html` so client-side routing works on direct GET/refresh.
// Use a path compatible with the current path-to-regexp parser.
// `/*` avoids an unnamed parameter error that some path-to-regexp versions throw for `*`.
// Use a RegExp route to avoid path-to-regexp parsing errors across versions.
// This matches any path and safely serves the browser index for client-side routing.
const indexHtmlPath = join(browserDistFolder, 'index.html');

app.get(/.*/, (req, res, next) => {
  // Use sendFile with a callback so we can gracefully fall back if the file doesn't exist.
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      // If the file isn't found (or another send error), pass to next() so Express can handle it.
      return next(err);
    }
  });
});
/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
