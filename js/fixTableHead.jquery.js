;(function($){
	$.fn.fixTableHead = function() {

		function _fixHead(elTable){
			var $head = $("thead", elTable);
			
			if ( !$(elTable).hasClass('jFixTableHead') ){
				//Copy row in the head
				$tr = $("tr", $head).clone();
				$tr.addClass('jFixTableHead-copy');
				$head.prepend($tr);

		    	$(elTable).addClass('jFixTableHead');
			}
			
	    	$("tr.jFixTableHead-copy *", $head).css('backgroundColor', 'red');
	    	
		}
		
		function _resizeHeaderCells(elTable){
			var $head = $("thead", elTable);
//	    	$head.css('position', 'relative');
	    	
	    	//fix the width of the cells in the head
	    	$("th,td", $head).each(function(){
	    		$(this).css('width', 'auto');
	    	});

	    	//find the width of the cells
	    	$("tbody tr:first-child td", elTable).each(function(index){
	    		$("th,td", $head).eq(index).width($(this).width());
	    	});
	    	
	    	//Set the width of the row
	    	var elTableContainer = $head.parents(".tableContainer");
	    	var containerWidth = elTableContainer.width();
	    	var scrollbarWidth = elTableContainer[0].offsetWidth - elTableContainer[0].clientWidth;
	    	$head.find("tr.jFixTableHead-copy").width(containerWidth-scrollbarWidth);
	    		    	
		}
		
    	var oldScrollTop = $(this).parent('.tableContainer').scrollTop();

    	return this.each(function() {
	    	var self = this;
	    	_fixHead(this);
	    	
	    	$(window).resize(function(){
	    		_resizeHeaderCells(self);
	    	});
	    	$(window).resize();
	    	
	    	$(window).scroll(function(){
	    		$("tr.jFixTableHead-copy", self).css('top', $(self).parent().offset().top-$(document).scrollTop());
	    	});
	    	
	    	$(this).parent('.tableContainer').scroll(function(e){
	    		var st = $(self).parent('.tableContainer').scrollTop();
	    		if ( st !== oldScrollTop ){
	    			//vertical scroll
	    			oldScrollTop = st;
	    		}else{
	    			//horizontal scroll
		    		var scrollLeft = $(self).parent('.tableContainer').scrollLeft();
		    		$(self).find("tr.jFixTableHead-copy").scrollLeft(scrollLeft);
	    		}
	    	});
	    });
	 
	};	
})(jQuery);
