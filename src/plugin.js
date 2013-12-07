(function ($) {
  'use strict';

  // Collection method.
  $.fn.pageNavigator = function(method, options) {
    return this.each(function() {
      var $this = $(this),
          data  = $this.data('page-navigator');
      var opts = typeof method === 'object' ? method : (options || {});

      if (!data) {
        data = $.pageNavigator($this, opts);
        $this.data('page-navigator', data);
      }

      if (method && typeof method === 'string') {
        data[method]();
      }
    });
  };

  // Static method.
  $.pageNavigator = function(selector, options) {
    options = $.extend({}, $.pageNavigator.options, options);
    return new PageNavigator(selector, options);
  };

  // Static method default options.
  $.pageNavigator.options = {
    "is_render_controls": true,
    "extension": "Simple",
    "controls": {
      "class":    null,
      "uri_with": null,
      "prev_text": 'prev',
      "next_text": 'next'
    }
  };
}(jQuery));