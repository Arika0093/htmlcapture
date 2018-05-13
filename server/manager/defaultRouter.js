/*
	Main Routing Manager
 */

var express = require("express");
var subdomain = require("express-subdomain");
var api = require("../router/apiRoute");

module.exports = (app) =>{

	// API ROUTING ------------------------------------
	var api_router = express.Router({});
	for(api_key of Object.keys(api)){
		api_router.use(api_key, api[api_key]);
	}
	app.use(api_router);//subdomain("api", api_router));
	
	// ROUTING DEFAULT --------------------------------
	// 404 Not found
	app.use(function(req, res, next){
		var err = new Error('Not Found');
		err.status = 404;
		err.stack = "invalid URL";
		
		res.locals.message = err.message;
		res.locals.error = err;
		res.render('error');
		//next(err);
	});

	// 500 Internal ERROR
	app.use(function(err, req, res, next){
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		
		// render the error _page
		res.status(err.status || 500);
		res.render('error');
	});
	
};