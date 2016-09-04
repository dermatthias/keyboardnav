chrome.commands.onCommand.addListener(function(command) {
  if (command == 'highlight-links') {
    // send to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "highlight"
          },
          function(response) {
          });
    });
  }
});