"use strict";

const SamsungTVSoapAPI = require("./samsung-tv-soap-api.js");

const xml2js = require('xml2js');

class Source {
    constructor(id, source, connected) {
        this.id = id;
        this.source = source;
        this.description = (connected ? "[V] " : "[X] ") + source;
        this.connected = connected;
    }

    appendToDescription(addition) {
        this.description += addition;
    }
}

class Sources {
    constructor(ip) {
        this.api = new SamsungTVSoapAPI(ip);
        this.sources = {};
        this.update();
    }

    all() {
        return this.sources;
    }

    get(key) {
        return this.sources[key];
    }

    update() {
        this.api.getSourceList((err, res) => {
            if (err) {
                Homey.log(err);
                return;
            }

            try {
                const sourceList = res['s:Envelope']['s:Body'][0]['u:GetSourceListResponse'][0]['SourceList'][0];

                xml2js.parseString(sourceList, (err, res) => {
                        if (err) {
                            Homey.log(err);
                            return;
                        }

                        for (let source of res['SourceList']['Source']) {
                            this.sources[source.ID[0]] = new Source(source.ID[0], source.SourceType[0], (source.Connected[0] == "Yes"));
                        }
                        ;

                        // Add device info to description if available
                        this.api.getMBRDeviceList((err, res) => {
                            const deviceList = res['s:Envelope']['s:Body'][0]['u:GetMBRDeviceListResponse'][0]['MBRDeviceList'][0];

                            xml2js.parseString(deviceList, (err, res) => {
                                if (err) {
                                    Homey.log(err);
                                    return;
                                }

                                const devices = res['MBRDeviceList']['MBRDevice'];
                                if (devices) {
                                    for (let device of devices) {
                                        if (this.sources[device.ID[0]]) {
                                            this.sources[device.ID[0]].appendToDescription(" - " + device.DeviceType[0] + " - " + device.BrandName[0]);
                                        }
                                    }
                                }
                            });
                        });
                    }
                );
            } catch (err) {
                Homey.log('The list of sources could not be retrieved: ' + err);
            }
        });
    }
}

module.exports = Sources;
