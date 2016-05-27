var httpreq = require('httpreq');
var xml2js = require('xml2js');

var soapApiUrl = ":7676/smp_2_";

function SamsungTVSmp2(ip) {
    Homey.log("smp2 constr: "+ ip);
    this.url = "http://" + ip + soapApiUrl;
    
} 

/**
 * Returns array (if you're lucky) with:
 * deviceType
 * manufacturer
 * manufacturerURL
 * modelDescription
 * modelName
 * modeURL
 * serialNumber
 * UDN
 * UPC
 * sec:deviceID
 * sec:ProductCap
 */
SamsungTVSmp2.prototype.getTVInfo = function(callback, timeout) {
    
    if(!timeout) {
        
        timeout = 5000;
        
    }
    
    httpreq.get(this.url, { timeout: timeout }, function (err, res){
        
        if (err){
            
            Homey.log("[GET TV INFO] " +err);
            typeof callback === 'function' && callback(err, null);
            
        } else {
            
            xml2js.parseString(res.body, function (err, result) {
                
                if(err) {
                    
                    Homey.log("[GET TV INFO] " + err);
                    typeof callback === 'function' && callback(err, null);
                    
                }
                
                if(result['root']['device'][0]) {
                    
                    var tvInfo = {};
                    var rawTvInfo = result['root']['device'][0];
                    
                    for (var key in rawTvInfo) {
                        if (rawTvInfo.hasOwnProperty(key)) {
                            tvInfo[key] = rawTvInfo[key][0];
                        }
                    }
                    
                    typeof callback === 'function' && callback(err, tvInfo);
                    
                } else {
                    
                    Homey.log("[GET TV INFO] Result loaded and xml parsed, but does not have expected nodes.");
                    typeof callback === 'function' && callback("XML does not contain expected nodes", null);
                    
                }
                
            });
            
        }
        
    });
    
}

module.exports = SamsungTVSmp2;