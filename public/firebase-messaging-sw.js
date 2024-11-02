importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyB2kuteEViayoLANLWE7S7usPcc77whoxA",
  authDomain: "fbdemo-f9d5f.firebaseapp.com",
  projectId: "fbdemo-f9d5f",
  storageBucket: "fbdemo-f9d5f.appspot.com",
  messagingSenderId: "487441071572",
  appId: "1:487441071572:web:f5f7e18b1d926b6cb5ea41"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
