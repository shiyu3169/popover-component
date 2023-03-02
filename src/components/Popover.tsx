import {
  cloneElement,
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { getPopoverCoords } from '../utils/getPopoverCoords'

/* 
1. Popover - holds the state and methods, then expose it though context 
2. Trigger - attach the trigger method to children
3. Content - render conditionally based on the state though context
4. Close - attach the close method to children
*/

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
// TODO: More positions can be added here
export type Position = 'bottom-center' | 'bottom-left' | 'bottom-right'
export type Rect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
const defaultRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
}

const PopoverContext = createContext<{
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
  preferredPosition: Position
  triggerRect: Rect
  setTriggerRect: Dispatch<SetStateAction<Rect>>
}>({
  isShow: false,
  setIsShow: () => {
    throw new Error('PopoverCOntext setIsShow should be used under provider')
  },
  preferredPosition: 'bottom-center',
  triggerRect: defaultRect,
  setTriggerRect: () => {
    throw new Error(
      'PopoverContext setTriggerRect should be used under provider',
    )
  },
})

const Popover = ({
  children,
  preferredPosition = 'bottom-center',
}: {
  children: ReactNode
  preferredPosition?: Position
}) => {
  const [isShow, setIsShow] = useState(false)
  const [triggerRect, setTriggerRect] = useState(defaultRect)
  const contextValue = {
    isShow,
    setIsShow,
    preferredPosition,
    triggerRect,
    setTriggerRect,
  }
  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  )
}

/* --------------------------------- Trigger -------------------------------- */

const Trigger = ({ children }: { children: ReactElement }) => {
  const { setIsShow, setTriggerRect } = useContext(PopoverContext)
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
  const { isShow } = useContext(PopoverContext)
  if (!isShow) {
    return null
  }
  return <ContentInternal>{children}</ContentInternal>
}

const ContentInternal = ({ children }: { children: ReactNode }) => {
  const { triggerRect, preferredPosition } = useContext(PopoverContext)
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
  const { setIsShow } = useContext(PopoverContext)
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
