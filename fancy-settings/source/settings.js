window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
		var m = settings.manifest;
		jQuery(m.plans.bundle.parentNode.parentNode.parentNode).hide();
		jQuery(m.notifications.bundle.parentNode.parentNode.parentNode).hide();
	
		
		var jiffy = chrome.extension.getBackgroundPage().$.jiffybox;
		// Enter API-Token
		var token = null;
        m.token.addEvent("action", function (event) { 
			if ( token != this.element.value ) { 
				token = this.element.value;
				
				if ( ! /^[a-z\d]{32}$/i.test(token) ) {
					this.element.style['border-color'] = "#B00000";
					this.label.style['color'] = "#B00000";
				}
				else {
					// Call API
					jiffy.token = token;
					// validate connection/API-Token -- get plans/pricing
					if ( jiffy.load(validation) ) {
						jQuery(m.verify.element).html('<img src="../../core/images/loading.gif" alt="loading" class="loading">');
					}
				}
			}
	    });
	
		// Onload
		m.token.fireEvent("action");
		
		// funktions
		function validation(boxes, json) {
			jQuery(m.plans.bundle.parentNode.parentNode.parentNode).hide();
			jQuery(m.notifications.bundle.parentNode.parentNode.parentNode).hide();
		
			if ( json && json.result ) {
				jQuery(m.verify.element).html('Success!');
				// make token green
				m.token.element.style['border-color'] = "#00CC00";
				m.token.label.style['color'] = "#00B000";
			
				jQuery(m.plans.bundle.parentNode.parentNode.parentNode).show();
				
				var p = jQuery(m.plans.container).empty();
				for ( key in jiffy.plans ) {
					p.append('<div style="color:#606060;font-weight:bold;padding-bottom:5px;">' + jiffy.plans[key].name + '</div>');
					
					var style = "color:#606060;font-weight:bold;display:inline-block;width:150px;float:left;padding-left:10px;";
					p.append('<div><div style="' + style + '">' + 
							'Disk size</div><div>' + jiffy.plans[key].diskSizeInMB + ' MB</div></div>');
					p.append('<div><div style="' + style + '">' + 
							'RAM</div><div>' + jiffy.plans[key].ramInMB + ' MB</div></div>');
					p.append('<div><div style="' + style + '">' + 
							'Price per hour</div><div>' + jiffy.plans[key].pricePerHour + '</div></div>');
					p.append('<div><div style="' + style + '">' + 
							'Price per houre (Frozen)</div><div>' + jiffy.plans[key].pricePerHourFrozen + '</div></div>');
					p.append('<div style="padding-bottom:15px;"><div style="' + style + '">' + 
							'CPU\'s</div><div>' + jiffy.plans[key].cpus + '</div></div>');
				}
				
				// reload background page
				jiffy.load();
			}
			else {
				// keep it red
				m.token.element.style['border-color'] = "#B00000";
				m.token.label.style['color'] = "#B00000";
				
				jQuery(m.verify.element).html('An error occured!');
				
				
			}
			
			// display any massages
			if ( json.messages.length > 0 ) {
				jQuery(m.notifications.bundle.parentNode.parentNode.parentNode).show();
				
				var n = jQuery(m.notifications.element).empty();
				for ( var i = 0; i < json.messages.length; i++ ) {
					var color = {'error':'#B00000', 'warning':'#FFCC00', 'notice': '#606060', 'success': '#00B000'};
					n.append('<div> \
						<div style="color:' + color[json.messages[i].type] + ';font-weight:bold;display:inline-block;width:150px;float:left;">' + 
							json.messages[i].type + 
						'</div><div>' + json.messages[i].message + '</div> \
					</div>');
				}
			}
		}
    });
});
