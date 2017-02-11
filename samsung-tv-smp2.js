"use strict";

var httpreq = require('httpreq');
var xml2js = require('xml2js');

var soapApiUrl = ":7676/smp_2_";

class SamsungTVSmp2 {
    constructor(ip) {
        Homey.log('smp2 '+ip);
        this.url = "http://" + ip + soapApiUrl;
    }

    getTVInfo(callback, timeout) {
        if (!timeout) {
            timeout = 5000;
        }

        httpreq.get(this.url, {timeout: timeout}, function (err, res) {
            if (err) {
                Homey.log("[GET TV INFO] " + err);
                typeof callback === 'function' && callback(err, null);
                return;
            }

            xml2js.parseString(res.body, function (err, result) {
                if (err) {
                    Homey.log("[GET TV INFO] " + err);
                    typeof callback === 'function' && callback(err, null);
                    return;
                }

                try {
                    var tvInfo = {};
                    var rawTvInfo = result['root']['device'][0];

                    for (var key in rawTvInfo) {
                        if (rawTvInfo.hasOwnProperty(key)) {
                            tvInfo[key] = rawTvInfo[key][0];
                        }
                    }

                    typeof callback === 'function' && callback(err, tvInfo);
                } catch (err) {
                    Homey.log("[GET TV INFO] Result loaded and xml parsed, but does not have expected nodes.");
                    typeof callback === 'function' && callback(err, null);
                }
            });
        });
    }
}

module.exports = SamsungTVSmp2;