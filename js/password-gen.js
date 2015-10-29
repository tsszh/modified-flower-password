/* global md5, console*/
'use strict';

var PassGen = (function(){
	// Private Field
	var symbolPool = '!@#$%^&*-+=/';
	var getLowerLetter = function(key){
		return String.fromCharCode( parseInt(md5(key),16)%26+97 );
	};
	var getUpperLetter = function(key){
		return String.fromCharCode( parseInt(md5(key),16)%26+65 );
	};
	var getDigit = function(key){
		return ( parseInt(md5(key),16)%10 ).toString();
	};
	var getSymbol = function(key){
		return symbolPool.charAt( parseInt(md5(key),16)%symbolPool.length );
	};
	var getChar = function( n, mode ){
		n = n%256/256;
		if ( mode === 'complex' ) {
			if ( n < 0.2 ) return getSymbol;
			if ( n < 0.4 ) return getDigit;
			if ( n < 0.7 ) return getLowerLetter;
			return getUpperLetter;
		} else {
			if ( n < 0.33 ) return getDigit;
			if ( n < 0.66 ) return getLowerLetter;
			return getUpperLetter;
		}
	};
	var getRealPass = (function(){
		var iteration = function( key, level, mode ){
			key = md5(key);
			if ( level === 0 ) 
				return getChar(parseInt(key.substring(0,8),16),mode)( parseInt(key.substring(8,16),16) );
			level--;
			var res = '';
			for ( var i = 0; i < 16; i += 4 ) {
				res += iteration(key.substring(i,i+4), level, mode);
			}
			return res;
		};
		return function( key, length, mode ){
			return iteration( key, 3, mode ).substring(0,length);
		};
	})();
	return {
		getPass : function( key, length, mode ){
			if ( !length ) length = 16;
			if ( length < 12 ) length = 12;
			if ( length > 64 ) length = 64;
			if ( !mode ) mode = 'complex';
			return getRealPass( key, length, mode);
		}
	};
})();

if ( !PassGen )
	console.log('Cannot Create PassGen!');