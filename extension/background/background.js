chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-with-disha",
    title: "Analyze with DISHA",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "analyze-with-disha") {
    return;
  }

  const selectedText = info.selectionText || "";

  if (!selectedText) {
    return;
  }

  const encodedText = encodeURIComponent(selectedText);

  const dishaUrl =
    `http://localhost:5173/analysis/new?text=${encodedText}`;

  chrome.tabs.create({
    url: dishaUrl,
  });
});