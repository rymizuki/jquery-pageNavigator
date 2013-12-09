/*! pageNavigator - v0.0.7 - 2013-12-09
* https://github.com/mizuki/jquery-page-navigator
* Copyright (c) 2013 mizuki_r; Licensed MIT */
var PageNavigator = (function ($) {
  'use strict';

  var PageNavigator = function (selector, options) {
    // set element.
    this.$el = selector instanceof $ ? selector : $(selector);
    this.el  = this.$el.get(0);

    // set options
    this.opts = options;

    // set pager
    this.pager = new PageNavigator.Pager({
      "total_entries":    this.$el.attr('data-total-entries')    || options.total_entries,
      "entries_per_page": this.$el.attr('data-entries-per-page') || options.entries_per_page,
      "current_page":     this.$el.attr('data-current-page')     || options.current_page
    });

    // render control elements.
    this.controls = new PageNavigator.controls[options.extension](this.$el, this.pager, this.opts.controls);
    if (this.opts.is_render_controls) {
      this.render();
    }
  };

  PageNavigator.prototype.render = function () {
    this.controls.render();
    this.$el.trigger('pn:navigate', [this, this.pager.currPage()]);
  };

  PageNavigator.prototype.navigate = function (page) {
    this.pager.setCurrPage(page);
    this.controls.navigate();
    this.$el.trigger('pn:navigate', [this, page]);
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
}(jQuery));

PageNavigator.controls = {};



PageNavigator.util = (function ($) {
  'use strict';

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

  return {
    "uri_with": _uri_with
  };
}(jQuery));

PageNavigator.Pager = (function () {
  'use strict';

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
  Pager.prototype.firstPage = function () {
    return 1;
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
}());

PageNavigator.controls.Simple = (function ($, util) {
  'use strict';

  var Controls = function ($el, pager, options) {
    this.$el = $el;

    // pager object
    this.pager = pager;

    // ul's class nam, utile
    this.class = options.class;

    // uri make function
    this.uri_with = options.uri_with || util.uri_with;

    this.prev_text = options.prev_text;
    this.next_text = options.next_text;
  };
  Controls.prototype.render = function () {
    var $container = $('<ul>').addClass(this.class)
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
      "href": this.uri_with({"page": this.pager.currPage()})
    });
  };
  Controls.prototype.renderPrev = function () {
    return this.makeControl(this.prev_text, {
      "class": 'pager-prev',
      'href': this.uri_with({"page": this.pager.prevPage()})
    });
  };
  Controls.prototype.renderNext = function () {
    return this.makeControl(this.next_text, {
      "class": 'pager-next',
      'href': this.uri_with({"page": this.pager.nextPage()})
    });
  };

  return Controls;
}(jQuery, PageNavigator.util));

PageNavigator.controls.Numbering = (function ($, util, Simple) {
  'use strict';

  // extend ths Simple class.
  var Numbering = function ($el, pager, options) {
    Simple.apply(this, [$el, pager, options]);
    this.link_num_step = options.number_step || 2;
  };
  Numbering.prototype = Object.create(Simple.prototype);
  Numbering.prototype.constructor = Simple;

  // override some methods.
  Numbering.prototype.renderCurr = function () {
    var period = this.calcLabelPeriod();
    var start = period[0];
    var end   = period[1];

    var links = [];
    for (var cnt = start; cnt <= end; cnt++) {
      var label_class = 'pager-label';
      if (this.pager.currPage() === cnt) { label_class += ' active'; }
      links.push(this.makeControl(cnt, {class: label_class, href: this.uri_with({page: cnt})}));
    }
    if (start > this.pager.firstPage()) {
      if (start > (this.pager.firstPage() + this.link_num_step)) {
        links.unshift(this.makeControl('...', {class: 'pager-divider disabled'}));
      }
      links.unshift(this.makeControl(this.pager.firstPage(), {
        class: 'pager-label',
        href : this.uri_with({page: this.pager.firstPage()})
      }));
    }
    if (end < this.pager.lastPage()) {
      if (end < (this.pager.lastPage() - this.link_num_step)) {
        links.push(this.makeControl('...', {class: 'pager-divider disabled'}));
      }
      links.push(this.makeControl(this.pager.lastPage(), {
        class: 'pager-label',
        href : this.uri_with({page: this.pager.lastPage()})
      }));
    }
    return links;
  };

  Numbering.prototype.calcLabelPeriod = function () {
    var link_start = this.pager.currPage() - this.link_num_step,
        link_end   = this.pager.currPage() + this.link_num_step;

    var first_page = this.pager.firstPage(),
        last_page  = this.pager.lastPage();

    if (!this.validLowerLimit(link_start)) {
      link_end   = link_end + (link_start * -1) + 1;
      if (!this.validUpperLimit(link_end)) {
        link_end = last_page;
      }

      link_start = first_page;
    } else if (!this.validUpperLimit(link_end)) {
      link_start = link_start - (link_end - last_page);
      if (!this.validLowerLimit(link_start)) {
        link_start = first_page;
      }

      link_end = last_page;
    }

    return [link_start, link_end];
  };
  Numbering.prototype.validUpperLimit = function (end) {
    return end <= this.pager.lastPage() ? true : false;
  };
  Numbering.prototype.validLowerLimit = function (start) {
    return start >= this.pager.firstPage() ? true : false;
  };

  return Numbering;
}(jQuery, PageNavigator.util, PageNavigator.controls.Simple));



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
