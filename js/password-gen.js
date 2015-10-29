/* global md5, console*/
'use strict';

var PassGen = (function(){
	// Private Field
	var symbolPool = '!@#$%^&*-+=/',
		simplePool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		comlexPool = simplePool+symbolPool;
	var myRand = function(){console.error("This Method Should Nerver Be Called!!");return 0;};
	var getRealPass = function( key, len, mode ){
		var res = '',i,poolLen;
		if ( mode === 'complex' ) {
			poolLen = comlexPool.length;
			for ( i = 0; i < len; i++ ) {
				res += comlexPool[myRand(poolLen)];
			}	
		} else {
			poolLen = simplePool.length;
			for ( i = 0; i < len; i++ ) {
				res += simplePool[myRand(poolLen)];
			}
		}
		return res;
	};
	var randGen = function(seed){
		return function(max){
			seed = (seed * 9301 + 49297) % 233280;
			if ( max )
				return Math.floor( max * seed / 233280 );
			return seed / 233280;
		};
	};
	return {
		getPass : function( key, length, mode ){
			if ( !length ) length = 16;
			if ( length < 12 ) length = 12;
			if ( length > 64 ) length = 64;
			if ( !mode ) mode = 'complex';
			myRand = randGen(parseInt(md5(key),16));
			return getRealPass( key, length, mode);
		}
	};
})();

if ( !PassGen )
	console.log('Cannot Create PassGen!');