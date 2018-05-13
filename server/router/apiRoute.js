/*
	API routing
 */

var config = require("config");
var re = require("../app/resultExports");
var wc = require("../app/webCapture");
var hosturl = config.hosturl;

module.exports = {
	
	"/capture/": async (req, res, next) => {
		var buff = null;
		try {
			buff = await wc.captureManager(req, res);
			re.outputPNG(res, buff);
		}
		catch(e){
			try {
				req.query.url = `${hosturl}/error/?err=${e.name}&err_m=${e.message}`;
				buff = await wc.captureManager(req, res);
				re.outputPNG(res, buff);
			}
			catch(ex){
				re.errorResult(res, e, 0);
			}
		}
	},
	
	"/capture-json/": async (req, res, next) => {
		try {
			var buff = await wc.captureManager(req, res);
			var b64 = buff.toString("base64");
			re.successResult(res, b64);
		}
		catch(e){
			console.log(e);
			re.errorResult(res, e.toString(), 0);
		}
	},
	
};

