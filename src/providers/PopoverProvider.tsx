import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export type Rect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
export type Position = 'bottom-center' | 'bottom-left' | 'bottom-right'

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

const PopoverProvider = ({
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

export default PopoverProvider
export const usePopoverContext = () => useContext(PopoverContext)
