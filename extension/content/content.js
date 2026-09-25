chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SELECTED_TEXT") {
    const selectedText = window.getSelection().toString().trim();

    sendResponse({
      text: selectedText,
    });

    return true;
  }

  if (message.type === "DISHA_ANALYZE") {
    console.log("DISHA selected text:", message.text);

    alert(
      "DISHA received:\n\n" +
      message.text
    );
  }
});