/*
License: GPLv3
Creator : 알찬돌삐
Modifier : 시우施雨
This Version : Song Hyo Jin (shj at xenosi.de)
Project Page : http://code.google.com/p/jqueryplaceholder/

-- placeholder css --
caution : browsers cannot parse this (label.placeholder, input::-webkit-input-placeholder, input:-moz-placeholder, textarea::-webkit-input-placeholder, textarea:-moz-placeholder)

label.placeholder {
	color:#999 !important;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	color:#999 !important;
}
input:-moz-placeholder, textarea:-moz-placeholder {
	color:#999 !important;
}
*/

(function($) {
	if(!('placeholder' in $('<input />')[0])) {
		var phSeq = 0;
		var _PlaceHolderMaker = function() {
			if(!!this._placeholderObj) return;
			if(!this.id) this.id = '_PHSeq' + phSeq;
			phSeq ++;
			var input = this;
			var w = $(this).width();
			if(this.tagName == 'TEXTAREA') w -= 16;
			this._placeholderObj = $('<label />', {
				'for':this.id,
				'class':'placeholder',
				'text':$(this).attr('placeholder')
			}).css({
				'position':'absolute',
				'cursor':'text',
				'overflow':'hidden',
				'white-space':'normal',
				'float':'none',
				'display':'block',
				'margin':'0',
				'padding':'0',
				'width': w + 'px',
				'height':$(this).height() + 'px',
				'font-size':$(this).css('font-size')
			})[0];
			
			$(this).before(this._placeholderObj);
			
			var inpoffset = $(this).offset();
			var phoffset = $(this._placeholderObj).offset();
			$(this._placeholderObj).css({'margin':(parseInt($(this).css('padding-top')) + parseInt($(this).css('border-top-width')) + 1 + inpoffset.top - phoffset.top) + 'px 0 0 '
				+ (parseInt($(this).css('padding-left')) + parseInt($(this).css('border-left-width')) + 1 + inpoffset.left - phoffset.left) +'px'});
		
			if(!!this.value.length) $(this._placeholderObj).hide();
			$(this._placeholderObj).on('click', function() { this.focus(); });
			$(this).on('focus', function() {
				$(this._placeholderObj).hide();
			}).on('blur', function() {
				if(!this.value.length) $(this._placeholderObj).show();
			}).addClass('placeholderAdded');
		}
	
		$.each(['show', 'fadeIn', 'slideDown'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				if(!$(this).is(':input[placeholder]')) {
					var self = of.apply(this, arguments);
					$(':input[placeholder]:not(.placeholderAdded)', self).each(_PlaceHolderMaker);
				}
				var self = of.apply(this, arguments);
				try {
					if(!!self[0]._placeholderObj && !self[0].value.length) { $(self[0]._placeholderObj).show(); return self; }
				} catch(e) {}
				if(self.is(':input[placeholder]:visible:not(.placeholderAdded)')) { self.each(_PlaceHolderMaker); return self; }
				return self;
			}
		});
		$.each(['hide', 'fadeOut', 'slideUp'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				if(!$(this).is(':input[placeholder]')) return of.apply(this, arguments);
				var self = of.apply(this, arguments);
				try {
					if(!self[0]._placeholderObj) return self;
				} catch(e) {
					return self;
				}
				if($(self[0]._placeholderObj).is(':hidden')) return self;
				$(self[0]._placeholderObj).hide();
				return self;
			}
		});
		$.each(['remove'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				try {
					if(!!(this[0]._placeholderObj)) this[0]._placeholderObj.parentNode.removeChild(this[0]._placeholderObj);
				} catch(e) {}
				return of.apply(this, arguments);
			}
		});
		$.each(['append', 'prepend', 'after', 'before'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				if(!arguments[0].jquery && (!!arguments[0].tagName || /^<.+>$/i.test(String(arguments[0])))) {
					arguments[0] = $(arguments[0]);
				}
				of.apply(this, arguments);
				if(!!arguments[0].jquery && arguments[0].is(':input[placeholder]:visible:not(.placeholderAdded)')) {
					arguments[0].each(_PlaceHolderMaker);
				}
				return this;
			}
		});

		$(function() {
			$(':input[placeholder]:visible').each(_PlaceHolderMaker);
		});
	}
})(jQuery);
