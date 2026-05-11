/**
 * Swaps .jpg ↔ .jpeg when an image fails to load.
 * Safe to use on any <img> onError or via swapImgExtension() for background-image elements.
 */
export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.dataset.retried) return
  img.dataset.retried = '1'
  const src = img.src
  if (src.endsWith('.jpg')) {
    img.src = src.replace(/\.jpg$/, '.jpeg')
  } else if (src.endsWith('.jpeg')) {
    img.src = src.replace(/\.jpeg$/, '.jpg')
  }
}

/**
 * For background-image elements: create a hidden probe <img>,
 * and if it errors, swap the extension on the target element's backgroundImage.
 */
export function probeBgImage(el: HTMLElement, src: string) {
  const probe = new Image()
  probe.src = src
  probe.onerror = () => {
    let alt = src
    if (src.endsWith('.jpg')) alt = src.replace(/\.jpg$/, '.jpeg')
    else if (src.endsWith('.jpeg')) alt = src.replace(/\.jpeg$/, '.jpg')
    el.style.backgroundImage = `url(${alt})`
  }
}
