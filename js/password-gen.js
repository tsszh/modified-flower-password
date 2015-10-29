/* global md5, console*/
'use strict';

var PassGen = (function(){
	return {
		getPass : function( key, length, mode ){
			if ( !length ) length = 16;
			if ( !mode ) mode = 'complex';
			return md5(key);
		}
	};
})();

if ( !PassGen )
	console.log('Cannot Create PassGen!');