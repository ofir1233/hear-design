/**
 * Downloads any icon React component as a standalone .svg file.
 *
 * Uses react-dom/server.browser via a dynamic import so this module
 * is never statically analyzed into the production bundle.
 * The dynamic import fires only when a user clicks a download button
 * inside the dev-only inspector, which is itself excluded from prod.
 */

export async function downloadIconAsSvg(IconComponent, name) {
  const { renderToStaticMarkup } = await import('react-dom/server.browser')

  const markup = renderToStaticMarkup(<IconComponent />)

  // Ensure the root <svg> tag carries an xmlns attribute
  const svg = markup.includes('xmlns')
    ? markup
    : markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `${name}.svg`,
  })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
