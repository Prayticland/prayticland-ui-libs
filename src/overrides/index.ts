// The override catalogue: named, exported, individually importable
// Base Web override objects. An override used by ≥2 apps (or clearly generic)
// lives here with a name describing its intent, not its first app.
//
// Extraction rule for new entries: copy the proven app code verbatim, name
// the pattern, note the source apps in the comment.

// modalScrimOverrides—the fleet modal/viewer scrim (source: Gallery's
// create/edit Modal, main.tsx; Stamps' viewer uses the sibling pattern).
// Base Web merges DialogContainer over the scrim, so the full-viewport
// positioning lives here: blurred translucent backdrop; on mobile the
// dialog becomes a bottom sheet (Base Web mobile pattern), on desktop a
// centered card with the standard 12px radius.
export function modalScrimOverrides(isMobile: boolean) {
  return {
    DialogContainer: {
      style: isMobile
        ? {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 0,
            margin: 0,
            overflowY: 'auto' as const,
            zIndex: 100,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
          }
        : {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
            overflowY: 'auto' as const,
            zIndex: 100,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
          },
    },
    Dialog: {
      style: isMobile
        ? {
            margin: 0,
            width: '100%',
            maxWidth: '100%',
            borderRadius: '16px 16px 0 0',
            maxHeight: '92dvh',
            overflowY: 'auto' as const,
          }
        : {
            borderRadius: '12px',
            maxWidth: '720px',
            // Fill the scrim's padded content box; container-relative so no
            // vw quirk on real devices can push the dialog past the viewport.
            width: '100%',
          },
    },
  };
}
