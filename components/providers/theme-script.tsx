import { applyTheme, readStoredTheme, type ThemeConfig } from "@/lib/theme";

/**
 * Applies the persisted theme to `<html>` before the browser paints, so there
 * is no flash of the wrong palette on first load.
 *
 * This component MUST stay a Server Component. React only executes `<script>`
 * elements that come from the server: anything produced while rendering on the
 * client is dead markup, and react-dom logs "Encountered a script tag while
 * rendering React component" for it in development.
 */
export function ThemeScript(config: ThemeConfig) {
  const html =
    `(function(){try{` +
    readStoredTheme.toString() +
    applyTheme.toString() +
    `var c=${JSON.stringify(config)};applyTheme(readStoredTheme(c),c)}catch(e){}})()`;

  return (
    <script
      // Fixed, build-time string: our own functions plus JSON.stringify'd config.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}