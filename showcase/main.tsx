// Showcase—the visual regression surface for the whole fleet:
// every library export rendered against the library theme in one page.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button} from 'baseui/button';
import {Input} from 'baseui/input';
import {Modal, ModalBody, ROLE} from 'baseui/modal';
import {DisplayLarge, HeadingLarge, ParagraphLarge} from 'baseui/typography';
import {Block} from 'baseui/block';
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {useStyletron} from 'baseui';
import {AppProviders} from '../src/providers';
import {BottomNav, NavCircleButton, StateBlock, SwipeRail} from '../src/components';
import {Album, ChartColumn, Flag, Images} from 'lucide-react';
import {modalScrimOverrides} from '../src/overrides';
import tokens from '../src/tokens/tokens.json';
import '../src/fonts/fonts.css';
import '../src/tokens/tokens.css';

function Swatches() {
  return (
    <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
      {Object.entries(tokens.colors).map(([name, value]) => (
        <div key={name} style={{textAlign: 'center'}}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: value,
              border: `1px solid ${tokens.colors.border}`,
            }}
          />
          <div className="hint">
            {name}
            <br />
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

// Responsive contract demo: the theme's breakpoints/mediaQuery, Block
// responsive prop arrays, a mobile-only vs desktop-only pair, and a FlexGrid
// whose column count steps with the breakpoints (blog patterns, verbatim
// mechanics). The page shell itself widens via the tokens.css width steps.
function ResponsiveDemo() {
  const [, theme] = useStyletron();
  return (
    <>
      <ParagraphLarge>
        Theme breakpoints—small: {theme.breakpoints.small}, medium: {theme.breakpoints.medium},
        large: {theme.breakpoints.large}. Media query (small): {theme.mediaQuery.small}
      </ParagraphLarge>
      <Block
        backgroundColor="primary50"
        padding={['scale600', 'scale800', 'scale1000', 'scale1200']}
        marginBottom="scale600"
      >
        This Block's padding steps up at each breakpoint (responsive prop array).
      </Block>
      <Block display={['block', 'none']} marginBottom="scale300">
        Mobile-only block (display array: block below small, none above).
      </Block>
      <Block display={['none', 'block']} marginBottom="scale600">
        Desktop-only block (display array: none below small, block above).
      </Block>
      <FlexGrid flexGridColumnCount={[1, 2, 3]} flexGridColumnGap="scale300" flexGridRowGap="scale300">
        <FlexGridItem>Grid cell one</FlexGridItem>
        <FlexGridItem>Grid cell two</FlexGridItem>
        <FlexGridItem>Grid cell three</FlexGridItem>
      </FlexGrid>
    </>
  );
}

// Navigation demo: the Stamps floating-round BottomNav paired with the Gym
// SwipeRail—swipe the panels or tap the buttons; both stay in sync. The
// gold circle is an app-specific extra action (NavCircleButton).
const NAV_PAGES = [
  {id: 'album', label: 'Album', Icon: Album},
  {id: 'stats', label: 'Stats', Icon: ChartColumn},
  {id: 'gallery', label: 'Gallery', Icon: Images},
] as const;

function NavDemo() {
  const [index, setIndex] = useState(0);
  const active = NAV_PAGES[index];
  return (
    <>
      <ParagraphLarge>
        Active page: {active.label}. Swipe the rail or use the floating nav (fixed to the
        viewport bottom, like in the apps).
      </ParagraphLarge>
      <SwipeRail index={index} onIndexChange={setIndex} ariaLabel="Showcase pages" style={{height: 180}}>
        {NAV_PAGES.map(({id, label}) => (
          <div key={id} style={{padding: 24}}>
            <HeadingLarge>{label} page</HeadingLarge>
            <p>Swipe left/right or tap the round buttons below.</p>
          </div>
        ))}
      </SwipeRail>
      <BottomNav
        items={[...NAV_PAGES]}
        activeId={active.id}
        onChange={(id) => setIndex(NAV_PAGES.findIndex((p) => p.id === id))}
        ariaLabel="Showcase"
      >
        <NavCircleButton label="Extra action" backgroundColor={tokens.colors.activity} color={tokens.colors.background}>
          <Flag size={24} aria-hidden="true" />
        </NavCircleButton>
      </BottomNav>
    </>
  );
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">prayticland-ui-libs · showcase</p>
        <DisplayLarge>prayticland-ui-libs</DisplayLarge>
        <ParagraphLarge>
          Theme, providers, fonts, tokens, overrides and components—rendered once, for every app.
        </ParagraphLarge>
      </header>

      <h2>Tokens</h2>
      <Swatches />

      <h2>Typography (Nunito Sans via the library theme)</h2>
      <HeadingLarge>HeadingLarge—the quick brown fox</HeadingLarge>
      <ParagraphLarge>ParagraphLarge—jumps over the lazy dog. 0123456789</ParagraphLarge>

      <h2>Buttons</h2>
      <div className="actions">
        <Button>Primary</Button>
        <Button kind="secondary">Secondary</Button>
        <Button kind="tertiary">Tertiary</Button>
        <Button disabled>Disabled</Button>
      </div>

      <h2>Input</h2>
      <Input placeholder="An input on the library theme" />

      <h2>StateBlock</h2>
      <StateBlock status="loading" label="Loading demo" />
      <StateBlock status="error" message="Something failed, as it does." onRetry={() => {}} />
      <StateBlock status="empty">Nothing here yet—the empty state.</StateBlock>

      <h2>Responsive (Base Web guidelines)</h2>
      <ResponsiveDemo />

      <h2>BottomNav + SwipeRail</h2>
      <NavDemo />

      <h2>Modal scrim override</h2>
      <Button onClick={() => setModalOpen(true)}>Open modal</Button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        closeable
        role={ROLE.dialog}
        aria-label="Showcase modal"
        overrides={modalScrimOverrides(isMobile)}
      >
        <ModalBody>
          <h2>Modal on the library scrim</h2>
          <p>Blurred backdrop, bottom sheet on mobile, centered card on desktop.</p>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </ModalBody>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
