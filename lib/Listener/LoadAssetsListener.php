<?php

declare(strict_types=1);

namespace OCA\FinderTheme\Listener;

use OCA\FinderTheme\AppInfo\Application;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Loads the styles and the compact toggle on every page (guest and public
 * share pages included), the sidebar rail on logged-in pages only. The scripts
 * only act on the Files app.
 *
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class LoadAssetsListener implements IEventListener {
	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}
		Util::addStyle(Application::APP_ID, 'finder');
		Util::addStyle(Application::APP_ID, 'guest');
		// Public shares follow the same compact/normal choice (same origin)
		Util::addScript(Application::APP_ID, 'compact');
		Util::addScript(Application::APP_ID, 'theme-color');
		if (!$event->isLoggedIn()) {
			return;
		}
		Util::addScript(Application::APP_ID, 'rail');
	}
}
