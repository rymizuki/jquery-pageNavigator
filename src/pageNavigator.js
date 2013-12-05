/*
 * pageNavigator
 * https://github.com/mizuki/jquery-page-navigator
 *
 * Copyright (c) 2013 mizuki_r
 * Licensed under the MIT license.
 */

(function($) {

  var _parse_query = function (queries) {
    var param = {};
    queries = queries.replace(/^\?/, '');
    queries.split('&').forEach(function (query) {
        if(query.match(/=/)) {
            var q = query.split('=');
            param[q[0]] = q[1];
        }
    });
    return param;
  };
  var _create_query = function (param) {
    var queries = [];
    for (var key in param) {
        queries.push(key + '=' + param[key]);
    }
    return queries.join('&');
  };
  var _encodeUri = function (args) {
    var result = {};
    for (var key in args) {
        result[encodeURIComponent(key) ] = encodeURIComponent(args[key]);
    }
    return result;
  };
  var _uri_with = function (args) {
    var param = _parse_query(location.search);
    $.extend(param, _encodeUri(args));
    return location.pathname + '?' + _create_query(param);
  };

  var Controls = (function () {
    var Controls = function ($el, pager, options) {
      this.$el = $el;

      this.pager = pager;

      this.prev_text = options.prev_text;
      this.next_text = options.next_text;
    };
    Controls.prototype.render = function () {
      var $container = $('<ul>')
        .append(this.renderPrev())
        .append(this.renderCurr())
        .append(this.renderNext());
      this.$el.html($container);

      if (!this.pager.prevPage()) {
        this.disabled('prev');
      }
      if (!this.pager.nextPage()) {
        this.disabled('next');
      }
    };
    Controls.prototype.disabled = function (ctrl) {
      var $ctrl = this.$el.find('.pager-'+ctrl);
      $ctrl.addClass('disabled');
      $ctrl.attr('href', null);
    };
    Controls.prototype.navigate = function () {
      // pagenating and rebuild dom elements
      this.render();
    };
    Controls.prototype.makeControl = function (text, attr) {
      return $('<li/>').append($('<a>').attr(attr).text(text));
    };
    Controls.prototype.renderCurr = function () {
      return this.makeControl(this.pager.currPage(), {
        "class": 'pager-curr',
        "href": _uri_with({"page": this.pager.currPage()})
      });
    };
    Controls.prototype.renderPrev = function () {
      return this.makeControl(this.prev_text, {
        "class": 'pager-prev',
        'href': _uri_with({"page": this.pager.prevPage()})
      });
    };
    Controls.prototype.renderNext = function () {
      return this.makeControl(this.next_text, {
        "class": 'pager-next',
        'href': _uri_with({"page": this.pager.nextPage()})
      });
    };

    return Controls;
  })();

  var Pager = (function () {
    var Pager = function (options) {
      this.has_next = void 0;

      // set pager parameters.
      this.total_entries    = Number(options.total_entries);
      this.entries_per_page = Number(options.entries_per_page);
      this.current_page     = Number(options.current_page);

      if (options.has_next) {
        this.has_next = !!Number(options.has_next);
      }
    };
    Pager.prototype.setCurrPage = function (p, has_next) {
      var page = Number(p);
      this.current_page = page;

      if (has_next === void 0) {
        this.has_next = has_next;
      } else {
        this.has_next = void 0;
      }
    };
    Pager.prototype.hasNext = function (has_next) {
      if (has_next !== void 0) {
        this.has_next = !!has_next;
      }
      if (this.has_next === void 0) {
        this.has_next = this.currPage() < this.lastPage() ? true : false;
      }
      return this.has_next;
    };
    Pager.prototype.currPage = function () {
      return this.current_page;
    };
    Pager.prototype.prevPage = function () {
      return this.currPage() > 1 ? (this.currPage() - 1) : null;
    };
    Pager.prototype.nextPage = function () {
      return this.hasNext() ? (this.currPage() + 1) : null;
    };
    Pager.prototype.lastPage = function () {
      if (this.total_entries < 1) {
        return 1;
      }
      var pages = this.total_entries / this.entries_per_page;
      if (pages === parseInt(pages, 10)) {
        return pages;
      } else {
        return parseInt(pages, 10) + 1;
      }
    };

    return Pager;
  })();

  var PageNavigator = (function ($) {
    var PageNavigator = function (selector, options) {
      // set element.
      this.$el = selector instanceof $ ? selector : $(selector);
      this.el  = this.$el.get(0);

      // set options
      this.opts = options;

      // set pager
      this.pager = new Pager({
        "total_entries":    options.total_entries,
        "entries_per_page": options.entries_per_page,
        "current_page":     options.current_page
      });

      // render control elements.
      this.controls = new Controls(this.$el, this.pager, this.opts.controls);
      if (this.opts.is_render_controls) {
        this.controls.render();
      }
    };

    PageNavigator.prototype.navigate = function (page) {
      this.pager.setCurrPage(page);
      this.controls.navigate();
      this.$el.trigger('pn:navigate', [page]);
    };

    PageNavigator.prototype.next = function () {
      if (this.pager.nextPage()) {
        this.navgate(this.pager.nextPage());
      } else {
        return null;
      }
    };
    PageNavigator.prototype.prev = function () {
      if (this.pager.prevPage()) {
        this.navgate(this.pager.prevPage());
      } else {
        return null;
      }
    };

    return PageNavigator;
  })($);

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
    "controls": {
      "prev_text": 'prev',
      "next_text": 'next'
    }
  };
}(jQuery));
