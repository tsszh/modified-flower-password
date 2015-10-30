/* global md5, console*/
'use strict';

(function() {
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
    window.flowerPassword = {
        encrypt: function(password, key, mode) {
            myRand = randGen(parseInt($.md5(password+key),16));
            // return getRealPass( key, 16, "complex");
            return ''+password+' '+key+' '+mode;
        }
    };
})();
