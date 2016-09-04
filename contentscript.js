/******************************
 * Keyboard navigation - a chrome extension
 *
 * UX is heavily inspired by Conkeror, probably the best keyboard-base browser out there.
 *
 * Author: Matthias Schneider, https://flurp.de
 * Source: https://github.com/dermatthias/keyboardnav
 */
var DEBUG = true;

var chosenLinkId = '';
var timeoutId = -1;
var delay = 200;

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


    // resettting all values on main shortcut
    chosenLinkId = '';
    clearTimeout(timeoutId);
    timeoutId = -1;


    // highlightning links
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

        // start timeout on the first character, reset on second and more charater
        if (chosenLinkId == '') {
          timeoutId = setTimeout(highlightChosen, delay);
          log('starting initial timeout ' + timeoutId);
        } else {
          log('clearing and resetting timeout ' + timeoutId);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(highlightChosen, delay);
        }

        chosenLinkId += ('' + keys[event.which]);
        log('chosenLinkId: ' + chosenLinkId);

      }

      if (event.which == 13) {
        var url = $('a.kne-highlighted-active').attr('href');
        if (url) {
          window.location = url;
        }
      }

      // escape
      if (event.which == 27) {
        $('a[data-knelinkid]').removeClass('kne-highlighted-active');
        $('a[data-knelinkid]').removeClass('kne-highlighted');
        $('a[data-knelinkid]').removeAttr('data-knelinkid');
        $('a .kne-hint').remove();
        $(window).off('keyup');
      }

    });

    // unused atm
    sendResponse({message: 1});
  }

});

function highlightChosen() {
  // reset all colors
  $('a[data-knelinkid]').removeClass('kne-highlighted-active');

  log('Chosen key: '+chosenLinkId);
  var chosenLink = $('a[data-knelinkid='+chosenLinkId+']');

  // change background of chosen link
  chosenLink.addClass('kne-highlighted-active');

  chosenLinkId = '';
  timeoutId = -1;
}



function log(o) {
  if (DEBUG) console.log(o);
}

