// SAMPLE
this.manifest = {
    "name": i18n.get("extension"),
    "icon": "../../icons/icon48.png",
    "settings": [
        {
            "tab": i18n.get("information"),
            "group": i18n.get("authentication"),
            "name": "token",
            "type": "text",
            "label": i18n.get("token"),
            "text": i18n.get("x-characters"),
			"attributes": {
				"maxlength": "32"
			}
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("authentication"),
            "name": "myDescription",
            "type": "description",
            "text": i18n.get("description")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("verification"),
            "name": "verify",
            "type": "description",
			"text": i18n.get("verify")
        },
		{
	       	"tab": i18n.get("information"),
			"group": i18n.get("notifications"),
	        "name": "notifications",
	        "type": "description"
	    },
		{
	      	"tab": i18n.get("information"),
			"group": i18n.get("pricing"),
	        "name": "plans",
	        "type": "description"
	    },
        {
            "tab": i18n.get("details"),
            "group":  i18n.get("behaviour"),
            "name": "starting",
            "type": "checkbox",
            "label": i18n.get("starting"),
			"attributes": {
				'checked': 'checked'
			}
        },
        {
            "tab": i18n.get("details"),
            "group": i18n.get("behaviour"),
            "name": "notification",
            "type": "checkbox",
            "label": i18n.get("notification"),
			"attributes": {
				'checked': 'checked'
			}
        },
        {
            "tab": i18n.get("details"),
            "group": i18n.get("behaviour"),
            "name": "shutdown",
            "type": "checkbox",
            "label": i18n.get("shutdown")
        }
    ],
    "alignment": [
        [
            "token"
        ]
    ]
};
