(function($){
    $.rating = {
        /**
         * Set value to hidden
         * And add style persist
         * If passed value is undefined , set by value of hidden
         * @param {Object} $wrapper
         * @param {Object} value
         */
        setValue: function($wrapper, value){
            var $hidden = $.rating.getHidden($wrapper);
            value = value || $hidden.val();
            $hidden.val(value);
            
			// Set persist style
            $wrapper.find('.star').removeClass('star_persist').removeClass('star_hover');
            var $select = $wrapper.find('.star[rel=' + value + ']')
            $select.prevAll('.star').add($select).addClass('star_persist')
			
			// Set annotation
			$.rating.setAnnotation($wrapper, $select.attr('title') || value)
        },
        getSelectedValue: function($wrapper){
            return $wrapper.find('.star_persist:last').attr('rel');
        },
        getValue: function($wrapper){
            return $.rating.getHidden($wrapper).val();
        },
        getHidden: function($wrapper){
            return $wrapper.find(':hidden')
        },
        resetValue: function($wrapper){
            $.rating.setValue($wrapper);
        },
		getAnnotation : function($wrapper){
			return $wrapper.find('.annotation');
		},
		setAnnotation : function($wrapper, text){
			$.rating.getAnnotation($wrapper).html(text);
		}
    };
    $.fn.rating = function(options){
		if (!this.is(':radio')) {
			return alert("Cannot rating something else except radio");
		}
        var old = null, changed = false;
        
        // Rating wrapper div
        var $wrap = $('<div/>').addClass('rating').insertBefore(this[0]);
        
        // Build an input:hidden instead of radios
        var $hidden = $('<input type="hidden">').attr('name', this.attr('name')).appendTo($wrap);

        $wrap.mouseover(function(){
            changed = false;
        })
        $wrap.mouseout(function(){
            if (!changed) $.rating.resetValue($wrap);
        })
        
        // Add stars
        this.each(function(){
            var $thiz = $(this)
            // Create star 
            // Set title as radio's title , if not exists , set as value
            var $star = $('<div/>').addClass('star').attr('title', $thiz.attr('title') || $thiz.val()).attr('rel', $thiz.val()).appendTo($wrap);
            
            $star.mouseover(function(){
                // When hover the star , style hover style of self and previous stars
                var $_thiz = $(this);
                $_thiz.prevAll('.star').add(this).removeClass('star_persist').addClass('star_hover');
                
                // And set unselect style to all nexts	
                $_thiz.nextAll('.star').removeClass('star_persist').removeClass('star_hover')
				
				// Set annotation 
				$.rating.setAnnotation($wrap, $_thiz.attr('title'));
            });
            
            // Onclick the star , persist all stars
            // And add value of hidden as selected star rel
            $star.click(function(){
                var $_thiz = $(this);
                $_thiz.parent().find('.star').removeClass('star_selected');
                
                $_thiz.parent().find('.star_hover').addClass('star_persist')
                
                $.rating.setValue($wrap, ($_thiz.attr('rel')));
                changed = true;
            })
        })
		
		var $annotation = $('<span/>').addClass('annotation').appendTo($wrap);
		
        $.rating.setValue($wrap, this.filter('[checked]').val())
        
        // Remove the radios 
        this.remove();
        
    };
})(jQuery);
