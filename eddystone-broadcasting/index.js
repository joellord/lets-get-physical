var beacon = require("eddystone-beacon");
var options = {
	name: "MyBeacon"
};
var url = "https://goo.gl/SuTBBh";

beacon.advertiseUrl(url, options);