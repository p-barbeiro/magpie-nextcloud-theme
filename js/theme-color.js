/**
 * Browser / installed-app (PWA) title bar color: Nextcloud sets
 * <meta name="theme-color"> to the accent, but the page header is the plain
 * background color (see css/magpie.css), so match that instead.
 */
(() => {
	const apply = () => {
		const color = getComputedStyle(document.body).getPropertyValue('--color-background-plain').trim()
		if (color) {
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
		}
	}
	apply()
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply)
})()
