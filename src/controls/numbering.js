PageNavigator.controls.Numbering = (function ($, util, Simple) {
  'use strict';

  // extend ths Simple classes.
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


