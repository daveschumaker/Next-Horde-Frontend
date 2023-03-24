import { HORDE_DEV, HORDE_PROD } from '../_constants'
import AppSettings from '../models/AppSettings'

export const logError = async (data: any) => {
  await fetch(`/artbot/api/log-error`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const clientHeader = () => {
  return `ArtBot:v.1:(discord)rockbandit#4910`
}

export const isAppActive = () => {
  if (AppSettings.get('runInBackground')) {
    return true
  }

  if (document.visibilityState === 'visible') {
    return true
  }

  return false
}

export const isInstalledPwa = () => {
  // @ts-ignore
  if (window?.navigator?.standalone) {
    // Installed on iOS
    return true
  } else if (window?.matchMedia('(display-mode: standalone)')?.matches) {
    // Installed on Android
    return true
  }

  return false
}

// Simple UUID generator for ArtBot's own purposes (tracking groups of images generated at once)
// Since this will only be used for lookup's on a user's own device, it's safe to use.
// Do not seriously use it in any sort of mission critical production environment.
// https://stackoverflow.com/a/2117523
export function uuidv4() {
  //@ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export const getApiHostServer = () => {
  if (AppSettings.get('useBeta') || AppSettings.get('useBeta') === 'userTrue') {
    return HORDE_DEV
  }

  return HORDE_PROD
}

///////

export const isiOS = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator?.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

let scrollOffset = 0

export const lockScroll = () => {
  const scrollBarCompensation = window.innerWidth - document.body.offsetWidth

  document.body.dataset.scrollLock = 'true'
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollBarCompensation}px`

  if (isiOS()) {
    scrollOffset = window.pageYOffset
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollOffset}px`
    document.body.style.width = '100%'
  }
}

export const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''

  if (isiOS()) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, scrollOffset)
  }

  delete document.body.dataset.scrollLock
}

export const enterFullScreen = (element: any) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen() // Firefox
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen() // Safari
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen() // IE/Edge
  }
}

export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen()
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen()
  }
}
