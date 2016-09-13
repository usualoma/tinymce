define(
  'ephox.katamari.api.Obj',

  [
    'ephox.katamari.api.Option',
    'global!Object'
  ],

  function (Option, Object) {
    // There are many variations of Object iteration that are faster than the 'for-in' style:
    // http://jsperf.com/object-keys-iteration/107
    //
    // Use the native keys if it is available (IE9+), otherwise fall back to manually filtering
    var keys = (function () {
      var fastKeys = Object.keys;

      // This technically means that 'each' and 'find' on IE8 iterate through the object twice.
      // Our code doesn't run on IE8 much, so I believe it's an acceptable tradeoff.
      // If it becomes a problem we can always duplicate the feature detection inside each and find as well.
      var slowKeys = function (o) {
        var r = [];
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            r.push(i);
          }
        }
        return r;
      };

      return fastKeys === undefined ? slowKeys : fastKeys;
    })();


    var each = function (obj, f) {
      var props = keys(obj);
      for (var k = 0, len = props.length; k < len; k++) {
        var i = props[k];
        var x = obj[i];
        f(x, i, obj);
      }
    };

    var objectMap = function (obj, f) {
      return tupleMap(obj, function (x, i, obj) {
        return {
          k: i,
          v: f(x, i, obj)
        };
      });
    };

    var tupleMap = function (obj, f) {
      var r = {};
      each(obj, function (x, i) {
        var tuple = f(x, i, obj);
        r[tuple.k] = tuple.v;
      });
      return r;
    };

    var bifilter = function (obj, pred) {
      var t = {};
      var f = {};
      each(obj, function(x, i) {
        var branch = pred(x, i) ? t : f;
        branch[i] = x;
      });
      return {
        t: t,
        f: f
      };
    };

    var mapToArray = function (obj, f) {
      var r = [];
      each(obj, function(value, name) {
        r.push(f(value, name));
      });
      return r;
    };

    var find = function (obj, pred) {
      var props = keys(obj);
      for (var k = 0, len = props.length; k < len; k++) {
        var i = props[k];
        var x = obj[i];
        if (pred(x, i, obj)) {
          return Option.some(x);
        }
      }
      return Option.none();
    };

    var values = function (obj) {
      return mapToArray(obj, function (v) {
        return v;
      });
    };

    var size = function (obj) {
      return values(obj).length;
    };

    return {
      bifilter: bifilter,
      each: each,
      map: objectMap,
      mapToArray: mapToArray,
      tupleMap: tupleMap,
      find: find,
      keys: keys,
      values: values,
      size: size
    };
  }
);