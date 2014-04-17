;(function($){
	var classPrefix = 'jfth-';
	var tableClass = classPrefix + 'table';
	var tableContainerClass = classPrefix + 'container';
	var headClass = classPrefix + 'head';
	
	$.fn.fixTableHead = function(cssProps) {

		function _fixHead(elTable){
			
			if ( !$(elTable).hasClass(tableClass) ){
				var $firstRow = $("tr", elTable).eq(0);
				var $fixedRow = $firstRow.clone();
				var $firstDataRow = $("tr", elTable).eq(1);
				
				//Create the table container
				console.log('elTable=', $(elTable))
				$(elTable).wrap("<div class="+tableContainerClass+"/>");
				var $container = $(elTable).parent("."+tableContainerClass);
				//Set the css on the container
				if ( cssProps && typeof cssProps === 'object' ){
					$container.css(cssProps);
				}
				$container.css({
					'overflow': 'auto'
				})
					
				//Copy first row in the head
				$fixedRow.addClass(headClass).css({
					'position': 	'fixed',
					'z-index': 		1000,
					'overflow':		'hidden'
				});;
				$firstRow.after($fixedRow);

		    	$(elTable).addClass(tableClass);
		    	
		    	//Fix for collapsed borders (the outside of the fixed header row is not collapsed)
		    	var borderCollapse = $(elTable).css('borderCollapse');
		    	if ( borderCollapse === 'collapse' ){

			    	//Remove top border of first data row if less the the border-bottom-width of the header row
			    	var borderBottomWidth = parseInt($fixedRow.find(":first-child").css('borderBottomWidth'), 10);
			    	var borderTopWidth = parseInt($firstDataRow.find(":first-child").css('borderTopWidth'), 10);
			    	borderTopWidth = borderTopWidth-borderBottomWidth;
			    	if ( borderTopWidth < 0 ) borderTopWidth = 0;
			    	$firstDataRow.find("> *").css('borderTopWidth', 0);
			    	
		    	}
			}
			
	    	$("tr."+headClass+" > *", elTable).css('backgroundColor', 'red');
	    	
		}
		
		function _resizeHeaderCells(elTable){
	    	
	    	//resize the width of the cells
			$tr = $("tr."+headClass, elTable);
			$tds = $("> *", $tr);
	    	$("tr", elTable).eq(2).children().each(function(index){
	    		$tds.eq(index).width($(this).width());
	    	});
	    	
	    	//Set the width of the row
	    	var $container = $(elTable).parents("."+tableContainerClass);
	    	var containerWidth = $container.width();
	    	var scrollbarWidth = $container[0].offsetWidth - $container[0].clientWidth;
	    	$tr.width(containerWidth-scrollbarWidth);
		}
		
		function _resizeCells(elTable){
			var counter = 0;
			var $fixedHeaderRow = $("tr."+headClass, elTable);
			var $fixedHeaderRowCells = $("> *", $fixedHeaderRow);
			var $firstDataRow = $("tr:nth-child(3)", elTable);
			var $firstDataRowCells = $("> *", $firstDataRow);
			var ready = false;
			
			//Resize using iteration until the header cells have the same width as the table cells
			do {
				ready = true;
				_resizeHeaderCells(elTable);
				$firstDataRowCells.each(function(index){
					if ( $(this).width() !== $fixedHeaderRowCells.eq(index).width() ) ready = false;
				});
				
				if ( ++counter >= 4 ) break;
			}while( !ready );
			console.log("counter=", counter)
		}
		
    	var oldScrollTop = $(this).parent("."+tableContainerClass).scrollTop();

    	return this.each(function() {
	    	var self = this;
	    	_fixHead(this);
	    	
	    	$(window).resize(function(){

				_resizeCells(self);
	    		$(window).scroll();
	    	});
	    	_resizeCells(self);
	    	
	    	$(window).scroll(function(){
	    		$("tr."+headClass, self).css('top', $(self).parent().offset().top-$(document).scrollTop());
	    		$("tr."+headClass, self).css('left', $(self).parent().offset().left-$(document).scrollLeft());
	    	});
	    	$(window).scroll();
	    	
	    	$(this).parent('.tableContainer').scroll(function(e){
	    		var st = $(self).parent("."+tableContainerClass).scrollTop();
	    		if ( st !== oldScrollTop ){
	    			//vertical scroll
	    			oldScrollTop = st;
	    		}else{
	    			//horizontal scroll
		    		var scrollLeft = $(self).parent('.tableContainer').scrollLeft();
		    		$(self).find("tr."+headClass).scrollLeft(scrollLeft);
	    		}
	    	});
	    });
	 
	};	
})(jQuery);
