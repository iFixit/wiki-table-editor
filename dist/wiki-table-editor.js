'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require('react-dnd');

var _index = require('react-dnd-multi-backend/lib/index');

var _index2 = _interopRequireDefault(_index);

var _reactabularTable = require('reactabular-table');

var Table = _interopRequireWildcard(_reactabularTable);

var _reactabularDnd = require('reactabular-dnd');

var dnd = _interopRequireWildcard(_reactabularDnd);

var _lodash = require('lodash');

var _draggableRow = require('./draggable-row.js');

var _draggableRow2 = _interopRequireDefault(_draggableRow);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DndRow = (0, _draggableRow2.default)('tr');

var DndCell = function (_React$Component) {
   _inherits(DndCell, _React$Component);

   function DndCell() {
      _classCallCheck(this, DndCell);

      return _possibleConstructorReturn(this, (DndCell.__proto__ || Object.getPrototypeOf(DndCell)).apply(this, arguments));
   }

   _createClass(DndCell, [{
      key: 'render',
      value: function render() {
         var _props = this.props,
             candragcell = _props.candragcell,
             connectDragSource = _props.connectDragSource,
             children = _props.children,
             tdProps = _objectWithoutProperties(_props, ['candragcell', 'connectDragSource', 'children']);

         var td = _react2.default.createElement(
            'td',
            tdProps,
            children
         );

         if (candragcell) {
            return connectDragSource(td);
         } else {
            return td;
         }
      }
   }]);

   return DndCell;
}(_react2.default.Component);
/**
 * A table editor that allows the user to edit cells and reorder rows.
 * This is a simple wrapper around Reactabular with its 'dnd' and 'edit'
 * modules.
 *
 * Sample usage (see demo.jsx for a full example):
 *
 * rows = [{
 *   id: 1,
 *   name: 'Fred'
 * }];
 *
 * columns = [{
 *   property: 'name',
 *  label: 'Name'
 * }];
 *
 * setRows: a function that updates the `rows` prop.
 *
 * <WikiTableEditor
 *  rows={rows}
 *  columns={columns}
 *  setRows={setRows} />
 */


var TableEditor = function (_React$Component2) {
   _inherits(TableEditor, _React$Component2);

   function TableEditor(props) {
      _classCallCheck(this, TableEditor);

      var _this2 = _possibleConstructorReturn(this, (TableEditor.__proto__ || Object.getPrototypeOf(TableEditor)).call(this, props));

      _this2.onRow = _this2.onRow.bind(_this2);
      _this2.onMoveRow = _this2.onMoveRow.bind(_this2);
      _this2.addRow = _this2.addRow.bind(_this2);
      _this2.setCell = _this2.setCell.bind(_this2);
      _this2.setNewCell = _this2.setNewCell.bind(_this2);
      _this2.onFocus = _this2.onFocus.bind(_this2);
      _this2.onBlur = _this2.onBlur.bind(_this2);
      _this2.deleteButtonFormatter = _this2.deleteButtonFormatter.bind(_this2);
      _this2.addNewButtonFormatter = _this2.addNewButtonFormatter.bind(_this2);

      // The "newRow" is the row at the bottom of the table. It gets added to the
      // table when the user clicks "Add Row."
      _this2.state = {
         newRow: { id: 1 }
      };

      // Whether the user has an <input> in focus.
      _this2.state.isEditing = false;
      return _this2;
   }

   _createClass(TableEditor, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
         var _this3 = this;

         this.props.columns.forEach(function (column) {
            _this3.setState(function (prevState) {
               prevState.newRow[column.property] = '';
               return prevState;
            });
         });
      }
   }, {
      key: 'render',
      value: function render() {
         // Use Row components that can be dragged-and-dropped.
         var components = {
            body: {
               row: DndRow,
               cell: DndCell
            }
         };

         var rows = this.props.rows;
         var columns = this.getColumns(this.setCell, this.deleteButtonFormatter, this.props.getDragHandle);

         var newRows = [this.state.newRow];
         var newColumns = this.getColumns(this.setNewCell, this.addNewButtonFormatter, function () {
            return null;
         });

         var isDragging = this.props.rows.some(function (row) {
            return row.dragging;
         });

         return _react2.default.createElement(
            'div',
            { className: 'wiki-table-editor' + (isDragging ? ' dragging' : '') },
            _react2.default.createElement(
               Table.Provider,
               { renderers: components, columns: columns },
               _react2.default.createElement(Table.Header, { headerRows: [columns] }),
               _react2.default.createElement(Table.Body, { rows: rows, rowKey: 'id', onRow: this.onRow })
            ),
            _react2.default.createElement(
               Table.Provider,
               { columns: newColumns },
               _react2.default.createElement(Table.Body, { rows: newRows, rowKey: 'id' })
            )
         );
      }

      /**
       * Transform our `columns` prop into column definitions for reactabular.
       */

   }, {
      key: 'getColumns',
      value: function getColumns(onCellChange, actionButtonFormatter, dragHandleFormatter) {
         var _this4 = this;

         return [
         // The "drag this row" handle.
         {
            header: {
               props: {
                  className: 'drag-handle-cell'
               }
            },
            cell: {
               formatters: [dragHandleFormatter],
               props: {
                  candragcell: 'true',
                  className: 'drag-handle-cell'
               }
            }
         }].concat(_toConsumableArray(this.props.columns.map(function (_ref) {
            var property = _ref.property,
                label = _ref.label;

            return {
               property: property,
               header: {
                  label: label,
                  props: {
                     className: property + '-cell'
                  }
               },
               cell: {
                  formatters: [
                  // Wrap <td> contents in a <div>. This makes it easier to style
                  // the table cells.
                  function (value, _ref2) {
                     var rowData = _ref2.rowData;
                     return _react2.default.createElement(
                        'div',
                        { className: 'cell-content' },
                        _react2.default.createElement('input', {
                           type: 'text',
                           value: rowData[property] || '',
                           placeholder: label,
                           onFocus: _this4.onFocus,
                           onBlur: _this4.onBlur,
                           onChange: function onChange(event) {
                              onCellChange(rowData.id, property, event.target.value);
                           }
                        })
                     );
                  }],
                  props: {
                     className: property + '-cell'
                  }
               }
            };
         })), [
         // Include one more column for a button. This can be a delete button or
         // anything that the caller wants.
         {
            header: {
               props: {
                  className: 'action-button-cell'
               }
            },
            cell: {
               formatters: [actionButtonFormatter],
               props: {
                  className: 'action-button-cell'
               }
            }
         }]);
      }

      /**
       * Given a row, returns a delete button for that row.
       */

   }, {
      key: 'deleteButtonFormatter',
      value: function deleteButtonFormatter(value, _ref3) {
         var rowData = _ref3.rowData;

         return this.props.getDeleteButton(this.deleteRow.bind(this, rowData.id));
      }

      /**
       * Returns an "Add new row" button.
       */

   }, {
      key: 'addNewButtonFormatter',
      value: function addNewButtonFormatter(value, _ref4) {
         var rowData = _ref4.rowData;

         var newRowEmpty = !this.props.columns.some(function (column) {
            return rowData[column.property];
         });

         return this.props.getAddButton(this.addRow.bind(this, rowData), newRowEmpty);
      }

      /**
       * Called to set the props when rendering each row.
       */

   }, {
      key: 'onRow',
      value: function onRow(row) {
         var _this5 = this;

         return {
            rowId: row.id,
            onMove: this.onMoveRow,
            // Don't allow drag-and-drop if a cell is being edited.
            onCanMove: function onCanMove() {
               return !_this5.state.isEditing;
            },
            onMoveStart: function onMoveStart() {
               return _this5.setCell(row.id, 'dragging', true);
            },
            onMoveEnd: function onMoveEnd() {
               return _this5.setCell(row.id, 'dragging', false);
            },
            className: row.dragging ? 'dragging' : ''
         };
      }

      /**
       * Moves a row to its new position when the user finishes dragging it.
       */

   }, {
      key: 'onMoveRow',
      value: function onMoveRow(_ref5) {
         var sourceRowId = _ref5.sourceRowId,
             targetRowId = _ref5.targetRowId;

         var rows = dnd.moveRows({
            sourceRowId: sourceRowId,
            targetRowId: targetRowId
         })(this.props.rows);

         if (rows) {
            this.props.setRows(rows);
         }
      }

      /**
       * Deletes the row that has id `rowId`.
       */

   }, {
      key: 'deleteRow',
      value: function deleteRow(rowId) {
         var rows = this.props.rows.filter(function (rowData) {
            return rowData.id !== rowId;
         });

         this.props.setRows(rows);
      }

      /**
       * Returns a unique id for new rows. This is used for the row's key.
       */

   }, {
      key: 'getNextId',
      value: function getNextId() {
         // Return 1 plus the largest id currently in use.
         return 1 + Math.max.apply(Math, [1].concat(_toConsumableArray(this.props.rows.map(function (row) {
            return row.id;
         }))));
      }

      /**
       * Creates a new row at the bottom of the table.
       */

   }, {
      key: 'addRow',
      value: function addRow(rowData) {
         var rows = (0, _lodash.cloneDeep)(this.props.rows);

         rows.push(_extends({}, rowData, {
            id: this.getNextId()
         }));

         this.props.setRows(rows);

         // Clear the "add new row" row.
         var newRow = { id: 1 };
         this.props.columns.forEach(function (column) {
            newRow[column.property] = '';
         });
         this.setState({ newRow: newRow });
      }

      /**
       * Change the value of one property on one row.
       */

   }, {
      key: 'setCell',
      value: function setCell(rowId, property, value) {
         var index = (0, _lodash.findIndex)(this.props.rows, { id: rowId });
         var rows = (0, _lodash.cloneDeep)(this.props.rows);

         rows[index][property] = value;

         this.props.setRows(rows);
      }

      /**
       * Change the value of a cell in the "add new row" bar.
       */

   }, {
      key: 'setNewCell',
      value: function setNewCell(rowId, property, value) {
         this.setState({
            newRow: _extends({}, this.state.newRow, _defineProperty({}, property, value))
         });
      }
   }, {
      key: 'onFocus',
      value: function onFocus() {
         this.setState({
            isEditing: true
         });
      }
   }, {
      key: 'onBlur',
      value: function onBlur() {
         this.setState({
            isEditing: false
         });
      }
   }]);

   return TableEditor;
}(_react2.default.Component);

var WikiTableEditor = (0, _reactDnd.DragDropContext)(_index2.default)(TableEditor);

exports.default = WikiTableEditor;