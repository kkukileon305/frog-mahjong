export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const a = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
      } catch (e) {}
    });
  }
}
