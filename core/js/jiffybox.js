(function($) {
	/**
	* URL: https://api.jiffybox.de/<API-Token>/v1.0/<modul>[/<bereich>][/<bereich N>
	*
	**/	
	var _defaults = {
		api_url: 'https://api.jiffybox.de/',
		version: 'v1.0',
		// jiffybox id
		jiffybox_id: null,
		// default plan (CloudLevel 1)
		plan_id: 10
	}
	
	// registered boxes
	var jiffyboxes = {};
	
	// construct
	$.jiffybox = function(identifier, defaults) {
		// Validate token
		if ( $.jiffybox.token == null ) {
			throw "You have to set API-Token! [$.jiffybox.token = <<API-Token>>]";
			return false;
		}
		else if ( ! /^[a-z\d]{32}$/i.test($.jiffybox.token) ) {
			throw "Given API-Token is not valid!";
			return false;
		}
		
		var defaults = $.extend({}, _defaults, defaults);
		if ( ! identifier || identifier == '' ) {
			return new jiffybox($.jiffybox.token, defaults);
		}
		if ( ! jiffyboxes[identifier] ) {
			defaults['jiffybox_id'] = identifier;
			
			jiffyboxes[identifier] = new jiffybox($.jiffybox.token, defaults);
		}
		return jiffyboxes[identifier];
	};
	
	/**
	* globals
	**/
	// API-Token
	$.jiffybox.token = null;
	// get all jiffyboxes
	$.jiffybox.get = function() {
		return jiffyboxes;
	};
	$.jiffybox.empty = function() {
		jiffyboxes = {};
	};
	// load all instances
	$.jiffybox.load = function(callback, without_plans, without_clean) {
		var jiffy = $.jiffybox();
		var _this = this;
		var call = callback;
		
		if ( ! without_plans ) {
			plans = function(json) {
				// check if it is a valid response
				if ( json.result ) {
					// register all boxes
					$.jiffybox.plans = json.result;
				}
				else throw "could not load plans & pricing [" + json.messages[0].message + "]";
			};
			jiffy.plans(plans);
		}
		
		callback = function(json) {
			// check if it is a valid response
			if ( json.result ) {
				// register all boxes
				for ( box in json.result ) {
					var jiffy = $.jiffybox(box);
					jiffy.details = json.result[box];
				}
				$.jiffybox.loaded =  true;
			}
			else throw "could not load jiffyboxes [" + json.messages[0].message + "]";
			
			if ( $.isFunction(call) )
				call($.jiffybox.get(), json);
		};
		
		if ( jiffy.jiffyBoxes(callback) ) {
			return true;
		}
		return false;
	};
	//plans
	$.jiffybox.plans = null;
	$.jiffybox.loaded = false;
	
	
	
	// ---
	
	function jiffybox(token, defaults) {
		this._token = token;
		this._defaults = $.extend({}, _defaults, defaults);
	}
	
	jiffybox.prototype = {
		_token: null,
		_defaults: null,
		
		details: null,
		
		plans: function(callback) {
			if ( ! $.isFunction(callback) )
				identifier = callback;
			
			var url = get_url.apply(this, ['plans']);
			$.get(url, {}, callback, 'json');
			return true;
		},
		
		/**
		* Load jiffyboxes
		**/
		jiffyBox: function(callback, identifier) {
			if ( ! $.isFunction(callback) )
				identifier = callback;
				
			identifier = identifier || this._defaults.jiffybox_id;
			if ( ! check_indentifier(identifier) ) return false;
			
			var _this = this;
			var call = callback;
			callback = function(json) {
				if ( json.result ) {
					_this.details = json.result;
					_this._defaults['jiffybox_id'] = identifier;
				}
				call(json);
			};
			
			var url = get_url.apply(this, ['jiffyBoxes', [identifier]]);
			$.get(url, {}, callback, 'json');
			return true;
		},
		jiffyBoxes: function(callback) {
			if ( ! check_callback(callback) ) return  false;
			
			var url = get_url.apply(this, ['jiffyBoxes']);
			$.get(url, {}, callback, 'json');
			return true;
		},
		
		/**
		* Direct jiffiybox commands
		**/
		freeze: function(callback, identifier) {
			if ( ! $.isFunction(callback) ) { identifier = callback; callback = null; }
			
			identifier = identifier || this._defaults.jiffybox_id;
			if ( ! check_indentifier(identifier) ) return false;
			
			var url = get_url.apply(this, ['jiffyBoxes', [identifier]]);
			$.put(url, {status: 'FREEZE'}, callback, 'json');
			return true;
		},
		thaw: function(callback, plan_id, identifier) {
			if ( ! $.isFunction(callback) ) { identifier = plan_id; plan_id = callback; callback = null; }
			
			var plan_id = plan_id || this._defaults.plan_id;
			if ( ! check_plan_id(plan_id) ) return false;
			
			identifier = identifier || this._defaults.jiffybox_id;
			if ( ! check_indentifier(identifier) ) return false;
			
			var url = get_url.apply(this, ['jiffyBoxes', [identifier]]);
			$.put(url, {status: 'THAW', planid: plan_id}, callback, 'json');
			return true;
		},
		shutdown: function(callback, identifier) {
			if ( ! $.isFunction(callback) ) { identifier = callback; callback = null; }
			
			identifier = identifier || this._defaults.jiffybox_id;
			if ( ! check_indentifier(identifier) ) return false;
			
			var url = get_url.apply(this, ['jiffyBoxes', [identifier]]);
			$.put(url, {status: 'SHUTDOWN'}, callback, 'json');
			return true;
		},
		start: function(callback, identifier) {
			if ( ! $.isFunction(callback) ) { identifier = callback; callback = null; }
			
			identifier = identifier || this._defaults.jiffybox_id;
			if ( ! check_indentifier(identifier) ) return false;
			
			var url = get_url.apply(this, ['jiffyBoxes', [identifier]]);
			$.put(url, {status: 'START'}, callback, 'json');
			return true;
		}
		
		/**
		* Backup functions
		**/
		
		/**
		* Create/Delete
		**/
	};
	
	function check_plan_id(plan_id) {
		if ( ! /^\d+$/.test(plan_id) ) {
			throw "Plan ID is missing!";
			return false;
		}
		return true;
	}
	function check_indentifier(identifier) {
		if ( ! /^\d+$/.test(identifier) ) {
			throw "jiffybox ID is missing!";
			return false;
		}
		return true;
	}
	function check_callback(callback) {
		if ( ! $.isFunction(callback) ) {
			throw "callback have to be a function!";
			return false;
		}
		return true;
	}
	
	function get_url(module, args) {
		return (this._defaults.api_url + '/' + 
			this._token + '/' + 
			this._defaults.version + '/' +
			module + 
			(args ? '/' + args.join('/') : '' )).replace(/\/+/g, '/');
	}
	
	/* Extend jQuery with functions for PUT and DELETE requests. */
	function _ajax_request(url, data, callback, type, method) {
	    if (jQuery.isFunction(data)) {
	        callback = data;
	        data = {};
	    }
	    return jQuery.ajax({
	        type: method,
	        url: url,
	        data: data,
	        success: callback,
	        dataType: type
	        });
	}

	$.extend({
	    put: function(url, data, callback, type) {
	        return _ajax_request(url, data, callback, type, 'PUT');
	    },
	    delete_: function(url, data, callback, type) {
	        return _ajax_request(url, data, callback, type, 'DELETE');
	    }
	});
	
})(jQuery);