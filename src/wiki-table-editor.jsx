import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
    this.onCellChange = this.onCellChange.bind(this);
    this.onNewCellChange = this.onNewCellChange.bind(this);
    this.deleteButtonFormatter = this.deleteButtonFormatter.bind(this);
    this.addNewButtonFormatter = this.addNewButtonFormatter.bind(this);

    // The "newRow" is the row at the bottom of the table. It gets added to the
    // table when the user clicks "Add Row."
    this.state = {
       newRow: {id: 1}
    };
    this.props.columns.forEach((column) => {
       this.state.newRow[column.property] = '';
    });
  }

  render() {
    // Use Row components that can be dragged-and-dropped.
    const components = {
      body: {
        row: dnd.Row
      }
    };

    const rows = this.props.rows;
    const columns = this.getColumns(this.onCellChange,
     this.deleteButtonFormatter, this.props.getDragHandle);

    const newRows = [this.state.newRow];
    const newColumns = this.getColumns(this.onNewCellChange,
     this.addNewButtonFormatter, () => null);

    return (
      <div className="wiki-table-editor">
        <Table.Provider components={components} columns={columns}>
          <Table.Header headerRows={[columns]} />
          <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
        </Table.Provider>
        <Table.Provider columns={newColumns}>
          <Table.Body rows={newRows} rowKey="id" />
        </Table.Provider>
      </div>
    );
  }

  /**
   * Transform our `columns` prop into column definitions for reactabular.
   */
  getColumns(onCellChange, actionButtonFormatter, dragHandleFormatter) {
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
          className: 'drag-handle-cell'
        }
      }
    },
    // props-specified columns
    ...this.props.columns.map(({ property, label }) => {
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
            (value, { rowData }) => (
              <div className="cell-content">
                <input type="text"
                 value={rowData[property]}
                 placeholder={label}
                 onChange={onCellChange.bind(this, rowData.id, property)} />
              </div>
            )
          ],
          props: {
            className: property + '-cell'
          }
        }
      };
    }),
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
    }];
  }

  /**
   * Given a row, returns a delete button for that row.
   */
  deleteButtonFormatter(value, { rowData }) {
    return this.props.getDeleteButton(this.deleteRow.bind(this, rowData.id));
  }

  /**
   * Returns an "Add new row" button.
   */
  addNewButtonFormatter(value, { rowData }) {
    let newRowEmpty = !this.props.columns.some((column) => {
      return rowData[column.property];
    })

    return this.props.getAddButton(this.addRow.bind(this, rowData),
     newRowEmpty);
  }

  /**
   * Called to set the props when rendering each row.
   */
  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow,
      // Don't allow drag-and-drop if a cell is being edited.
      onCanMove: () => !this.props.rows.some(
       (rowData) => rowData.columnIndexEditing !== undefined &&
                    rowData.columnIndexEditing !== null)
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
  addRow(rowData) {
    const rows = cloneDeep(this.props.rows);

    rows.push({
      ...rowData,
      id: this.getNextId()
    });

    this.props.setRows(rows);

    // Clear the "add new row" row.
    let newRow = {id: 1};
    this.props.columns.forEach((column) => {
       newRow[column.property] = '';
    });
    this.setState({ newRow });
  }

  /**
   * Change the value of one property on one row.
   */
  onCellChange(rowId, property, event) {
     const index = findIndex(this.props.rows, { id: rowId });
     const rows = cloneDeep(this.props.rows);

     rows[index][property] = event.target.value;

     this.props.setRows(rows);
  }

  /**
   * Change the value of a cell in the "add new row" bar.
   */
  onNewCellChange(rowId, property, event) {
    this.setState({
      newRow: {
        ...this.state.newRow,
        [property]: event.target.value
      }
    });
  }
}

const WikiTableEditor = DragDropContext(HTML5Backend)(TableEditor);

module.exports = WikiTableEditor;
