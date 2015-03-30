"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var path = require("path"),
    clean = require("js-beautify").html,
    jsx = require("node-jsx"),
    React = require("react");

var View = (function () {
  function View(options) {
    _classCallCheck(this, View);

    options = options || {};

    options.cache = options.cache || false;
    options.markup = options.markup || "<!doctype html>";
    options.path = options.path || process.cwd();
    options.pretty = options.pretty || false;

    this.opts = options;

    jsx.install(options.jsx || { extension: ".jsx" });
  }

  _createClass(View, {
    flush: {
      value: function flush(key) {
        if (key) {
          return delete View.cache[key];
        }View.cache = {};
      }
    },
    render: {
      value: function render(template, locals) {
        var self = this;
        locals = locals || {};

        return new Promise(function (resolve, reject) {
          if (View.cache[template] && self.opts.cache) {
            return resolve(View.cache[template]);
          }

          var view = require(path.join(self.opts.path, template)),
              output = [];

          view = view["default"] || view;
          view = React.createFactory(view);

          output.push(self.opts.markup, React.renderToStaticMarkup(view(locals)));

          output = output.join("");
          if (self.opts.pretty) output = clean(output);

          if (self.opts.cache) View.cache[template] = output;

          resolve(output);
        });
      }
    }
  });

  return View;
})();

View.cache = {};

module.exports = function (options) {
  return new View(options);
};