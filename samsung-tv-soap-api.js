"use strict";

var httpreq = require('httpreq');
var xml2js = require('xml2js');

var soapApiUrl = ":7676/smp_4_";

class SamsungTVSoapAPI {
    constructor(ip) {
        this.url = "http://" + ip + soapApiUrl;
    }

    getChannelListURL(callback) {
        apiCall(this.url, 'GetChannelListURL', callback);
    }

    getSourceList(callback) {
        apiCall(this.url, 'GetSourceList', callback);
    }

    getMBRDeviceList(callback) {
        apiCall(this.url, 'GetMBRDeviceList', callback);
    }

    setMainTVSource(id, source, callback) {
        var body = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:SetMainTVSource xmlns:u="urn:samsung.com:service:MainTVAgent2:1"><Source>' + source + '</Source><ID>' + id + '</ID><UiID>-1</UiID></u:SetMainTVSource></s:Body></s:Envelope>';

        apiCall(this.url, 'SetMainTVSource', callback, body);
    }
}

function apiCall(url, soapAction, callback, alternativeBody) {
    var body = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:' + soapAction + ' xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:' + soapAction + '></s:Body></s:Envelope>';
    if (alternativeBody) {
        body = alternativeBody;
    }

    httpreq.post(url, {
        headers: {
            'soapaction': '"urn:samsung.com:service:MainTVAgent2:1#' + soapAction + '"',
            'user-agent': "DLNADOC/1.50 SEC_HHP_Homey/1.0"
        },
        body: body
    }, (err, res) => {
        if (err) {
            Homey.log(err);
            typeof callback === 'function' && callback(err, res);
            return;
        }
        xml2js.parseString(res.body, function (err, result) {
            if (err) {
                Homey.log(err);
            }
            typeof callback === 'function' && callback(err, result);
        });
    });
}

module.exports = SamsungTVSoapAPI;