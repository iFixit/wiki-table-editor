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
 */
class TableEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);

    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => {
        return columnIndex === rowData.columnIndexEditing;
      },

      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.props.rows, { id: rowData.id });
        const rows = cloneDeep(this.props.rows);

        rows[index].columnIndexEditing = columnIndex;

        this.props.setRows(rows);
      },

      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.props.rows, { id: rowData.id });
        const rows = cloneDeep(this.props.rows);

        rows[index][property] = value;
        rows[index].columnIndexEditing = null;

        this.props.setRows(rows);
      }
    });

    this.editableTransform = editable(edit.input());
  }

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
            (value, { rowData }) => (
              <div className="cell-content">{ rowData[property] }</div>
            )
          ]
        }
      };
    }), {
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
            <button onClick={this.deleteRow.bind(this, rowData.id)}
             className="delete-button">
              &times;
            </button>
          )
        ]
      }
    }];
  }

  render() {
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
        <button onClick={this.newRow.bind(this)}
         className="new-button">
          +
        </button>
      </div>
    );
  }

  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow
    };
  }

  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.props.rows);

    if (rows) {
      this.props.setRows(rows);
    }
  }

  deleteRow(rowId) {
    const rows = this.props.rows.filter((rowData) => {
      return rowData.id !== rowId;
    });

    this.props.setRows(rows);
  }

  getNextId() {
    return 1 +
     Math.max.apply(Math, [1, ...this.props.rows.map((row) => row.id)]);
  }

  newRow() {
    const rows = cloneDeep(this.props.rows);

    let newRow = {
      id: this.getNextId()
    };

    this.props.columns.forEach((column) => {
      if (!column.property) {
        return;
      };

      newRow[column.property] = '';
    });

    rows.push(newRow);
    this.props.setRows(rows);
  }
}

const WikiTableEditor = DragDropContext(HTML5Backend)(TableEditor);

export default WikiTableEditor;
