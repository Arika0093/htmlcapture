/*
	JSON exports
 */

module.exports = {
	
	// output JSON	
	outputJSON: (res, param) => {
		res.header('Content-Type', 'application/json; charset=utf-8');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.send(param);
	},
	
	// output PNG
	outputPNG: (res, buff) => {
		res.header('Content-Type', 'image/png');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.send(buff);
	},
	
	// success output
	successResult: function (res, param) {
		this.outputJSON(res, {
			result: 1,
			datas: param,
		});
	},
	
	// error output
	errorResult: function (res, err_text, err_code = 0) {
		this.outputJSON(res, {
			result: err_code,
			datas: null,
			err_text: err_text,
		});
	}

	
	
};