'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDnd = require('react-dnd');

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // Copied from https://github.com/reactabular/reactabular/blob/master/packages/reactabular-dnd/src/draggable-row.js


var DragTypes = {
   ROW: 'row'
};
var rowSource = {
   canDrag: function canDrag(_ref) {
      var rowId = _ref.rowId,
          onCanMove = _ref.onCanMove;

      return onCanMove ? onCanMove({ rowId: rowId }) : true;
   },
   beginDrag: function beginDrag(_ref2) {
      var rowId = _ref2.rowId,
          onMoveStart = _ref2.onMoveStart;

      onMoveStart && onMoveStart({ rowId: rowId });

      return { rowId: rowId };
   },
   endDrag: function endDrag(_ref3) {
      var rowId = _ref3.rowId,
          onMoveEnd = _ref3.onMoveEnd;

      onMoveEnd && onMoveEnd({ rowId: rowId });
   }
};
var rowTarget = {
   hover: function hover(targetProps, monitor) {
      var targetRowId = targetProps.rowId;
      var sourceProps = monitor.getItem();
      var sourceRowId = sourceProps.rowId;

      // TODO: check if sourceRowId and targetRowId are undefined -> warning
      if (sourceRowId !== targetRowId) {
         targetProps.onMove({ sourceRowId: sourceRowId, targetRowId: targetRowId });
      }
   }
};

var dragSource = (0, _reactDnd.DragSource)(
// eslint-disable-line new-cap
DragTypes.ROW, rowSource, function (connect) {
   return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview()
   };
});
var dropTarget = (0, _reactDnd.DropTarget)(
// eslint-disable-line new-cap
DragTypes.ROW, rowTarget, function (connect) {
   return {
      connectDropTarget: connect.dropTarget()
   };
});
var DraggableRow = function DraggableRow(_ref4) {
   var _parent = _ref4._parent,
       connectDragSource = _ref4.connectDragSource,
       connectDropTarget = _ref4.connectDropTarget,
       connectDragPreview = _ref4.connectDragPreview,
       children = _ref4.children,
       onCanMove = _ref4.onCanMove,
       onMoveStart = _ref4.onMoveStart,
       onMoveEnd = _ref4.onMoveEnd,
       onMove = _ref4.onMove,
       rowId = _ref4.rowId,
       props = _objectWithoutProperties(_ref4, ['_parent', 'connectDragSource', 'connectDropTarget', 'connectDragPreview', 'children', 'onCanMove', 'onMoveStart', 'onMoveEnd', 'onMove', 'rowId']);

   return (
      // If you want to drag using a handle instead, then you need to pass
      // connectDragSource to a customized cell (DndCell) through React
      // context and wrap the handle there. You also need to annotate
      // this function using connectDragPreview.
      //
      // https://github.com/gaearon/react-dnd/releases/tag/v2.0.0 - ref trick
      _react2.default.createElement(_parent, _extends({}, props, {
         ref: function ref(e) {
            if (!e) {
               return;
            }

            var node = (0, _reactDom.findDOMNode)(e);

            // Chaining is not allowed
            // https://github.com/gaearon/react-dnd/issues/305#issuecomment-164490014
            connectDragPreview(node);
            connectDropTarget(node);
         }
      }), _react2.default.Children.map(children, function (child) {
         return _react2.default.cloneElement(child, {
            connectDragSource: connectDragSource
         });
      }))
   );
};
DraggableRow.propTypes = {
   _parent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]).isRequired,
   connectDragSource: _propTypes2.default.func.isRequired,
   connectDropTarget: _propTypes2.default.func.isRequired,
   onMove: _propTypes2.default.func.isRequired,
   onCanMove: _propTypes2.default.func,
   onMoveStart: _propTypes2.default.func,
   onMoveEnd: _propTypes2.default.func,
   rowId: _propTypes2.default.any.isRequired
};

var SourceTargetDraggableRow = dragSource(dropTarget(DraggableRow));

var draggableRow = function draggableRow(_parent) {
   function draggable(children) {
      return _react2.default.createElement(SourceTargetDraggableRow, _extends({
         _parent: _parent
      }, children));
   }

   // Copy possible shouldComponentUpdate over or otherwise features
   // like virtualization won't work.
   draggable.shouldComponentUpdate = _parent.shouldComponentUpdate;

   return draggable;
};

exports.default = draggableRow;