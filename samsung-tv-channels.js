"use strict";

var httpreq = require('httpreq');

var channelListUrl = ":9090/BinaryBlob/1/ChannelList.dat";

class Channel {
    constructor(number, name) {
        this.number = number;
        this.name = name;
    }
}

class Channels {
    constructor(ip, callback) {
        this.url = "http://" + ip + channelListUrl;
        this.channels = {};
        this.update(callback);
    }

    all() {
        return this.channels;
    }

    get(key) {
        return this.channels[key];
    }

    update(callback) {
        httpreq.get(this.url, {binary: true}, (err, res) => {
            if (err) {
                Homey.log(err);
                return;
            }

            // Ignore first 4 bits
            var buffer = res.body.slice(4);
            var buffers = [];

            // Split buffers on 9x 00 followed by 04
            // Not the nicest way to do this probably, ideas welcome
            var lastEnd = 0;

            for (var i = 10; i < buffer.length; i++) {
                var split = true;
                for (var x = i - 10; x < i - 1; x++) {
                    if (buffer[x] !== 0x00) {
                        split = false;
                    }
                }

                if (buffer[i - 1] !== 0x04) {
                    split = false;
                }

                if (buffer[i] === 0x00 && split) {
                    buffers.push(buffer.slice(lastEnd, i - 1));
                    lastEnd = i - 1;
                }
            }

            // Add last channel
            buffers.push(buffer.slice(lastEnd));

            // Find Channel information
            buffers.forEach(channelBuffer => {
                var channel = processChannelBuffer(channelBuffer);
                this.channels[channel.number] = channel;
            });

            typeof callback == 'function' && callback();
        });
    }
}

/**
 * Process channel buffer into Channel object
 */
function processChannelBuffer(channelBuffer) {
    // We assume that the max channel number is 999, and therefore check 3 bytes

    // Find channel number
    var channelNumber = "";
    for (var i = 12; i <= 14; i++) {
        if (channelBuffer[i] != 0x00) {
            channelNumber += String.fromCharCode(channelBuffer[i]);
        }
    }

    // Make sure it's now a number
    channelNumber = Number(channelNumber);

    // Find channel name (on bytes 24 - 64)
    var channelName = "";
    for (var i = 24; i <= 64; i++) {
        if (channelBuffer[i] === 0x00) {
            break;
        }
        channelName += String.fromCharCode(channelBuffer[i]);
    }

    return new Channel(channelNumber, channelName);
}

module.exports = Channels;
