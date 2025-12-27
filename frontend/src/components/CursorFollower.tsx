/**
 * Custom Cursor Follower Component
 * Displays custom cursor with trailing effect
 * Only shown on desktop devices with animations enabled
 */

import { useCursorFollower } from '@/hooks/use-cursor-follower'
import { cn } from '@/lib/utils'

export function CursorFollower() {
  const { isActive, cursorState } = useCursorFollower()

  if (!isActive) {
    return null
  }

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        body {
          cursor: none !important;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor circle */}
      <div
        data-cursor="main"
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-[9999]',
          'rounded-full border-2 border-primary',
          'transition-all duration-150 ease-out',
          'mix-blend-difference',
          cursorState.isClicking && 'scale-75',
          cursorState.isHovering && 'scale-[4] opacity-50 bg-primary/20',
          cursorState.isTextSelection && 'scale-y-[2] scale-x-[0.3] rounded-none',
          !cursorState.isHovering && !cursorState.isTextSelection && 'w-2 h-2'
        )}
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />

      {/* Trail cursor circle */}
      <div
        data-cursor="trail"
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-[9998]',
          'rounded-full border border-primary/50',
          'transition-all duration-300 ease-out',
          'mix-blend-difference',
          cursorState.isClicking && 'scale-90',
          cursorState.isHovering ? 'w-10 h-10 opacity-30' : 'w-8 h-8 opacity-60'
        )}
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
