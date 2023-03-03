import { useCallback, useEffect, useRef } from 'react'

// TODO: better focusable query
const focusableQuery = ':is(input, button, [tab-index])'
/* 
  1. focus the first focusable
  2. attach keyboard event listener to trap the focus
  3. refocus the trigger after dismissing
*/

export function useFocusTrapping() {
  const ref = useRef<HTMLElement>(null)

  const tabNext = useCallback((e: KeyboardEvent) => {
    const content = ref.current
    if (!content) return
    const focusables = Array.from(content.querySelectorAll(focusableQuery))
    switch (e.key) {
      case 'Tab':
        const lastFocusable = focusables[focusables.length - 1]
        if (lastFocusable === document.activeElement) {
          e.preventDefault()
          // @ts-ignore, TODO: fix typing
          focusables[0].focus()
        }
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    const content = ref.current
    if (!content) return

    const focusables = Array.from(content.querySelectorAll(focusableQuery))

    // 1. focus the first focusable
    // @ts-ignore, TODO: fix typing
    focusables[0].focus()
    // 2. attach keyboard event listener to trap the focus
    document.addEventListener('keydown', tabNext)
    return () => {
      document.removeEventListener('keydown', tabNext)
    }
  }, [tabNext])
  return ref
}
