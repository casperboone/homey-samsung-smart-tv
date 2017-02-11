"use strict";

const httpreq = require('httpreq');
const xml2js = require('xml2js');

const soapApiUrl = ":7676/smp_2_";

class SamsungTVSmp2 {
    constructor(ip) {
        this.url = "http://" + ip + soapApiUrl;
    }

    getTVInfo(callback, timeout) {
        if (!timeout) {
            timeout = 5000;
        }

        httpreq.get(this.url, {timeout: timeout}, (err, res) => {
            if (err) {
                Homey.log("[GET TV INFO] " + err);
                typeof callback === 'function' && callback(err, null);
                return;
            }

            xml2js.parseString(res.body, (err, result) => {
                if (err) {
                    Homey.log("[GET TV INFO] " + err);
                    typeof callback === 'function' && callback(err, null);
                    return;
                }

                try {
                    const tvInfo = {};
                    const rawTvInfo = result['root']['device'][0];

                    for (const key in rawTvInfo) {
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