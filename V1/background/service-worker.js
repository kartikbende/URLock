chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "URLOCK_PAGE_SNAPSHOT") {
        if (!sender.tab) {
            sendResponse({ ok: false });
            return false;
        };

        const tabId = sender.tab.id;
        const snapshot = {
            url: message.payload.url,
            title: message.payload.title,
            capturedAt: Date.now(),
        };

        chrome.storage.session.set({ ["snapshot:" + tabId]: snapshot }).then(() => {
            console.log("Filed a snapshot for tab", tabId);
            sendResponse({ ok: true });
        });
        return true;
    }

    if (message.type === "URLOCK_GET_SNAPSHOT") {
        const key = "snapshot:" + message.tabId;
        chrome.storage.session.get(key).then((stored) => {
            const snapshot = stored[key] || null;

            if (snapshot === null) {
                sendResponse({ ok: true, status: "missing", snapshot: null });
                return;
            }
            if (snapshot.url !== message.tabUrl) {
                sendResponse({ ok: true, status: "stale", snapshot: null });
                return;
            }
            sendResponse({ ok: true, status: "current", snapshot: snapshot });
        });
        return true;
    }
});

