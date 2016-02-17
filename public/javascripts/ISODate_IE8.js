(function($){
	if($.ISODateToGMTDate)
		return;
	$.ISODateToGMTDate = function(DateStr){
		var regexp = /\d{2,4}/g;
		var rs = DateStr.match(regexp);
		if(!rs)
			return;		
		for(var i=0,len=rs.length;i<len;i++){
			if(!rs[i])
				rs[i]=0;
		}
		return new Date(rs[0],rs[1]-1,rs[2],rs[3],rs[4],rs[5],rs[6]);
	};
})(jQuery);