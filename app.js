"use strict";

var SamsungTVChannels = require("./samsung-tv-channels.js");
var SamsungTVRemote = require("./samsung-tv-remote.js");
var SamsungTVSoapAPI = require("./samsung-tv-soap-api.js");
var SamsungTVSources = require("./samsung-tv-sources.js");
var SamsungTVSmp2 = require("./samsung-tv-smp2.js");

var self = module.exports = {
 	
	init: function() {
		
		self.tvs = {};
		
		// Update status of devices every 10 seconds
		// A flow card based on this can be added later,
		// then maybe the interval time should be decreased
		setInterval(devicesUpdateAvailability, 10000);
		

		/**
		 * FLOW: Set Channel
		 */
		Homey.manager('flow').on('action.set_channel', function( callback, args ){
			
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					tv.remote.setChannel(args.channel.channelNumber);
					
					callback(null, true);
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
			
		});
		
		/**
		 * FLOW: [autocomplete] Set Channel 
		 */
		Homey.manager('flow').on('action.set_channel.channel.autocomplete', function( callback, args ){
		
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					var channelsAutoComplete = [];
					
					for (var key in tv.channels.all()) {
				
						if (tv.channels.all().hasOwnProperty(key)) {
							
							var channel = tv.channels.get(key);
							
							channelsAutoComplete.push({
								name: channel.number + '. ' + channel.name,
								channelNumber: channel.number
							});
						}
	
					}
					
					channelsAutoComplete = channelsAutoComplete.filter(function(channel){
						return channel.name.toLowerCase().indexOf(args.query.toLowerCase()) > -1;
					}) 
								
					callback( null, channelsAutoComplete );
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
				
		});

		/**
		 * FLOW: Set Source
		 */
		Homey.manager('flow').on('action.set_source', function( callback, args ){
			
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					tv.soapApi.setMainTVSource(args.source.id, args.source.source, function (err, res) {
						
						if(err) {
							
							callback(null, false);
							
						} else {
							
							callback(null, true);
							
						}
						
					});
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
			
		});
		
		/**
		 * FLOW: [autocomplete] Set Source
		 */
		Homey.manager('flow').on('action.set_source.source.autocomplete', function( callback, args ){

			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					var sourcesAutoComplete = [];
					
					for(var key in tv.sources.all()) {
				
						if (tv.sources.all().hasOwnProperty(key)) {
							
							var source = tv.sources.get(key);
							
							sourcesAutoComplete.push({
								name: source.description,
								id: source.id,
								source: source.source
							});
						}
	
					}
					
					sourcesAutoComplete = sourcesAutoComplete.filter(function(source){
						return source.name.toLowerCase().indexOf(args.query.toLowerCase()) > -1;
					}) 
									
					callback( null, sourcesAutoComplete );
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
				
		});
			
		/**
		 * FLOW: Toggle Mute
		 */
		Homey.manager('flow').on('action.toggle_mute', function( callback, args ){
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
			
					tv.remote.mute();
					
					callback(null, true);
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
		});
		
		/**
		 * FLOW: Volume Up
		 */
		Homey.manager('flow').on('action.volume_up', function( callback, args ){
			
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
			
					tv.remote.volumeUp();
					
					callback(null, true);
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
		});
		
		/**
		 * FLOW: Volume Down
		 */
		Homey.manager('flow').on('action.volume_down', function( callback, args ){
			
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					tv.remote.volumeDown();
					callback(null, true);
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
			
		});
		
		/**
		 * FLOW: Power Off
		 */
		Homey.manager('flow').on('action.power_off', function( callback, args ){
			
			if( typeof args.tv == 'undefined' ) return callback( "Select a TV" );
			var tv = self.tvs[ args.tv.id ];
			if( typeof tv == 'undefined' ) return callback( "TV not connected" );
			
			deviceAvailable(tv.ip, function(result) {
				
				if(result) {
					
					tv.remote.powerOff();
					callback(null, true);
					
				} else {
					
					callback( "TV offline" );
					
				}
				
			});
			
		});
	}

}

/**
 * Returns true  device is available.
 */
function deviceAvailable(ip, callback) {
	
	// Was it available in the last check, then we assume it still is
	if (self.tvs[ip].available) {
		
		callback(true);
		
	} else {
		
		deviceUpdateAvailability(ip, function(res) {
			
			Homey.log("CALLED BACK! WITH" + res);
			callback(res);	
			
		});
		
	}
	
	
}

/**
 * Update the availability of a device by trying to get details about it.
 */
function deviceUpdateAvailability(ip, callback) {
	
	var tv = self.tvs[ip];
	var smp2 = new SamsungTVSmp2(ip);
	
	smp2.getTVInfo(function(err, data) {
		
		if(err) {
			
			tv.available = false;
			Homey.manager('drivers').getDriver('tv').setUnavailable({id: ip});
				
			callback(false);
			
		} else {
			
			if(!tv.available) {
				
				tv.available = true;
				
				//Homey.log(Homey.manager('drivers'));
				//Homey.log(Homey.manager('drivers').getDriver("192.168.1.126"));
				
				//Homey.manager('drivers').getDriver("192.168.1.126").setUnavailable();
				
				Homey.manager('drivers').getDriver('tv').setAvailable({id: ip});
				
				// Set remote, smp2 and soap api instance
				tv.remote = new SamsungTVRemote(ip);
				tv.soapApi = new SamsungTVSoapAPI(ip);
				tv.smp2 = smp2;
				
				// Retrieve sources
				tv.sources = new SamsungTVSources(ip);
				
				// Retrieve channels by first making sure channel list is available
				tv.soapApi.getChannelListURL(function () {
					
					tv.channels = new SamsungTVChannels(ip, function() {
						
						Homey.log("CHANNELS CALLED BACK");
						callback(true);
						
					});
					
				});
				
			}
		}
		
	}, 2000); // Time it out after 2 seconds
		
}

/**
 * Update availability status of all devices.
 */
function devicesUpdateAvailability() {
	
	for (var key in self.tvs) {
				
		if (self.tvs.hasOwnProperty(key)) {
			
			deviceUpdateAvailability(self.tvs[key].ip, function() {});
		
		}

	}
	
}