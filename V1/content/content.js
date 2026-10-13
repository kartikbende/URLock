console.log("URLock content script is running!");

chrome.runtime.sendMessage({
    type: "URLOCK_PAGE_SNAPSHOT",
    payload: { url: window.location.href, title: document.title },
}).then((reply) => {
    console.log("Service worker replied:", reply);
});