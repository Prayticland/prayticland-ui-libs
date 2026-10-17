// Shared composite components — patterns proven in ≥2 apps, promoted
// into the library on adoption. StateBlock (v0.1.0); BottomNav +
// NavCircleButton + SwipeRail (v0.3.0, Stamps' floating-round nav design +
// Gym's swipe rail, adopted fleet-wide 2026-10-17).

import type {ReactNode} from 'react';
import {Button} from 'baseui/button';
import {Spinner} from 'baseui/spinner';
import {TriangleAlert} from 'lucide-react';

/**
 * StateBlock — the fleet's loading / error / empty visual language (Gallery's
 * and Stamps' `.status-block` sections; Networker's StateBlocks). Renders:
 *  - status="loading": a spinner block (aria-busy), optional label for AT
 *  - status="error":   alert role, warning icon + message + optional Retry
 *  - status="empty":   a plain hint paragraph (children)
 * Styling comes from the tokens stylesheet (.status-block / .hint classes in
 * prayticland-ui-libs/tokens.css) so apps keep one visual language.
 */
export function StateBlock({
  status,
  message,
  onRetry,
  label,
  children,
}: {
  status: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
  label?: string;
  children?: ReactNode;
}) {
  if (status === 'loading') {
    return (
      <section className="status-block" aria-busy="true" aria-label={label ?? 'Loading'}>
        <Spinner $size={32} />
      </section>
    );
  }
  if (status === 'error') {
    return (
      <section className="status-block" role="alert">
        <p>
          <TriangleAlert className="lucide-icon" aria-hidden="true" /> {message}
        </p>
        {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
      </section>
    );
  }
  return (
    <section className="status-block">
      <p className="hint">{children ?? message}</p>
    </section>
  );
}

import {Block} from 'baseui/block';
import {Children, cloneElement, isValidElement, useEffect, useRef} from 'react';
import type {CSSProperties} from 'react';
import type {LucideIcon} from 'lucide-react';

/**
 * NavCircleButton + BottomNav — the fleet's bottom page navigation
 * (Stamps' design, adopted fleet-wide): floating round buttons,
 * one per page, no bar and no text — the active page is a filled circle,
 * the others outlined. Theme-driven ($theme tokens only, Stamps verbatim).
 * The container's transform promotes it to a composited layer so it stays
 * glued to the viewport bottom while content scrolls underneath. Apps with
 * an extra action (Stamps' flag button) render a NavCircleButton as a
 * child, with their own token colors.
 */
export function NavCircleButton({
  label,
  active = false,
  disabled = false,
  onClick,
  backgroundColor,
  color,
  testId,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
  /** Rendered as data-testid — the apps' e2e suites address nav buttons by it. */
  testId?: string;
  children: ReactNode;
}) {
  return (
    <Block
      as="button"
      type="button"
      data-testid={testId}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      overrides={{
        Block: {
          style: ({$theme}) => ({
            width: $theme.sizing.scale1400,
            height: $theme.sizing.scale1400,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            position: 'relative',
            backgroundColor:
              backgroundColor ??
              (active ? $theme.colors.contentPrimary : $theme.colors.backgroundPrimary),
            color:
              color ??
              (active ? $theme.colors.backgroundPrimary : $theme.colors.contentSecondary),
            boxShadow: $theme.lighting.shadow600,
            opacity: disabled ? 0.45 : 1,
          }),
        },
      }}
    >
      {children}
    </Block>
  );
}

export interface BottomNavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  disabled?: boolean;
  testId?: string;
}

export function BottomNav({
  items,
  activeId,
  onChange,
  ariaLabel,
  children,
}: {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  children?: ReactNode;
}) {
  return (
    <Block
      as="nav"
      aria-label={ariaLabel}
      overrides={{
        Block: {
          style: ({$theme}) => ({
            position: 'fixed',
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${$theme.sizing.scale600})`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: $theme.sizing.scale400,
          }),
        },
      }}
    >
      {items.map(({id, label, Icon, disabled, testId}) => (
        <NavCircleButton
          key={id}
          label={label}
          active={id === activeId}
          disabled={disabled}
          testId={testId}
          onClick={() => onChange(id)}
        >
          <Icon size={24} aria-hidden="true" />
        </NavCircleButton>
      ))}
      {children}
    </Block>
  );
}

/**
 * SwipeRail — Gym's gesture navigation model: a horizontal
 * scroll-snap rail whose pages are the app's top-level views; swiping
 * moves between views, and the index stays in sync both ways (a BottomNav
 * tap scrolls the rail; a swipe reports the settled page). Each page
 * scrolls vertically on its own. Pair with BottomNav overlaid.
 */
export function SwipeRail({
  index,
  onIndexChange,
  ariaLabel,
  style,
  children,
}: {
  index: number;
  onIndexChange: (index: number) => void;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialized = useRef(false);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 1) {
      // First mount lands on the initial page instantly (Gym opens on its
      // second view with no slide); later external changes glide.
      el.scrollTo({left: target, behavior: initialized.current ? 'smooth' : 'auto'});
    }
    initialized.current = true;
  }, [index]);
  return (
    <div
      className="swipe-rail"
      role="region"
      aria-label={ariaLabel}
      style={style}
      ref={rail}
      onScroll={() => {
        const el = rail.current;
        if (!el) return;
        clearTimeout(settle.current);
        settle.current = setTimeout(
          () => onIndexChange(Math.round(el.scrollLeft / el.clientWidth)),
          80,
        );
      }}
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, {
              className: `${(child.props as {className?: string}).className ?? ''} swipe-view`.trim(),
            } as Partial<unknown>)
          : child,
      )}
    </div>
  );
}
