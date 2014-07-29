// SAMPLE
this.manifest = {
  "name": i18n.get("extension"),
  "icon": "../../icons/icon19.png",
  "settings": [{
    "tab": i18n.get("information"),
    "group": i18n.get("authentication"),
    "name": "token",
    "type": "text",
    "label": i18n.get("token"),
    "text": i18n.get("x-characters"),
    "attributes": {
      "maxlength": "32"
    }
  }, {
    "tab": i18n.get("information"),
    "group": i18n.get("authentication"),
    "name": "myDescription",
    "type": "description",
    "text": i18n.get("description")
  }, {
    "tab": i18n.get("information"),
    "group": i18n.get("verification"),
    "name": "verify",
    "type": "description",
    "text": i18n.get("verify")
  }, {
    "tab": i18n.get("information"),
    "group": i18n.get("notifications"),
    "name": "notifications",
    "type": "description"
  }, {
    "tab": i18n.get("information"),
    "group": i18n.get("pricing"),
    "name": "plans",
    "type": "description"
  }, {
    "tab": i18n.get("details"),
    "group": i18n.get("behaviour"),
    "name": "starting",
    "type": "checkbox",
    "label": i18n.get("starting"),
    "attributes": {
      'checked': 'checked'
    }
  }, {
    "tab": i18n.get("details"),
    "group": i18n.get("behaviour"),
    "name": "notification",
    "type": "checkbox",
    "label": i18n.get("notification"),
    "attributes": {
      'checked': 'checked'
    }
  }, {
    "tab": i18n.get("details"),
    "group": i18n.get("behaviour"),
    "name": "shutdown",
    "type": "checkbox",
    "label": i18n.get("shutdown")
  }, {
    "tab": "Open Source",
    "group": "Github",
    "name": "github",
    "type": "description",
    "text": "<a href='https://github.com/fentas/JiffyBox-chrome'>https://github.com/fentas/JiffyBox-chrome</a>"
  }, {
    "tab": "Open Source",
    "group": i18n.get("license"),
    "name": "license",
    "type": "description",
    "text": "<a href='http://choosealicense.com/licenses/agpl-3.0/'>GNU Affero GPL v3.0</a>"
  }, {
    "tab": i18n.get("donation"),
    "group": " ",
    "name": "comment",
    "type": "description",
    "text": i18n.get("comment")
  }, {
    "tab": i18n.get("donation"),
    "group": "BitCoin",
    "name": "bitcoin",
    "type": "description",
    "text": "197EypPopXtDPFK6rEbCw6XDEaxjTKP58S"
  }, {
    "tab": i18n.get("donation"),
    "group": "PayPal",
    "name": "paypal",
    "type": "description",
    "text": "jan.guth@gmail.com"
  }, {
    "tab": i18n.get("donation"),
    "group": "Flattr",
    "name": "flattr",
    "type": "description",
    "text": "<a href='https://flattr.com/submit/auto?user_id=jguth&url=https://github.com/fentas'>https://flattr.com/</a>"
  }],
  "alignment": [
    [
      "token"
    ]
  ]
};
