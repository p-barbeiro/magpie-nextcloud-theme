/**
 * Compact list rows for the Files app.
 *
 * A button left of the grid/list toggle switches between normal and compact
 * rows. The state lives on <html data-nc-compact> and in localStorage
 * ("nc-compact"). The row height itself is read from localStorage by the
 * patched files-main.js (see bin/patch-files-main.sh), so a change reloads the
 * page: the virtual list only reads its item height on start. Styles are in
 * css/magpie.css.
 */
(() => {
	const KEY = 'nc-compact'
	const html = document.documentElement
	const compact = localStorage.getItem(KEY) === '1'
	html.toggleAttribute('data-nc-compact', compact)

	const button = document.createElement('button')
	button.type = 'button'
	button.className = 'nc-compact-toggle'
	const label = compact ? 'Normal rows' : 'Compact rows'
	button.setAttribute('aria-label', label)
	button.title = label
	// Three tight rows (compact) or two tall rows (normal), drawn here
	button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="'
		+ (compact
			? 'M3 5h18v2H3V5zm0 4h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v2H3v-2z'
			: 'M3 5h18v4H3V5zm0 6h18v4H3v-4zm0 6h18v2H3v-2z')
		+ '"/></svg>'
	button.addEventListener('click', () => {
		localStorage.setItem(KEY, compact ? '0' : '1')
		location.reload()
	})

	// The header mounts late and re-mounts on route changes; idempotent
	const sync = () => {
		const grid = document.querySelector('.files-list__header-grid-button')
		if (grid !== null && grid.previousElementSibling !== button) {
			grid.before(button)
		}
	}
	new MutationObserver(sync).observe(document.body, { childList: true, subtree: true })
	sync()
})()
