# prayticland-ui-libs

The shared Prayticland UI library. Everything that
used to be copy-pasted per app—theme, providers, fonts, design tokens, and
Base Web overrides shared by ≥2 apps—lives here, versioned, and is consumed
by the apps as a pinned npm dependency.

## Exports

| Import | What |
|---|---|
| `prayticland-ui-libs/theme` | `createPrayticlandTheme(options)`, `prayticlandTheme`, `FONT_STACK`—the theme is created here, never in an app |
| `prayticland-ui-libs/providers` | `AppProviders`—Styletron engine + BaseProvider, the fleet composition |
| `prayticland-ui-libs/fonts.css` | Nunito Sans @font-face set; the woff2 files ship in this package |
| `prayticland-ui-libs/tokens.css` | The standard visual rules: palette as CSS variables, app shell, shared patterns |
| `prayticland-ui-libs/tokens.json` | Framework-neutral token values |
| `prayticland-ui-libs/overrides` | The override catalogue: `modalScrimOverrides(isMobile)`, … |
| `prayticland-ui-libs/components` | Shared composites: `StateBlock`, `BottomNav` + `NavCircleButton` (Stamps' floating-round page nav), `SwipeRail` (Gym's swipe-between-views rail) |

## Consumption

Each release of this library is a versioned tarball attached to a
GitHub Release in this repository. Apps pin an exact version by the
tarball URL:

```json
"prayticland-ui-libs": "https://github.com/Prayticland/prayticland-ui-libs/releases/download/v0.3.3/prayticland-ui-libs-0.3.3.tgz"
```

Peer contract (the fleet version contract): baseui 16.1.1, React
^18.3.1, styletron-engine-atomic ^1.6.2, styletron-react ^6.1.1. Version
bumps arrive as fleet PRs with screenshot verification per app.

## Responsive (Base Web guidelines)

The fleet follows Base Web's responsive pattern
(https://baseweb.design/blog/responsive-web/): **mobile-first**—base
styles are the phone layout; larger screens are enhancements. The theme
created here carries the breakpoints and their media queries; apps never
define their own.

| Step | min-width | Content column (`--app-width`) |
|---|---|---|
| base |—| 680px |
| small | 769px | 860px |
| medium | 1024px | 1040px |
| large | 1216px | 1200px |

- Styled components: key enhancements off `$theme.mediaQuery.small` /
  `.medium` / `.large`.
- `Block` / `FlexGrid`: responsive prop arrays map `[base, small, medium,
  large]` onto the same breakpoints; `display={['block', 'none']}` /
  `['none', 'block']` is the mobile-only / desktop-only pattern.
- Plain CSS consumes `var(--app-width)` (tokens.css steps it at the same
  breakpoints); apps do not hardcode column widths.
- Every app's `index.html` carries the viewport meta
  (`width=device-width, initial-scale=1`).
- tokens.json mirrors `breakpoints` + `contentWidthSteps` for
  non-Base-Web consumers.

## Development

- `make check`—typecheck (library + showcase).
- `make showcase`—build the showcase page: every export rendered against
  the theme; the visual regression surface for the whole fleet.
- `make inventory`—the override/hex inventory across all fleet apps;
  its output is the extraction backlog. Hex literals in app sources go
  to zero.

## Catalogue backlog

- Modal viewer chrome beyond the scrim (Stamps' circular close/flag
  buttons)—to be extracted when a second app adopts the pattern.
