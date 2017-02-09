var SamsungTVSoapAPI = require("./samsung-tv-soap-api.js");

var xml2js = require('xml2js');

/**
 * Define Source Object
 */
function Source(id, source, connected) {

    this.id = id;
    this.source = source;
    this.description = (connected ? "[V] " : "[X] ") + source;
    this.connected = connected;

}

/**
 * Append string to description
 */
Source.prototype.appendToDescription = function (addition) {

    this.description += addition;

}

/**
 * Define Sources object
 */
function Sources(ip) {

    this.api = new SamsungTVSoapAPI(ip);
    this.sources = {};
    this.update();

}

/**
 * Get All Sources
 */
Sources.prototype.all = function () {

    return this.sources;

};

/**
 * Get Source
 *
 * Returns undefined if not found
 */
Sources.prototype.get = function (key) {

    return this.sources[key];

};

/**
 * Update sources object by retrieving and processing a new list
 */
Sources.prototype.update = function () {

    var object = this;

    object.api.getSourceList( function (err, res) {

        if (err) {

            Homey.log(err);

        } else {

            if (res['s:Envelope']['s:Body'][0]['u:GetSourceListResponse']) {
             try {
                var sourceList = res['s:Envelope']['s:Body'][0]['u:GetSourceListResponse'][0]['SourceList'][0];

                xml2js.parseString(sourceList, function(err, res) {

                    if (err) {

                        Homey.log(err);

                    } else {

                        var sources = res['SourceList']['Source'];

                        sources.forEach(function (source) {

                            object.sources[source.ID[0]] = new Source(source.ID[0], source.SourceType[0], (source.Connected[0]=="Yes"));

                        });


                        // Add device info to description if available
                        object.api.getMBRDeviceList( function (err, res) {

                            if (verifyMbrDevicesAreAvailable(res)) {
                                var deviceList = res['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'][0]['MBRDeviceList'][0];

                                xml2js.parseString(deviceList, function(err, res) {

                                    if (err) {

                                        Homey.log(err);

                                    } else {

                                        var devices = res['MBRDeviceList']['MBRDevice'];

                                        if (devices) {

                                            devices.forEach(function (device) {

                                                if (object.sources[device.ID[0]]) {

                                                     object.sources[device.ID[0]].appendToDescription(" - " + device.DeviceType[0] + " - " + device.BrandName[0]);

                                                }
                                                
                                            });

                                        }

                                    }

                                 });

                              }

                        });


                    }

                });
             }
             catch(err) {
             	  // Error with sourceList
             	  Homey.log('Error with sourceList: ' + err);
             	}
            }

        }

    });


}

function verifyMbrDevicesAreAvailable(result) {
    return result['s:Envelope'] &&
        result['s:Envelope']['s:Body'] &&
        result['s:Envelope']['s:Body'][0] &&
        result['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'] &&
        result['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'][0] &&
        result['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'][0]['MBRDeviceList'] &&
        result['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'][0]['MBRDeviceList'][0];
}

module.exports = Sources;
