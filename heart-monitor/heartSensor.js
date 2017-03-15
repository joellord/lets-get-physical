var HeartSensor = function() {
	this.service = 'heart_rate';
	this.characteristics = 'heart_rate_measurement';
	this._characteristic;
	this._cb = function() {};
}

HeartSensor.prototype.connect = function() {
	var self = this;

	return navigator.bluetooth.requestDevice({
		filters: [{services: [self.service]}]
	})
	.then(device => {
		return device.gatt.connect();
	})
	.then(server => {
		return server.getPrimaryService(self.service);
	})
	.then(service => {
		return service.getCharacteristic(self.characteristics);
	})
	.then(characteristic => {
		self._characteristic = characteristic;
		var callBack = function(event) {
			var bpm = self.parseHeartRateValue(event.target.value);
			if (bpm && !isNaN(bpm)) {
				self._cb(event, bpm);
			} else {
				console.log("Data ignored");
			}
		}
    	return characteristic.startNotifications().then(_ => {
    		console.log("Started Notifications");
    		self._characteristic.addEventListener('characteristicvaluechanged', callBack);
    	});
	})
	.catch(e => {
		console.log("ERROR", e);
	});
}

HeartSensor.prototype.onHeartRateChanged = function(fn) {
	this._cb = fn;
}

HeartSensor.prototype.parseHeartRateValue = function(val) {
	var flags = val.getUint8(0);
    if (flags & 0x1) {
      return val.getUint16(1, true);
    }
    return val.getUint8(1);
}	
