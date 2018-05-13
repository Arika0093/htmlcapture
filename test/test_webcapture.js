
var wc = require("/server/app/webCapture");

module.exports = {
	forTestMethod: async function() {
		await wc.accessPage("https://wiztools.net/simulator/v/?id=Zs.7cX5eICR.1D38ffG5IQ==");
		await wc._page.setViewport({
			width: 1200,
			height: 800,
		});
		await wc.captureScreenshot({
			path: "test.png",
			dom: "#result > div.wraptb",
		});
		//console.log(b64);
	}
};
