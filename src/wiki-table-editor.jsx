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
    this.onMoveColumn = this.onMoveColumn.bind(this);
    this.onMoveChildColumn = this.onMoveChildColumn.bind(this);

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
            label: label,
            props: {
              label: label,
              onMove: o => this.onMoveColumn(o)
            }
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
      header: {
        cell: dnd.Header
      },
      body: {
        row: dnd.Row
      }
    };
    const { columns, rows } = this.state;

    return (
      <div>
      <Table.Provider
      components={components}
      columns={columns}
      >
      <Table.Header
      headerRows={[columns]}
      />

      <Table.Body
      rows={rows}
      rowKey="id"
      onRow={this.onRow}
      />
      </Table.Provider>
      <button onClick={this.newRow.bind(this)}>New Row</button>
      <button onClick={this.newCol.bind(this)}>New Col</button>
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
  onMoveColumn(labels) {
    const movedColumns = dnd.moveLabels(this.state.columns, labels);

    if (movedColumns) {
      /*// Retain widths to avoid flashing while drag and dropping.
      const source = movedColumns.source;
      const target = movedColumns.target;
      const sourceWidth = source.props.style && source.props.style.width;
      const targetWidth = target.props.style && target.props.style.width;

      source.props.style = {
        ...source.props.style,
        width: targetWidth
      };
      target.props.style = {
        ...target.props.style,
        width: sourceWidth
      };*/

      this.setState({
        columns: movedColumns.columns
      });
    }
  }
  onMoveChildColumn(labels) {
    const movedChildren = dnd.moveChildrenLabels(this.state.columns, labels);

    if (movedChildren) {
      const columns = cloneDeep(this.state.columns);

      columns[movedChildren.target].children = movedChildren.columns;

      // Here we assume children have the same width.
      this.setState({ columns });
    }
  }
  newCol() {
    const prop = Math.random() + '-col';
    const columns = cloneDeep(this.state.columns);
    columns.push({
      property: prop,
      props: {
        style: {
          width: 300
        }
      },
      header: {
        label: prop,
        props: {
          label: prop,
          onMove: o => this.onMoveColumn(o)
        }
      },
      cell: {
        transforms: [
        (value, extra) => this.editable(edit.input())(value, extra, {
          className: extra.rowData.edited && 'edited'
        })
        ]
      }
    });
    const rows = cloneDeep(this.state.rows);
    for (let i in rows) {
      rows[i][prop] = 'cell-' + Math.random();
    }
    this.setState({columns, rows});
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
