export function initBridge(adminOrigin) {
    window.navigation.addEventListener("navigate", (event) => {
        parent.postMessage({type: 'URL_CHANGE', url: event.destination.url}, adminOrigin);
    })
}
