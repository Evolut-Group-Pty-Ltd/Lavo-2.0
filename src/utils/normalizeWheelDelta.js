export function normalizeWheelDelta(e) {
  if (e.detail && e.wheelDelta)
    return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) // Opera
  else if( e.deltaY )
    return -e.deltaY / 60 // Firefox
  else
    return e.wheelDelta / 120 // IE, Safari, Chrome
}