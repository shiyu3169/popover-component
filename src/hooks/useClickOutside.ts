import { useEffect, useRef } from 'react'

export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) {
        callback()
      }
    }
    // Delay listener
    setTimeout(() => {
      document.addEventListener('click', onClick)
    }, 0)
    return () => {
      setTimeout(() => {
        document.removeEventListener('click', onClick)
      }, 0)
    }
  }, [callback])
  return ref
}
