"use strict";

const SamsungTVSmp2 = require("./../../samsung-tv-smp2.js")

module.exports = {
    init(devicesData, callback) {
        devicesData.forEach(deviceData => {
            module.exports.setUnavailable(deviceData, "Offline");

            Homey.log(deviceData);
            Homey.app.tvs[deviceData.ip] = deviceData;
        });

        callback(true);
    },

    deleted(deviceData) {
        delete Homey.app.tvs[deviceData.id];
    },

    pair(socket) {
        socket.on('ip_entered', (data, callback) => {
            const ip = data.ip;
            const smp2 = new SamsungTVSmp2(ip);

            Homey.log("ip_entered called");
            Homey.log("IP ENTERED: " + ip);

            smp2.getTVInfo((err, data) => {
                if (!err) {
                    Homey.app.addDevice(ip, () => {
                    });
                }
                callback(err, data);
            });
        });
    }
}
