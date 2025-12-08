chrome.tabs.query({}, (tabs) => {
document.body.textContent = JSON.stringify(tabs, null, 2);
});
