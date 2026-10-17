// AppProviders — the fleet provider composition: one Styletron engine
// shared across renders, BaseProvider carrying the library theme. Extracted
// from the identical Gallery/Stamps AppProviders.tsx (originally derived
// from Gym Tracker); every app mounts this instead of hand-rolling its own.
import type {ReactNode} from 'react';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {BaseProvider} from 'baseui';
import type {Theme} from 'baseui/theme';
import {prayticlandTheme} from './theme';

const engine = new Styletron();

export function AppProviders({
  children,
  theme = prayticlandTheme,
}: {
  children: ReactNode;
  theme?: Theme;
}) {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
