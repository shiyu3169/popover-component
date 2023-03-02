import { Position, Rect } from '../components/Popover'

export function getPopoverCoords(
  triggerRect: Rect,
  popoverRect: Rect,
  position: Position,
) {
  switch (position) {
    case 'bottom-center':
    default:
      // TODO: cover all postions
      let top = triggerRect.top + triggerRect.height + 10
      let left = Math.max(
        triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
        10,
      )
      // failover to top if there is not enough space
      if (top + popoverRect.height > window.innerHeight - 10) {
        top = triggerRect.top - 10 - popoverRect.height
      }
      return {
        top,
        left,
      }
  }
}
