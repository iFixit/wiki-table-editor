'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _wikiTableEditor = require('./wiki-table-editor.js');

var _wikiTableEditor2 = _interopRequireDefault(_wikiTableEditor);

require('./wiki-table-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rows = [{
   id: 1,
   first: 'John',
   last: 'Johnson',
   company: 'John Inc.',
   sentence: 'consequatur nihil minima'
}, {
   id: 2,
   first: 'Mike',
   last: 'Mikeson',
   company: 'Mike Inc.',
   sentence: 'a sequi doloremque sed'
}, {
   id: 3,
   first: 'Jake',
   last: 'Jackson',
   company: 'Jake Inc.',
   sentence: 'sed id quo voluptatem'
}, {
   id: 4,
   first: 'Don',
   last: 'Donson',
   company: 'Don Inc.',
   sentence: 'voluptatem voluptatem ut'
}];

var columns = [{
   property: 'first',
   label: 'First Name'
}, {
   property: 'last',
   label: 'Last Name'
}, {
   property: 'company',
   label: 'Company'
}, {
   property: 'sentence',
   label: 'Sentence'
}];

var App = function (_Component) {
   _inherits(App, _Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

      _this.state = {
         rows: rows,
         columns: columns
      };

      _this.setRows = _this.setRows.bind(_this);
      _this.printJSON = _this.printJSON.bind(_this);
      return _this;
   }

   _createClass(App, [{
      key: 'setRows',
      value: function setRows(rows) {
         this.setState({ rows: rows });
      }
   }, {
      key: 'printJSON',
      value: function printJSON() {
         console.log(this.state.rows);
      }
   }, {
      key: 'render',
      value: function render() {
         return _react2.default.createElement(
            'div',
            { className: 'App' },
            _react2.default.createElement(_wikiTableEditor2.default, {
               rows: this.state.rows,
               columns: this.state.columns,
               setRows: this.setRows,
               getDeleteButton: function getDeleteButton(onClick) {
                  return _react2.default.createElement(
                     'button',
                     { onClick: onClick },
                     'Delete'
                  );
               },
               getAddButton: function getAddButton(onClick) {
                  return _react2.default.createElement(
                     'button',
                     { onClick: onClick },
                     'Add'
                  );
               },
               getDragHandle: function getDragHandle() {
                  return _react2.default.createElement(
                     'p',
                     null,
                     'Drag'
                  );
               }
            }),
            _react2.default.createElement(
               'button',
               { onClick: this.printJSON },
               'Print JSON'
            )
         );
      }
   }]);

   return App;
}(_react.Component);

exports.default = App;