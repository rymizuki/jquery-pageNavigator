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
