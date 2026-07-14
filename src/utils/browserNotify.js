// Desktop/system notifications via the Web Notifications API. These surface on
// the display screen even when the SaralBuy tab is in the background (as long as
// the page is open in some tab). Fully-closed delivery would need a service
// worker + web-push, which is a larger effort.

export function ensureNotifyPermission() {
  try {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  } catch {
    /* no-op */
  }
}

export function showBrowserNotification(title, { body = '', tag, icon = '/favicon.png' } = {}, onClick) {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const n = new Notification(title || 'SaralBuy', {
      body,
      icon,
      badge: icon,
      tag, // same tag replaces an existing notification instead of stacking
      renotify: !!tag,
    });
    n.onclick = () => {
      window.focus();
      if (onClick) onClick();
      n.close();
    };
    setTimeout(() => n.close(), 8000);
  } catch {
    /* no-op */
  }
}
