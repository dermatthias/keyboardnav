/******************************
 * Keyboard navigation - a Chrome extension
 *
 * UX is heavily inspired by Conkeror, probably the best keyboard-base browser out there.
 *
 * Author: Matthias Schneider, https://flurp.de
 * Source: https://github.com/dermatthias/keyboardnav
 */
var DEBUG = true;
var chosenLinkId = '';
var keys = {
  48: 0,
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5,
  54: 6,
  55: 7,
  56: 8,
  57: 9
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (sender.tab) {
    //log("from a content script:" + sender.tab.url);
  } else {
    //log("from the extension");
  }

  //****************
  // Highlight links
  //****************
  if (request.action == 'highlight') {
    // Resetting previous values on main shortcut
    chosenLinkId = '';

    // Highlighting links
    var links = $('a').addClass('kne-highlighted');
    $(links).each(function (index, element) {
      var linkid = index+1;
      $(this).attr('data-knelinkid', linkid);
      var hint = '<span class="kne-hint">'+linkid+'</span>';
      $(element).append(hint);
    });

    // start number listener
    $(window).on('keyup', function (event) {

      // 48 = digit 0, 57 = digit 9
      if (event.which >= 48 && event.which <= 57) {
        chosenLinkId += ('' + keys[event.which]);
        log('chosenLinkId: ' + chosenLinkId);
        highlightChosen();
      }

      // Enter pressed. Go there if marked link was found.
      if (event.which == 13) {
        var url = $('a.kne-highlighted-active').attr('href');
        if (url) {
          window.location = url;
        }
      }

      // Backspace
      if (event.which == 8) {
        // Remove last digit
        chosenLinkId = chosenLinkId.substring(0, chosenLinkId.length-1);
        highlightChosen();
        if (chosenLinkId.length == 0) {
          //clear();
        }
      }

      // Escape pressed. Undo everything.
      if (event.which == 27) {
        clear();
      }

    });

    // unused atm
    sendResponse({message: 1});
  }

});

function clear() {
  var link = $('a[data-knelinkid]');
  link.removeClass('kne-highlighted-active');
  link.removeClass('kne-highlighted');
  link.removeAttr('data-knelinkid');
  $('a .kne-hint').remove();
  $(window).off('keyup');
}

function highlightChosen() {
  // Reset all colors
  $('a[data-knelinkid]').removeClass('kne-highlighted-active');

  log('Chosen key: '+chosenLinkId);
  var chosenLink = $('a[data-knelinkid='+chosenLinkId+']');

  // Change background of chosen link
  chosenLink.addClass('kne-highlighted-active');
}

function log(o) {
  if (DEBUG) console.log(o);
}
