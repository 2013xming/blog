/**
*
* 说明，把jQuery的几个小工具代码重新封装成工具模块使用
*/

var class2type = {};
function jquery_type( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call(obj) ] || "object" :
		typeof obj;
};
function isArraylike( obj ) {
	var length = obj.length,
		type = jquery_type( obj );

	if ( type === "function" ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
};
function jquery_each( obj, callback, args ) {
	var value,
		i = 0,
		length = obj.length,
		isArray = isArraylike( obj );

	if ( args ) {
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback.apply( obj[ i ], args );

				if ( value === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				value = callback.apply( obj[ i ], args );

				if ( value === false ) {
					break;
				}
			}
		}

	// A special, fast, case for the most common use of each
	} else {
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback.call( obj[ i ], i, obj[ i ] );

				if ( value === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				value = callback.call( obj[ i ], i, obj[ i ] );

				if ( value === false ) {
					break;
				}
			}
		}
	}

	return obj;
};
jquery_each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
exports = module.exports = {
	each:jquery_each,
	type:jquery_type,
};