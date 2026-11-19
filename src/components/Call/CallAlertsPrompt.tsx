import { useState } from 'react';
import { GoBell } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { enableCallNotifications, isPushSupported, notificationPermission } from '@/library/push/notifications';

const DISMISS_KEY = 'careconnect:call-alerts-dismissed';

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

/** Small opt-in banner for call notifications (permission must come from a click). */
const CallAlertsPrompt = () => {
  const [permission, setPermission] = useState(notificationPermission);
  const [dismissed, setDismissed] = useState(readDismissed);
  const [busy, setBusy] = useState(false);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // private mode: just hide for this session
    }
  };

  if (dismissed) return null;

  // iPhone/iPad only allow web push for sites added to the Home Screen.
  const iosNeedsInstall = isIOS() && !isStandalone() && !isPushSupported();
  if (!iosNeedsInstall && permission !== 'default') return null;

  const enable = async () => {
    setBusy(true);
    const result = await enableCallNotifications().catch(() => 'denied' as const);
    setBusy(false);
    setPermission(result);
    if (result === 'granted') toast.success("Call alerts are on. We'll notify you even when CareConnect is closed.");
    else if (result === 'denied') toast.error('Notifications are blocked. You can allow them in your browser settings.');
  };

  return (
    <div className='mt-3 flex items-start gap-3 rounded-xl bg-primaryColor/10 p-3 text-[13px] text-gray-700'>
      <GoBell className='mt-0.5 size-5 shrink-0 text-primaryColor' />
      <div className='flex-1'>
        {iosNeedsInstall ? (
          <p>
            To get call alerts on iPhone, tap <strong>Share</strong> then <strong>Add to Home Screen</strong>, and open
            CareConnect from there.
          </p>
        ) : (
          <>
            <p>Get notified about calls, even when CareConnect is closed.</p>
            <button
              type='button'
              onClick={enable}
              disabled={busy}
              className='mt-1 font-semibold text-primaryColor cursor-pointer disabled:opacity-50'
            >
              {busy ? 'Enabling…' : 'Turn on call alerts'}
            </button>
          </>
        )}
      </div>
      <button type='button' onClick={dismiss} aria-label='Dismiss' className='cursor-pointer text-gray-500'>
        <IoClose size={18} />
      </button>
    </div>
  );
};

export default CallAlertsPrompt;
