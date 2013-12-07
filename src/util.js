
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
