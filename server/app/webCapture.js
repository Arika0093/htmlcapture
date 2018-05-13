/**
 * Webcapture
 *   Get Screenshot of Default / Full-page / Rectangle / DOM
 *   
 *   View Puppeteer Documentation!
 *      https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
 */

var puppeteer = require("puppeteer");
var extend = require("extend");

var re = require("./resultExports");
var dv = require("puppeteer/DeviceDescriptors");

module.exports = {
	
	_browser: null,
	
	SleepMax: 10000,
	TimeoutMax: 30000,
	
	captureOption: {
		url: "",                // require
		timeout: 10000,         // connection timeout(ms)
		await: 1000,            // await drawing(ms)
		device: undefined,      // emulated device
		width: 800,             // screen width
		height: 600,            // screen height
		dom: undefined,         // capture DOM
		full: false,            // is capture full-page
		waituntil: "domcontentloaded",  // waiting
	},
	
	launchBrowser: async function() {
		this._browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	},

	accessPage: async function(url) {
		if(!this._browser){
			await this.launchBrowser();
		}
		var co = this.captureOption;
		var _page = await this._browser.newPage();
		await _page.goto(url, {
			timeout: Math.min(co.timeout, this.TimeoutMax),
			waitUntil: co.waituntil,
		});
		return _page;
	},
	
	captureScreenshot: async function(p){
		var co = this.captureOption;
		var clip = undefined;
		if(co.dom){
			clip = await p.evaluate(s => {
				const el = document.querySelector(s);
				const { width, height, top: y, left: x } = el.getBoundingClientRect();
				return { width, height, x, y }
			}, decodeURIComponent(co.dom));
		} else if(co.clip){
			clip = co.clip;
		}
		// Screenshot's Buffer return
		var buff = await p.screenshot({
			// path: "", // for debug only
			clip,
			fullPage: co.full,
		});
		
		await p.close();
		//await this._browser.close();
		//this._browser = null;
		
		return buff;
	},
	
	captureManager: async function(req, res) {
		// POST or GET parameters
		var rds = req.query;
		if(!rds.url){
			throw { name: "Error", message: "URL is undefined" };
		}
		var rb = this.captureOption = extend(true, this.captureOption, rds);
		
		// access
		var _page = await this.accessPage(rb.url);
		// awaiting
		if(rb.await > 0){
			await this.sleep(Math.min(rb.await, this.SleepMax));
		}
		
		// emulator set
		if(rb.device){
			_page.emulate(dv[rb.device]);
		}
		// viewport set
		else {
			await _page.setViewport({
				width: rb.width - 0,
				height: rb.height - 0,
			});
		}
		
		// capture
		return await this.captureScreenshot(_page);
	},
	
	sleep: async (time) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, time);
		});
	}
};

