"use strict";

/**
 * Wrapper around samsung-remote
 */

const SamsungRemote = require('./samsung-remote/samsung-remote.js');
const LocalNetwork = require('./local-network.js');

class Remote {
    constructor(ip) {
        this.remote = new SamsungRemote({
            ip: ip,
            host: {
                ip: LocalNetwork.ip(),
                mac: LocalNetwork.mac(),
                name: "Homey"
            }
        });
    }

    setChannel(channelNumber) {
        if (typeof channelNumber != "number") {
            return new Error("Channel number is not a number");
        }

        const channelNumberArray = new String(channelNumber);

        for (let i = 0; i < channelNumberArray.length; i++) {
            this.sendKey("KEY_" + channelNumberArray[i]);
        }
    }

    mute() {
        this.sendKey("KEY_MUTE");
    }

    volumeUp() {
        this.sendKey("KEY_VOLUP");
    }

    volumeDown() {
        this.sendKey("KEY_VOLDOWN");
    }

    powerOff() {
        this.sendKey("KEY_POWEROFF");
    }

    sendKey(key) {
        this.remote.send(key, err => {
            if (err) {
                Homey.log(err);
            }
        });
    }

}

module.exports = Remote;