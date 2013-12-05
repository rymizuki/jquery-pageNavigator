# pageNavigator

The best jQuery plugin ever.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/mizuki/jquery-page-navigator/master/dist/pageNavigator.min.js
[max]: https://raw.github.com/mizuki/jquery-page-navigator/master/dist/pageNavigator.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/pageNavigator.min.js"></script>
<script>
jQuery(function($) {
  // initialize
  $('.nav-pager').pageNavigator({
      // set or data-bind use '.nav-pager[data-**=xx]'
      "total_entries":    100,
      "entries_per_page":  20,
      "current_page":       1,
  });

  // pagenation
  $('.page-ctrl').on('click', function () {
      $('.nav-pager').pageNavigator('next'); // or 'prev'
  });

  // handle events. use 'pn:event_name'
  $('.nav-pager').on('pn:navigate', function () {
  });
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
