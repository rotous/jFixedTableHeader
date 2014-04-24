;(function($){
	
	"use strict";
	
	var classPrefix = 'jfth-';
	var tableClass = classPrefix + 'table';
	var tableContainerClass = classPrefix + 'container';
	var headClass = classPrefix + 'head';
	
	$.fn.fixedTableHead = function(cssProps) {

		/**
		 * Returns the z-index integer value for an element
		 */
		function _findZIndex($element){
			
			//Make sure we have a jquery element
			$element = $($element);
			
			var zIndex = $element.css('zIndex');
			
			while ( zIndex === 'auto' && $element.prop('tagName')!=='BODY' ){
				$element = $element.parent();
				zIndex = $element.css('zIndex');
			}
			
			return zIndex==='auto' ? 0 : parseInt(zIndex);
		}
		
		/**
		 * Wraps the table with a div and creates a fixed head row for the table
		 */
		function _createFixedHead(elTable){
			
			if ( !$(elTable).hasClass(tableClass) ){

				//Copy first row of the table
				var $firstRow = $("tr", elTable).eq(0);
				var $fixedRow = $firstRow.clone();
				var $firstDataRow = $("tr", elTable).eq(1);
				
				//Create a table container
				$(elTable).wrap("<div class="+tableContainerClass+"/>");
				var $container = $(elTable).parent("."+tableContainerClass);

				//Set the css on the container
				if ( cssProps && typeof cssProps === 'object' ){
					$container.css(cssProps);
				}
				$container.css({
					'overflow': 'auto'
				})

				//Calculate the z-index of the fixed header row
				var zIndex = _findZIndex($firstRow) + 100;
				
				//Set the background color of the fixed header row
				var backgroundColor = $firstRow.css('background-color');
				if ( backgroundColor==='transparent' || backgroundColor==='rgba(0, 0, 0, 0)'){ backgroundColor = 'white'; }
					
				$fixedRow.addClass(headClass).css({
					'position': 		'fixed',
					'z-index': 			zIndex,
					'overflow':			'hidden',
					'background-color':	backgroundColor
				});
				
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
	    	
		}
		
		function _resizeHeaderCells(elTable){
	    	
	    	//resize the width of the cells
			var $tr = $("tr."+headClass, elTable);
			var $tds = $("> *", $tr);
	    	$("tr", elTable).eq(0).children().each(function(index){
	    		console.log('setting '+index+' to '+$(this).width())
	    		$tds.eq(index).width(($(this).width()+13)+'px');
	    		console.log('width is now '+$tds.eq(index).width())
	    	});
	    	
	    	//Set the width of the container
	    	var tableWidth = $(elTable).width();
	    	var $container = $(elTable).parents("."+tableContainerClass);
	    	var scrollbarWidth = $container[0].offsetWidth - $container[0].clientWidth;
	    	if ( !('width' in cssProps) ) { $container.width(tableWidth+scrollbarWidth); }
	    	var containerWidth = $container.width();
	    	
	    	//Set the width of the row
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
					console.log($(this).width(), $fixedHeaderRowCells.eq(index).width())
					if ( $(this).width() !== $fixedHeaderRowCells.eq(index).width() ){ ready = false; }
				});
				
				if ( ++counter >= 10 ) break;
			}while( !ready );
			console.log("counter=", counter)
		}
		
    	var oldScrollTop = $(this).parent("."+tableContainerClass).scrollTop();

    	return this.each(function() {
	    	var self = this;
	    	_createFixedHead(this);
	    	
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
	    	
	    	$(this).parent('.'+tableContainerClass).scroll(function(e){
	    		var st = $(self).parent("."+tableContainerClass).scrollTop();
	    		if ( st !== oldScrollTop ){
	    			//vertical scroll
	    			oldScrollTop = st;
	    		}else{
	    			//horizontal scroll
		    		var scrollLeft = $(self).parent('.'+tableContainerClass).scrollLeft();
		    		$(self).find("tr."+headClass).scrollLeft(scrollLeft);
	    		}
	    	});
	    });
	 
	};	
})(jQuery);
