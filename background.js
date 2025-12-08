chrome.action.onClicked.addListener(async () => {
	// 1. Reset storage and initialize local array
	await chrome.storage.local.set({ archivedTabs: [] });
	let archivedTabs = [];

	// 2. Close all tabs sequentially
	while (true) {
		const currentTabs = await chrome.tabs.query({});
		if (currentTabs.length === 0) break;

		for (const tab of currentTabs) {
			try {
				// Update local array
				archivedTabs.push(tab);

				// Save to storage (crash resilience)
				await chrome.storage.local.set({ archivedTabs: archivedTabs });

				// Close tab
				await chrome.tabs.remove(tab.id);
			} catch (e) {
				// Ignore errors if tab is already closed, but alert others
				if (!e.message.includes('No tab with id')) {
					chrome.runtime.sendMessage({ type: 'error', message: `Failed to close tab: ${tab.id} - ${e.message}` });
				}
			}

			// Wait as requested
			await new Promise(resolve => setTimeout(resolve, 3e3)); // 3s
		}
	}

	// 3. Open Result Tab
	chrome.tabs.create({ url: 'tabs.html' });
});
