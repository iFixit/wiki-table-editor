import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as edit from 'react-edit';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

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
class TableEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.setRow = this.setRow.bind(this);

    // Specify our custom editing behavior.
    this.editableTransform = this.getEditableTransform(this.setRow);
  }

  render() {
    // Use Row components that can be dragged-and-dropped.
    const components = {
      body: {
        row: dnd.Row
      }
    };

    const rows = this.props.rows;
    const columns = this.getColumns();

    return (
      <div className="wiki-table-editor">
        <Table.Provider components={components} columns={columns}>
          <Table.Header headerRows={[columns]} />
          <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
        </Table.Provider>
        <button type="button"
         onClick={this.addRow} className="add-row-button">+</button>
      </div>
    );
  }

  /**
   * Transform our `columns` prop into column definitions for reactabular.
   */
  getColumns() {
    return [...this.props.columns.map(({ property, label }) => {
      return {
        property: property,
        header: {
          label: label
        },
        cell: {
          transforms: [this.editableTransform],
          formatters: [
            // Wrap <td> contents in a <div>. This makes it easier to style
            // the table cells.
            (value, { rowData }) => (
              <div className="cell-content">{ rowData[property] }</div>
            )
          ]
        }
      };
    }),
    // Include one more column for the delete button.
    {
      header: {
        props: {
          style: {
            width: 60
          }
        }
      },
      cell: {
        formatters: [
          (value, { rowData }) => (
            <button type="button"
             onClick={this.deleteRow.bind(this, rowData.id)}
             className="delete-button">
              &times;
            </button>
          )
        ]
      }
    }];
  }

  /**
   * Returns a transform that can be used in a column's cell's 'transforms'
   * property. This transform allows editing the contents of the cell.
   *
   * `setRow(rowId, {property: value})` is a function that will change
   * properties of one row.
   */
  getEditableTransform(setRow) {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => {
        return columnIndex === rowData.columnIndexEditing;
      },

      onActivate: ({ columnIndex, rowData }) => {
        setRow(rowData.id, { columnIndexEditing: columnIndex });
      },

      onValue: ({ value, rowData, property }) => {
        setRow(rowData.id, {
          [property]: value,
          columnIndexEditing: undefined
        });
      }
    });

    return editable(edit.input());
  }

  /**
   * Called to get info and callbacks for each row.
   */
  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow,
      // Don't allow drag-and-drop if a cell is being edited.
      onCanMove: () => !this.props.rows.some(
       (rowData) => rowData.columnIndexEditing !== undefined)
    };
  }

  /**
   * Moves a row to its new position when the user finishes dragging it.
   */
  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.props.rows);

    if (rows) {
      this.props.setRows(rows);
    }
  }

  /**
   * Deletes the row that has id `rowId`.
   */
  deleteRow(rowId) {
    const rows = this.props.rows.filter((rowData) => {
      return rowData.id !== rowId;
    });

    this.props.setRows(rows);
  }

  /**
   * Returns a unique id for new rows. This is used for the row's key.
   */
  getNextId() {
    // Return 1 plus the largest id currently in use.
    return 1 +
     Math.max.apply(Math, [
       1, // include 1 as a default in case `rows` is an empty array.
       ...this.props.rows.map((row) => row.id)
     ]);
  }

  /**
   * Creates a new row at the bottom of the table.
   */
  addRow() {
    const rows = cloneDeep(this.props.rows);

    let newRow = {
      id: this.getNextId()
    };

    // Fill in each required property with an empty string.
    this.props.columns.forEach((column) => {
      if (!column.property) {
        // Not all columns represent a per-row property. For example, the
        // "delete button" column.
        return;
      };

      newRow[column.property] = '';
    });

    rows.push(newRow);
    this.props.setRows(rows);
  }

  /**
   * Change the value of properties on one row.
   */
  setRow(rowId, properties) {
     const index = findIndex(this.props.rows, { id: rowId });
     const rows = cloneDeep(this.props.rows);

     for (var property in properties) {
       rows[index][property] = properties[property];
     }

     this.props.setRows(rows);
  }
}

const WikiTableEditor = DragDropContext(HTML5Backend)(TableEditor);

module.exports = WikiTableEditor;
