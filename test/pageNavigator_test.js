(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#pageNavigator', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(2);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.pageNavigator(), this.elems, 'should be chainable');
    strictEqual(this.elems.find('.pager-prev').eq(0).text(), 'prev', 'should be');
  });

  module('jQuery.pageNavigator with TotalEntries', {
    setup : function () {
      this.elem = $('<nav/>').addClass('.nav-pager');
      this.nav = $.pageNavigator(this.elem, {
        "total_entries":    100,
        "entries_per_page":  20,
        "current_page":       1,
      });
    }
  });

  test('is construction with options', function () {
    strictEqual(this.nav.pager.total_entries, 100, 'should be total_entries is 100');
    strictEqual(this.nav.pager.entries_per_page, 20, 'should be current_page is 20');
    strictEqual(this.nav.pager.current_page, 1, 'should be current_page is 1');
  });

  test('is allowed page access', function () {
    strictEqual(this.nav.pager.currPage(), 1, 'should be curr_page is 1');
    strictEqual(this.nav.pager.nextPage(), 2, 'should be next_page is 2');
    strictEqual(this.nav.pager.prevPage(), null, 'should be prev_page is null');
    strictEqual(this.nav.pager.lastPage(), 5, 'should be last_page is 20');
  });

  test('is created controls', function () {
    strictEqual(this.elem.find('.pager-prev').text(), 'prev', 'should be prev element');
    strictEqual(this.elem.find('.pager-curr').text(), '1',    'should be curr element');
    strictEqual(this.elem.find('.pager-next').text(), 'next', 'should be next element');
  });

  test('is prev-link', function () {
    ok(this.elem.find('.pager-prev').hasClass('disabled'), 'should be prev page is disabled');
  });

  test('is href attribute on', function () {
    strictEqual(this.elem.find('.pager-prev').attr('href'), undefined,  'should be null');
    ok(this.elem.find('.pager-next').attr('href').match(/page=2/), 'should be "/?page=2"');
  });

  module('jQuery.pageNavigator.next', {
    setup : function () {
      this.elem = $('<nav/>').addClass('.nav-pager');
      this.nav = $.pageNavigator(this.elem, {
        "total_entries":    100,
        "entries_per_page":  20,
        "current_page":       1,
      });
    }
  });

  test('execute page 2', function () {
    this.nav.navigate(2);
    strictEqual(this.nav.pager.currPage(), 2, 'should be current_page is 2');
    strictEqual(this.nav.pager.prevPage(), 1, 'should be prev_page is 1');
    strictEqual(this.nav.pager.nextPage(), 3, 'should be next_page is 3');
    ok(!this.elem.find('.pager-prev').hasClass('disabled'), 'should not be disable class');
    ok(!this.elem.find('.pager-next').hasClass('disabled'), 'should not be disable class');
  });

  test('execute page 5', function () {
    this.nav.navigate(5);
    strictEqual(this.nav.pager.currPage(), 5, 'should be current_page is 5');
    strictEqual(this.nav.pager.prevPage(), 4, 'should be prev_page is 4');
    strictEqual(this.nav.pager.nextPage(), null, 'should be next_page is null');
    ok(!this.elem.find('.pager-prev').hasClass('disabled'), 'should not be disable class');
    ok(this.elem.find('.pager-next').hasClass('disabled'), 'should be disable class');
  });

  module('jQuery.pageNavigator with data-api', {
    setup: function () {
      this.elem = $('<nav/>', {
        "data-total-entries":    100,
        "data-entries-per-page":  20,
        "data-current-page":       1
      }).pageNavigator();
      this.nav = this.elem.data('page-navigator.data-api');
    },
  });

  test('is construction with options', function () {
    strictEqual(this.nav.pager.total_entries, 100, 'should be total_entries is 100');
    strictEqual(this.nav.pager.entries_per_page, 20, 'should be current_page is 20');
    strictEqual(this.nav.pager.current_page, 1, 'should be current_page is 1');
  });

  test('is allowed page access', function () {
    strictEqual(this.nav.pager.currPage(), 1, 'should be curr_page is 1');
    strictEqual(this.nav.pager.nextPage(), 2, 'should be next_page is 2');
    strictEqual(this.nav.pager.prevPage(), null, 'should be prev_page is null');
    strictEqual(this.nav.pager.lastPage(), 5, 'should be last_page is 20');
  });

  test('is created controls', function () {
    strictEqual(this.elem.find('.pager-prev').text(), 'prev', 'should be prev element');
    strictEqual(this.elem.find('.pager-curr').text(), '1',    'should be curr element');
    strictEqual(this.elem.find('.pager-next').text(), 'next', 'should be next element');
  });

  test('is prev-link', function () {
    ok(this.elem.find('.pager-prev').hasClass('disabled'), 'should be prev page is disabled');
  });

  test('is href attribute on', function () {
    strictEqual(this.elem.find('.pager-prev').attr('href'), undefined,  'should be null');
    ok(this.elem.find('.pager-next').attr('href').match(/page=2/), 'should be "/?page=2"');
  });
}(jQuery));
