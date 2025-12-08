chrome.storage.local.get(['archivedTabs'], (result) => {
	const tabs = result.archivedTabs || [];
	document.body.textContent = JSON.stringify(tabs, null, 2);
});
