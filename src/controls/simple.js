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
