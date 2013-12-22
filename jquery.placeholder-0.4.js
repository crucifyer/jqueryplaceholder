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

		function toInt(v) {
			return v.replace(/[^\d]+$/, '') * 1;
		}

		function copyArgs(argums) {
			var args = [], i;
			for(i = 0; i < argums.length; i ++) {
				args.push(argums[i]);
			}
			return args;
		}

		function relocatePlaceholder() {
			$(this).css('margin', 0);
			var inpoffset = $(this.inp).offset();
			var phoffset = $(this).offset();
			$(this).css({'margin': (toInt($(this.inp).css('padding-top')) + toInt($(this.inp).css('border-top-width')) + 1 + inpoffset.top - phoffset.top) + 'px 0 0 '
				+ (toInt($(this.inp).css('padding-left')) + toInt($(this.inp).css('border-left-width')) + 1 + inpoffset.left - phoffset.left) + 'px'});
		}

		var _PlaceHolderMaker = function() {
			if(this._placeholderObj) return;
			if(!this.id) { this.id = '_PHSeq' + phSeq; phSeq ++; }
			var input = this, w = $(this).width();
			if(this.tagName == 'TEXTAREA') w -= 16;

			this._placeholderObj = $('<label />', {
				'for': this.id,
				'class': 'placeholder',
				'text': $(this).attr('placeholder')
			}).css({
				'position': 'absolute',
				'cursor': 'text',
				'overflow': 'hidden',
				'white-space': 'normal',
				'float': 'none',
				'display': this.value ? 'none' : 'block',
				'margin': 0,
				'padding': 0,
				'width': w + 'px',
				'height': $(this).height() + 'px',
				'font-size': $(this).css('font-size')
			})[0];

			this._placeholderObj.inp = this;

			$(this).before(this._placeholderObj);

			$(this._placeholderObj).each(relocatePlaceholder).on('click', function() {
				this.focus();
			});

			$(this).on('focus', function() {
				$(this._placeholderObj).hide();
			}).on('blur', function() {
				if(!this.value) $(this._placeholderObj).show();
			}).addClass('placeholderAdded');
		}

		$.each(['show', 'fadeIn', 'slideDown'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				var args = copyArgs(arguments);

				of.apply(this, args);

				if(typeof(args[args.length - 1]) == "function") args.pop();

				this.each(function() {
					var $this = $(this);
					if($this.is(':not(:input[placeholder])')) {
						$(':input[placeholder]:not(.placeholderAdded)', this).each(_PlaceHolderMaker);
						return;
					}
					if(!this._placeholderObj) {
						$this.each(_PlaceHolderMaker);
					}
					if(!this.value) {
						var $self = $(this._placeholderObj).hide();
						$self[v].apply($self, args.slice());
					}
				});

				return this;
			}
		});
		$.each(['hide', 'fadeOut', 'slideUp'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				var args = copyArgs(arguments);

				of.apply(this, args);

				if(typeof(args[args.length - 1]) == "function") args.pop();

				this.each(function() {
					if(this._placeholderObj) {
						var $self = $(this._placeholderObj);
						$self[v].apply($self, args.slice());
					}
				});

				return this;
			}
		});
		$.each(['remove'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				var args = copyArgs(arguments);

				this.each(function() {
					if(this._placeholderObj) $(this._placeholderObj)[v]();
				});

				return of.apply(this, args);
			}
		});
		$.each(['append', 'prepend', 'after', 'before'], function(i, v) {
			var of = $.fn[v];
			$.fn[v] = function() {
				var args = copyArgs(arguments);

				if(this.is('label.placeholder')) {
					of.apply(this, args);
					return this;
				}

				if(!args[0].jquery) args[0] = $(args[0]);

				of.apply(this, args);

				args[0].filter(':input[placeholder]:visible').filter(function() {
					return !this._placeholderObj;
				}).each(_PlaceHolderMaker);
				args[0].find(':input[placeholder]:visible').filter(function() {
					return !this._placeholderObj;
				}).each(_PlaceHolderMaker);

				return this;
			}
		});

		$(function() {
			$(':input[placeholder]:visible').each(_PlaceHolderMaker);

			setInterval(function() {
				$('label.placeholder:visible').each(relocatePlaceholder);
			}, 1000);
		});
	}
})(jQuery);
