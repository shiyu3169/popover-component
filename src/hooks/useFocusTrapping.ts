import { useEffect, useRef } from 'react'

// TODO: better focusable query
const focusableQuery = ':is(input, button, [tab-index])'
/* 
  1. focus the first focusable
  2. attach keyboard event listener to trap the focus
  3. refocus the trigger after dismissing
*/
export function useFocusTrapping() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const content = ref.current
    if (!content) return

    const focusables = Array.from(content.querySelectorAll(focusableQuery))

    // 1. focus the first focusable
    // @ts-ignore, TODO: fix typing
    focusables[0].focus()
  }, [])
  return ref
}
