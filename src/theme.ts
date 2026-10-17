// Prayticland theme factory — the ONE place the fleet theme is created
// (the theme is created in the library, never in an app).
//
// Extracted verbatim from the six identical per-app theme.ts copies
// (Gallery/Stamps/Otgymanya/Lifegame/Homunculus/Networker, 2026-10-17 audit):
// Nunito Sans on every non-mono Base Web typography scale; mono scales keep
// their monospace stack. The font files ship from this library (./fonts).
import {createTheme, LightTheme} from 'baseui';
import type {Theme} from 'baseui/theme';

export const FONT_STACK =
  "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export interface PrayticlandThemeOptions {
  // Declared factory options only. Density presets land here when a
  // second density is actually needed; apps may not fork the theme locally.
  fontStack?: string;
  breakpoints?: typeof PRAYTICLAND_BREAKPOINTS;
}

// Responsive contract (Base Web "Building Responsive Apps with Base Web",
// https://baseweb.design/blog/responsive-web/): mobile-first — base styles
// are the phone layout; larger screens are enhancements keyed off these
// theme breakpoints. The theme carries both the breakpoint values and the
// generated min-width mediaQuery strings, so styled components use
// $theme.mediaQuery.<step> and Block/FlexGrid responsive prop arrays map
// [base, small, medium, large] onto them. Values are the blog's canonical
// example set; the fleet content column (680px) sits below `small`, so
// phones and portrait tablets keep the mobile layout.
export const PRAYTICLAND_BREAKPOINTS = {small: 769, medium: 1024, large: 1216};

export function prayticlandMediaQuery(breakpoints: typeof PRAYTICLAND_BREAKPOINTS) {
  return Object.fromEntries(
    Object.entries(breakpoints).map(([key, value]) => [
      key,
      `@media screen and (min-width: ${value}px)`,
    ]),
  ) as Record<keyof typeof PRAYTICLAND_BREAKPOINTS, string>;
}

export function createPrayticlandTheme(options: PrayticlandThemeOptions = {}): Theme {
  const fontStack = options.fontStack ?? FONT_STACK;
  const breakpoints = options.breakpoints ?? PRAYTICLAND_BREAKPOINTS;
  const typography = Object.fromEntries(
    Object.entries(LightTheme.typography)
      .filter(([key]) => !key.startsWith('Mono'))
      .map(([key, style]) => [key, {...style, fontFamily: fontStack}]),
  );
  // Base Web 16.1.1: one-arg createTheme (primitives derived from LightTheme);
  // overrides deep-merge, replacing the default breakpoints (320/600/1136)
  // and their mediaQuery strings with the fleet's.
  return createTheme({typography, breakpoints, mediaQuery: prayticlandMediaQuery(breakpoints)});
}

/** The default instance every app mounts via AppProviders. */
export const prayticlandTheme: Theme = createPrayticlandTheme();
