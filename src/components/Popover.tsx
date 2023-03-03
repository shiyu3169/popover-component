import {
  cloneElement,
  ReactElement,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useFocusTrapping } from '../hooks/useFocusTrapping'
import PopoverProvider, {
  Position,
  usePopoverContext,
} from '../providers/PopoverProvider'
import { getPopoverCoords } from '../utils/getPopoverCoords'

/* 
1. Popover - holds the state and methods, then expose it though context 
2. Trigger - attach the trigger method to children
3. Content - render conditionally based on the state though context
4. Close - attach the close method to children
*/

const Popover = ({
  children,
  preferredPosition = 'bottom-center',
}: {
  children: ReactNode
  preferredPosition?: Position
}) => {
  return (
    <PopoverProvider preferredPosition={preferredPosition}>
      {children}
    </PopoverProvider>
  )
}

/* --------------------------------- Trigger -------------------------------- */

const Trigger = ({ children }: { children: ReactElement }) => {
  const { setIsShow, setTriggerRect } = usePopoverContext()
  const onClick = () => {
    const element = ref.current
    if (!element) {
      return
    }
    const rect = element.getBoundingClientRect()
    setTriggerRect(rect)
    setIsShow((isShow) => !isShow)
  }

  const ref = useRef<HTMLElement>(null)

  const childrenToTriggerPopover = cloneElement(children, {
    onClick, // TODO: Ideally, we should merge the existing onClick with this.
    ref, // TODO: ref should also be merged with existing one
  })
  return childrenToTriggerPopover
}

/* --------------------------------- Content -------------------------------- */

const Content = ({ children }: { children: ReactNode }) => {
  const { isShow } = usePopoverContext()
  if (!isShow) {
    return null
  }
  return <ContentInternal>{children}</ContentInternal>
}

const ContentInternal = ({ children }: { children: ReactNode }) => {
  const { triggerRect, preferredPosition } = usePopoverContext()
  const [coords, setCoords] = useState({ left: 0, top: 0 })
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const coords = getPopoverCoords(triggerRect, rect, preferredPosition)
    setCoords(coords)
  }, [preferredPosition, triggerRect])

  const refFocusTrapping = useFocusTrapping()

  return (
    <dialog
      ref={ref}
      open
      style={{
        margin: 0,
        position: 'fixed',
        left: `${coords.left}px`,
        top: `${coords.top}px`,
      }}
    >
      {children}
    </dialog>
  )
}

/* ---------------------------------- Close --------------------------------- */

const Close = ({ children }: { children: ReactElement }) => {
  const { setIsShow } = usePopoverContext()
  const onClick = () => {
    setIsShow(false)
  }
  const childrenToClosePopover = cloneElement(children, {
    onClick, // TODO: Ideally, we should merge the existing onClick with this.
  })
  return childrenToClosePopover
}

Popover.Trigger = Trigger
Popover.Content = Content
Popover.Close = Close
export default Popover
