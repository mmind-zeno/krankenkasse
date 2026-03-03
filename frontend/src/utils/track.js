export function getClientId() {
  if (typeof window === 'undefined') return null;
  try {
    const key = 'kkc_client_id';
    let id = window.localStorage.getItem(key);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function track(event, payload = {}) {
  if (typeof window === 'undefined' || !event) return;
  try {
    const clientId = getClientId();
    const safePayload = {
      ...payload,
      clientId,
      path: window.location?.pathname || null,
    };
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, payload: safePayload }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking is best-effort only
  }
}

