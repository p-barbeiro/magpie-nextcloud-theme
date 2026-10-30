/**
 * Collapsible sidebar rail for the Files app.
 *
 * A button at the top of the Files navigation toggles between the full
 * sidebar and an icons-only rail. The state lives on <html data-nc-rail>
 * (not on the navigation element: Vue rewrites its class list on every
 * re-render) and is remembered in localStorage. Styles are in css/magpie.css;
 * below 1024px the button is hidden there and Nextcloud's own mobile
 * navigation applies.
 */
(() => {
	const KEY = 'nc-rail'
	const NAV_SELECTOR = '#content-vue.app-files .app-navigation'
	const html = document.documentElement

	const apply = (on) => {
		html.toggleAttribute('data-nc-rail', on)
		localStorage.setItem(KEY, on ? '1' : '0')
	}
	apply(localStorage.getItem(KEY) === '1')

	const button = document.createElement('button')
	button.type = 'button'
	button.className = 'nc-rail-toggle'
	button.setAttribute('aria-label', 'Toggle sidebar')
	button.title = 'Toggle sidebar'
	// Sidebar glyph (window with a left pane), drawn here, no external asset
	button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">'
		+ '<path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h5V6H4zm7 0v12h9V6h-9z"/></svg>'
	button.addEventListener('click', () => apply(!html.hasAttribute('data-nc-rail')))

	// Keep the button in place, left of the search field in the same row (no
	// extra row that would push the last entries out of the sidebar). The
	// navigation mounts late and can re-mount on route changes. Entries also
	// get a tooltip, since names are hidden in rail mode. Idempotent, so the
	// observer cannot re-trigger itself.
	const sync = () => {
		const nav = document.querySelector(NAV_SELECTOR)
		if (nav === null) {
			return
		}
		const row = nav.querySelector('.app-navigation-search')
		if (row !== null && button.parentElement !== row) {
			row.prepend(button)
		}
		nav.querySelectorAll('.app-navigation-entry-link').forEach((link) => {
			const name = link.querySelector('.app-navigation-entry__name')
			if (!link.title && name !== null) {
				link.title = name.textContent.trim()
			}
		})
	}

	new MutationObserver(sync).observe(document.body, { childList: true, subtree: true })
	sync()
})()
