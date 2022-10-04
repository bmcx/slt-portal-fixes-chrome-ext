function onIcon() {
  chrome.action?.setIcon({
    path: {
      16: "images/on-16.png",
      32: "images/on-32.png",
      48: "images/on-48.png",
      64: "images/on-64.png",
      128: "images/on-128.png",
    },
  });
}
function offIcon() {
  chrome.action?.setIcon({
    path: {
      128: "images/off-128.png",
    },
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "myslt.slt.lk",
              pathPrefix: "/*",
            },
          }),
        ],
        actions: [onIcon],
      },
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "*",
            },
          }),
        ],
        actions: [offIcon],
      },
    ]);
  });
});
