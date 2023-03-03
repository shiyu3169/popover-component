type Mutable<T> = {
  -readonly [k in keyof T]: T[k]
}

export const mergeRef =
  <T>(...refs: React.Ref<T>[]) =>
  (value: T): void => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref) {
        ;(ref as Mutable<React.RefObject<T>>).current = value
      }
    }
  }
