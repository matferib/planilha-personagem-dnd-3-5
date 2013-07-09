// Chrome background app.
chrome.app.runtime.onLaunched.addListener(function() {
  var w = chrome.app.window.create('planilha.html', { type: 'panel' });
});
