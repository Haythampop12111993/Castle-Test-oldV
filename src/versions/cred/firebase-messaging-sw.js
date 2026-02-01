importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCxcYMHon01CkcZeQSsLdWVng1ADNi_MRc",
  projectId: "castle-development-d01d2",
  messagingSenderId: "970099379750",
  appId: "1:970099379750:web:eadede5f331488a95ae0e7",
};

firebase.initializeApp(firebaseConfig);

// intercept notification
class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

self.addEventListener("push", (e) => {
  if (e.custom) return;

  let oldData = e.data;
  let newEvent = new CustomPushEvent({
    data: {
      old: oldData.json(),
      json() {
        let newData = oldData.json();
        newData.data = {
          ...newData.data,
          notification: newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  e.stopImmediatePropagation();
  dispatchEvent(newEvent);
});

// listen on click
self.addEventListener("notificationclick", (event) => {
  const base = self.location.origin;
  event.notification.close();

  const link = new URL(base).href + "notifications";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        const hadWindowToFocus = clientsArr.some((windowClient) =>
          windowClient.url === link ? (windowClient.focus(), true) : false
        );

        if (!hadWindowToFocus)
          self.clients
            .openWindow(link)
            .then((windowClient) =>
              windowClient ? windowClient.focus() : null
            );
      })
      .catch((e) => e)
  );
});

// handel messages
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("background message:", payload);
  const notificationTitle = payload.data.notification.title;
  const notificationOptions = {
    body: payload.data.notification.body,
    data: payload.data,
  };

  self.clients
    .matchAll({
      includeUncontrolled: true,
      type: "window",
    })
    .then((clients) => {
      if (clients && clients.length) {
        // Send a response - the clients
        // array is ordered by last focused
        clients[0].postMessage({
          type: "NEW-CUSTOM-NOTIFICATION",
          notification: payload,
        });
      }
    });

  self.registration.showNotification(notificationTitle, notificationOptions);
});
