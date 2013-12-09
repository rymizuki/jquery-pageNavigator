(function ($) {
  'use strict';

  // Collection method.
  $.fn.pageNavigator = function(method, options) {
    var opts;
    if (typeof method === 'object') {
      opts   = method;
      method = null;
    } else {
      opts = options || {};
    }

    return this.each(function() {
      var $this = $(this),
          data  = $this.data('page-navigator.data-api');

      if (!data) {
        data = $.pageNavigator($this, opts);
        $this.data('page-navigator.data-api', data);
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
