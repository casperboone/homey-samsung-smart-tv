"use strict";

const SamsungTVChannels = require("./samsung-tv-channels.js");
const SamsungTVRemote = require("./samsung-tv-remote.js");
const SamsungTVSoapAPI = require("./samsung-tv-soap-api.js");
const SamsungTVSources = require("./samsung-tv-sources.js");
const SamsungTVSmp2 = require("./samsung-tv-smp2.js");

const self = module.exports = {
    tvs: [],

    init() {
        // Update status of devices every 10 seconds
        // A flow card based on this can be added later,
        // then maybe the interval time should be decreased
        setInterval(devicesUpdateAvailability, 10000);

        /**
         * FLOW: Set Channel
         */
        Homey.manager('flow').on('action.set_channel', (callback, args) => {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    tv.remote.setChannel(args.channel.channelNumber);
                    callback(null, true);
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: [autocomplete] Set Channel
         */
        Homey.manager('flow').on('action.set_channel.channel.autocomplete', function (callback, args) {
            if (typeof args.args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    let channelsAutoComplete = [];

                    for (let key in tv.channels.all()) {
                        if (tv.channels.all().hasOwnProperty(key)) {
                            const channel = tv.channels.get(key);
                            channelsAutoComplete.push({
                                name: channel.number + '. ' + channel.name,
                                channelNumber: channel.number
                            });
                        }
                    }

                    channelsAutoComplete = channelsAutoComplete.filter(channel => {
                        return channel.name.toLowerCase().indexOf(args.query.toLowerCase()) > -1;
                    })

                    callback(null, channelsAutoComplete);
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: Set Source
         */
        Homey.manager('flow').on('action.set_source', (callback, args) => {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, (result) => {
                if (result) {
                    tv.soapApi.setMainTVSource(args.source.id, args.source.source, (err, res) => {
                        if (err) {
                            callback(null, false);
                            return;
                        }
                        callback(null, true);
                    });
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: [autocomplete] Set Source
         */
        Homey.manager('flow').on('action.set_source.source.autocomplete', (callback, args) => {
            if (typeof args.args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, (result) => {
                if (result) {
                    let sourcesAutoComplete = [];

                    for (let key in tv.sources.all()) {
                        if (tv.sources.all().hasOwnProperty(key)) {
                            const source = tv.sources.get(key);
                            sourcesAutoComplete.push({
                                name: source.description,
                                id: source.id,
                                source: source.source
                            });
                        }
                    }

                    sourcesAutoComplete = sourcesAutoComplete.filter(source => {
                        return source.name.toLowerCase().indexOf(args.query.toLowerCase()) > -1;
                    })

                    callback(null, sourcesAutoComplete);
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: Toggle Mute
         */
        Homey.manager('flow').on('action.toggle_mute', function (callback, args) {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    tv.remote.mute();
                    callback(null, true);
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: Volume Up
         */
        Homey.manager('flow').on('action.volume_up', function (callback, args) {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    tv.remote.volumeUp();
                    callback(null, true);
                    return;
                }
                callback("TV offline");
            });
        });

        /**
         * FLOW: Volume Down
         */
        Homey.manager('flow').on('action.volume_down', (callback, args) => {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    tv.remote.volumeDown();
                    callback(null, true);
                    return;
                }
            });
        });

        /**
         * FLOW: Power Off
         */
        Homey.manager('flow').on('action.power_off', (callback, args) => {
            if (typeof args.tv == 'undefined') return callback("Select a TV");
            const tv = self.tvs[args.tv.id];
            if (typeof tv == 'undefined') return callback("TV not connected");

            deviceAvailable(tv.ip, result => {
                if (result) {
                    tv.remote.powerOff();
                    callback(null, true);
                    return;
                }
                callback("TV offline");
            });
        });
    },

    addDevice(ip, callback) {
        // Add to internal device array
        self.tvs[ip] = {
            id: ip,
            ip: ip
        };

        deviceAvailable(ip, callback)
    }
}

/**
 * Returns true  device is available.
 */
function deviceAvailable(ip, callback) {
    // Was it available in the last check, then we assume it still is
    if (self.tvs[ip].available) {
        callback(true);
        return;
    }

    deviceUpdateAvailability(ip, function (res) {
        Homey.log("DEVICE " + ip + " STATUS: " + res);
        callback(res);
    });
}

/**
 * Update the availability of a device by trying to get details about it.
 */
function deviceUpdateAvailability(ip, callback) {
    Homey.log("DUA:step0");

    const tv = self.tvs[ip];
    const smp2 = new SamsungTVSmp2(ip);

    smp2.getTVInfo((err, data) => {
        Homey.log("DUA:step1");
        if (err) {
            Homey.log("DUA:step1.5");

            tv.available = false;
            Homey.manager('drivers').getDriver('tv').setUnavailable({id: ip, ip: ip});

            callback(false);
            return;
        }
        Homey.log("DUA:step2");
        if (!tv.available) {
            Homey.log("DUA:step3");
            tv.available = true;
            Homey.manager('drivers').getDriver('tv').setAvailable({id: ip, ip: ip});

            // Set remote, smp2 and soap api instance
            tv.remote = new SamsungTVRemote(ip);
            tv.soapApi = new SamsungTVSoapAPI(ip);
            tv.smp2 = smp2;

            // Retrieve sources
            tv.sources = new SamsungTVSources(ip);

            Homey.log("DUA:step4");
            // Retrieve channels by first making sure channel list is available
            tv.soapApi.getChannelListURL(() => {
                setTimeout(() => {
                    tv.channels = new SamsungTVChannels(ip, () => {
                        Homey.log("CHANNELS LIST RECEIVED");
                        callback(true);
                    });
                }, 2500);
            });
        }
    }, 2000); // Time it out after 2 seconds of loading
}

/**
 * Update availability status of all devices.
 */
function devicesUpdateAvailability() {
    for (const key in self.tvs) {
        if (self.tvs.hasOwnProperty(key)) {
            deviceUpdateAvailability(self.tvs[key].ip, () => {
            });
        }
    }
}
