async function init() {
    const statusEl = document.getElementById("status");
    const titleEl = document.getElementById("page-title");
    const urlEl = document.getElementById("page-url");

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const reply = await chrome.runtime.sendMessage({
            type: "URLOCK_GET_SNAPSHOT",
            tabId: tab.id,
            tabUrl: tab.url,
        });

        if (!reply || reply.status === "missing") {
            statusEl.textContent = "No data for this tab yet. Try reloading the page.";
            return;
        }
        if (reply.status === "stale") {
            statusEl.textContent = "This page just changed. Give it a moment and reopen the popup.";
            return;
        }

        statusEl.textContent = "Data received from this page:";
        titleEl.textContent = reply.snapshot.title || "(no title)";
        urlEl.textContent = reply.snapshot.url;
    } catch (error) {
        statusEl.textContent = "Error: " + error.message;
    }
}

init();