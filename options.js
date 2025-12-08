const defaultFormat = '${title} - ${url}';

document.addEventListener('DOMContentLoaded', async () => {
	const formatInput = document.getElementById('formatInput');
	const saveBtn = document.getElementById('saveFormat');
	const downloadBtn = document.getElementById('downloadJson');
	const contentDiv = document.getElementById('content');

	// Load saved format
	const storage = await chrome.storage.local.get(['tabFormat', 'archivedTabs']);
	const format = storage.tabFormat || defaultFormat;
	const tabs = storage.archivedTabs || [];

	formatInput.value = format;
	renderTabs(tabs, format);

	// Save Format
	saveBtn.addEventListener('click', async () => {
		const newFormat = formatInput.value;
		await chrome.storage.local.set({ tabFormat: newFormat });
		renderTabs(tabs, newFormat);
		alert('Format saved!');
	});

	// Download JSON
	downloadBtn.addEventListener('click', () => {
		const blob = new Blob([JSON.stringify(tabs, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'archived_tabs.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	});

	function renderTabs(tabs, format) {
		const lines = tabs.map(tab => {
			return format.replace(/\$\{(.+?)\}/g, (match, p1) => {
				return tab[p1] !== undefined ? tab[p1] : match;
			});
		});
		contentDiv.textContent = lines.join('\n');
	}
});
