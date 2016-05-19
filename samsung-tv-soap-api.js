var httpreq = require('httpreq');
var xml2js = require('xml2js');

var soapApiUrl = ":7676/smp_4_";

function SamsungTVSoapAPI(ip) {
    
    this.url = "http://" + ip + soapApiUrl;
    
} 

SamsungTVSoapAPI.prototype.getChannelListURL = function(callback) {
    
    apiCall(this, 'GetChannelListURL', callback);
    
}

SamsungTVSoapAPI.prototype.getSourceList = function(callback) {
    
    apiCall(this, 'GetSourceList', callback);
    
}

SamsungTVSoapAPI.prototype.getMBRDeviceList = function(callback) {
    
    apiCall(this, 'GetMBRDeviceList', callback);
    
}

SamsungTVSoapAPI.prototype.setMainTVSource = function(id, source, callback) {
    
    var body = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:SetMainTVSource xmlns:u="urn:samsung.com:service:MainTVAgent2:1"><Source>' + source + '</Source><ID>' + id + '</ID><UiID>-1</UiID></u:SetMainTVSource></s:Body></s:Envelope>';
    
    apiCall(this, 'SetMainTVSource', callback, body);
    
}

function apiCall(samsungTVSoapAPI, soapAction, callback, alternativeBody) {
    
    var body;
    
    if(alternativeBody) {
        body = alternativeBody;
    } else {
        body = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:' + soapAction + ' xmlns:u="urn:samsung.com:service:MainTVAgent2:1"></u:' + soapAction + '></s:Body></s:Envelope>';
    }
    
    httpreq.post(samsungTVSoapAPI.url, {
        
        headers: {
            'soapaction': '"urn:samsung.com:service:MainTVAgent2:1#' + soapAction + '"',
            'user-agent': "DLNADOC/1.50 SEC_HHP_Homey/1.0"
        },
        
        body: body
        
    }, function (err, res){
        
        if (err){
            
            Homey.log(err);
            typeof callback === 'function' && callback(err, res);
            
        } else {
            
            xml2js.parseString(res.body, function (err, result) {
                
                if(err) {
                    Homey.log(err);
                }
                
                typeof callback === 'function' && callback(err, result);
            });
            
        }
        
    });
    
}

module.exports = SamsungTVSoapAPI;