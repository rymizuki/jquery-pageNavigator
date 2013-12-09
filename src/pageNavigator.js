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

