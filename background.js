chrome.action.onClicked.addListener(async () => {
	const tabs = await chrome.tabs.query({});
	await chrome.storage.local.set({ archivedTabs: tabs });

	for (const tab of tabs) {
		await chrome.tabs.remove(tab.id);
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	chrome.tabs.create({ url: 'tabs.html' });
});
