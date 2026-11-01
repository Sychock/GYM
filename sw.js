self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "ΤΕΛΟΣ ΞΕΚΟΥΡΑΣΗΣ", {
    body: d.body || "Πάμε για το επόμενο σετ.",
    tag: "rest-" + Date.now(), renotify: true, requireInteraction: true, silent: false,
    vibrate: [500, 150, 500, 150, 800],
    icon: "icon-192.png", badge: "icon-192.png"
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.registration.getNotifications().then(ns => ns.forEach(n => n.close())).then(() =>
    self.clients.matchAll({ type: "window", includeUncontrolled: true })).then(cs => {
    for (const c of cs) if ("focus" in c) return c.focus();
    return self.clients.openWindow("./");
  }));
});
