// get jiffybox instance
var $$ = null,
    jiffy = null,
    store = new Store('settings');

var t = chrome.runtime.getBackgroundPage(function(backgroundPage) {
  if ( backgroundPage ) {
    $$ = backgroundPage;
    jiffy = $$.$.jiffybox;

    if ( jiffy.loaded ) {
      var boxes = jiffy.get(),
          div = $('#content').show().find('.jiffyboxes');

      for ( var id in boxes ) {
        var details = boxes[id].details;
        div.append(get_html_jiffybox(details));
      }
    }
    else {
      $('#welcome').show().html('<h1>Manage your JiffyBOX!</h1> \
        <p>Before you can start, <br> you have to go \
        to the <a href="chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/options/index.html" target="_blank">option panal</a>!</p> \
        <p>Please <a href="http://guth.so" target="_blank">visit our site</a>!</p>');
    }
  }
});

// Set events
$(function() {
  // register event for each jiffybox
  $('.jiffybox').each(function(index, jiffybox) {
    register_events($(jiffybox));
  });
  // register reload event
  $('.options > .reload').bind('click', function(event) {
    jiffyboxes = $('.jiffyboxes').empty();
    $(this).find('div').eq(1).html('<img src="core/images/loading.gif" width="16" height="11" alt="Loading">');

    jiffy.empty();
    jiffy.load(reload, true);
  });
});

function register_events(jiffybox) {
  jiffybox.find('.main > .name').bind('click', function(event) {
    var head = $(this.parentNode.parentNode.parentNode);
    head.find('.details')
    .children().hide();
    head.find('.details').toggle('fast')
    .children().show();
  });

  jiffybox.find('.details input').bind('keyup', function(event) {
    var url = store.get('url');
    if ( ! url )
      url = {};

    url[$(this).attr('jiffybox')] = this.value;
    store.set('url', url);
  });

  jiffybox.find('.controls > div').bind('click', function(event) {
    var head = $(this.parentNode.parentNode.parentNode);
    var id = head.attr('jiffybox');
    if (false) {}

    head.find('.infos').html('<img src="core/images/loading.gif" width="16" height="11" alt="Loading">');
    head.find('.controls').remove();

    switch ( this.innerText ) {
      case "freeze":
        jiffy(id).freeze(reload_callback);
        break;
      case "thaw":
        var planid = head.find('select > option:selected').val();
        jiffy(id).thaw(reload_callback, planid);
        break;
      case "start":
        jiffy(id).start(reload_callback);
        break;
      case "shutdown":
        jiffy(id).shutdown(reload_callback);
        break;
      default:
        throw "Unknown command!";
    }
  });

  if ( jiffybox.hasClass('RUNNING') ) {
    jiffybox.find('.status').bind('click', function(event) {
      var url = store.get('url')[jiffybox.attr('id')];
      if ( url ) {
        url = (/^http:\/\/.*/.test(url) ? url : 'http://' + url);
        chrome.tabs.create({'url': url}, function(tab) {
            // Tab opened.
        });
      }
    });
  }
}

function reload(boxes) {
  for ( var id in boxes ) {
    var details = boxes[id].details;
    jiffyboxes.append(get_html_jiffybox(details));
    register_events($('#' + details.id));
  }
  $('.options > .reload div').eq(1).html('Reload');
}

// TODO: find another way to run this in background ...
function reload_callback(json) {
  if ( json.result ) {
    // start background updating - only if it is not already updating
    jiffy(json.result.id).jiffyBox($$.reload_jiffybox);
  }
  else {
    throw "An error occured";
  }
}

// TODO: solve this problem with a listener! (only workaround) -- DONE
function reload_ui(id) {
  var head = $('#' + id);
  // if a jiffybox is missing reload the whole
  if ( head.length === 0 ) {
    $('.options > .reload').click();
    return;
  }
  // update infos
  var details = jiffy(id).details;
  if ( details.running && ! details.runningSince ) {
    reload_ui(id);
  }
  head.replaceWith(get_html_jiffybox(details));
  register_events($('#' + id));
}

function update_running_information(id) {
  var details = jiffy(id).details;
  // TODO: BUG by Stopping?!
  if ( ! details.runningSince ) {
    setTimeout(function() {
      reload_ui(id);
    }, 50);
  }

  var infos = $('#' + id + ' .infos > div');
  if ( infos.length > 0 ) {
    var past = ((+new Date()) / 1000 - details.runningSince);
    infos.eq(0).html(
      (Math.floor(past / 3600) % 60).toFixed(0).replace(/^(\d)$/, '0$1') + ':'+
      (Math.floor(past / 60) % 60).toFixed(0).replace(/^(\d)$/, '0$1') + ':' +
      (past % 60).toFixed(0).replace(/^(\d)$/, '0$1')); // days: Math.round((past / 86400) % 24) + ':' +
    infos.eq(1).html((past / 3600 * details.plan.pricePerHour).toFixed(4) + ' &euro;');
  }

  if ( details.running ) {
    setTimeout(function() {
      update_running_information(id);
    }, 1000);
  }
}

function get_html_jiffybox(details) {
  var info1 = details.plan.name;
  var info2 = details.activeProfile.disks.xvda.name.replace(/^(.{1,15}).*$/, '$1');
  if ( details.running ) {
    info1 = info2 = '-';
    // update time faster
    setTimeout(function() {
      update_running_information(details.id);
    }, 200);
  }

  var cntrl1, ntrl2, is_ing = false;
  if ( ! /^(UPDATING|FREEZING|THAWING|STOPPING|STARTING)$/.test(details.status) ) {
    cntrl1 = 'start';
    cntrl2 = 'freeze';
    if ( details.status == 'FROZEN' ) {
      cntrl2 = 'thaw';
      cntrl1 = '';

      // make plan choosable
      info1 = '<select class="plans">';
      for ( var id in jiffy.plans ) {
        info1 += '<option value="' + id + '">' + jiffy.plans[id].name + '</option>';
      }
      info1 += '</select>';
    }
    else if ( details.running ) {
      cntrl1 = 'shutdown';
      cntrl2 = '';
    }
  }
  else {
    is_ing = true;
  }

  var url = store.get('url');

  var html = '\
  <div class="jiffybox ' + details.status + ' ' + (details.running?'RUNNING':'') + '" jiffybox="' + details.id + '" id="' + details.id + '"> \
    <div class="overview"> \
      <div class="main"> \
        <div class="name">' + details.name + '</div> \
        <div class="status">' + details.status + '</div> \
      </div> \
      <div class="infos">';
      if ( is_ing )  {
        html += '\
        <img src="core/images/loading.gif" width="16" height="11" alt="Loading">';
      }
      else {
        html += '\
        <div class="">' + info1 + '</div> \
        <div class="">' + info2 + '</div>';
      }
      html += '\
      </div>';
    if ( ! is_ing )  {
      html += '\
      <div class="controls"> \
        <div>' + cntrl1 + '</div> \
        <div>' + cntrl2 + '</div> \
      </div>';
    }
      html += '\
    </div> \
    <div class="details"> \
      <div> \
        <div>ip(s) public</div> \
        <div>';
        for ( var ip in details.ips.public ) {
          html += '<div>' + details.ips.public[ip] + '</div>';
        }
        html += '\
        </div> \
      </div> \
      <div> \
        <div>ip(s) private</div> \
        <div>';
        for ( ip in details.ips.private ) {
          html += '<div>' + details.ips.private[ip] + '</div>';
        }
        html += '\
        </div> \
      </div> \
      <div> \
        <div>URL</div> \
        <div> \
          <input type="text" value="' + (url && url[details.id] ? url[details.id] : '') + '" jiffybox="' + details.id + '" ' + (is_ing?'DISABLED':'') + '> \
        </div> \
      </div> \
    </div> \
  </div>';
  return html;
}
