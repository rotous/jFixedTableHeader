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
	    		console.log('cell width='+index+' =>', $(this).width(), $(this))
	    		$("th,td", $head).eq(index).width($(this).width());
	    	});
	    		    	
		}
		
	    return this.each(function() {
	    	var self = this;
	    	_fixHead(this);
	    	
	    	$(window).resize(function(){
	    		_resizeHeaderCells(self);
	    	});
	    	
	    	$(window).scroll(function(){
	    		$("tr.jFixTableHead-copy", self).css('top', $(self).parent().offset().top-$(document).scrollTop());
	    	});
	    });
	 
	};	
})(jQuery);
