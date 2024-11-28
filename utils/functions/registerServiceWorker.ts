export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      } catch (e) {
        console.log(e);
      }
    });
  }
}
