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
    return this.props.columns.map(({ property, label }) => {
      return {
        property: property,
        header: {
          label: label
        },
        cell: {
          transforms: [this.editableTransform]
        }
      };
    });
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
      <div>
        <Table.Provider components={components} columns={columns}>
          <Table.Header headerRows={[columns]} />
          <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
        </Table.Provider>
        <button onClick={this.newRow.bind(this)}>New Row</button>
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

  newRow() {
    const rows = cloneDeep(this.props.rows);

    let newRow = {
      id: 1 + Math.max.apply(Math, this.props.rows.map((row) => row.id))
    };

    for (let index in this.props.columns) {
      newRow[this.props.columns[index].property] = ' - ';
    }

    rows.push(newRow);
    this.props.setRows(rows);
  }
}

const WikiTableEditor = DragDropContext(HTML5Backend)(TableEditor);

export default WikiTableEditor;
