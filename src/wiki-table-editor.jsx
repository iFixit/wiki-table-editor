import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as edit from 'react-edit';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

class TableEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);

    this.editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => {
        return columnIndex === rowData.columnIndexEditing;
      },

      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].columnIndexEditing = columnIndex;

        this.setState({ rows });
      },

      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].columnIndexEditing = null;

        this.setState({ rows });
      }
    });

    this.state = {
      columns: props.initialCols.map(({ property, label }) => {
        return {
          property: property,
          header: {
            label: label
          },
          cell: {
            transforms: [this.editable(edit.input())]
          }
        }
      }),
      rows: props.initialRows
    };
  }

  render() {
    const components = {
      body: {
        row: dnd.Row
      }
    };

    const { columns, rows } = this.state;

    return (
      <div>
        <Table.Provider components={components} columns={columns}>
          <Table.Header headerRows={[columns]} />
          <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
        </Table.Provider>
        <button onClick={this.newRow.bind(this)}>New Row</button>
        <button onClick={this.printJSON.bind(this)}>Print JSON</button>
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
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }

  newRow() {
    const rows = cloneDeep(this.state.rows);
    let newRow = {};
    rows.push(newRow);
    for (let i in this.state.rows[0]) {
      newRow[i] = Math.random();
    }
    this.setState({rows});
  }

  printJSON() {
    console.log(JSON.stringify(this.state));
  }
}

// Set up drag and drop context
const WikiTableEditor = DragDropContext(HTML5Backend)(TableEditor);

export default WikiTableEditor;
