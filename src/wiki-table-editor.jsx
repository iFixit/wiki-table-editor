// Created from example code https://reactabular.js.org/

import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import ReactDOM from 'react-dom';
import * as edit from 'react-edit';

const rows = [{
  id: 1,
  first: 'John',
  last: 'Johnson',
  company: 'John Inc.',
  sentence: 'consequatur nihil minima corporis omnis nihil rem'
}, {
  id: 2,
  first: 'Mike',
  last: 'Mikeson',
  company: 'Mike Inc.',
  sentence: 'a sequi doloremque sed id quo voluptatem voluptatem ut voluptatibus'
}, {
  id: 3,
  first: 'Jake',
  last: 'Jackson',
  company: 'Jake Inc.',
  sentence: 'sed id quo voluptatem voluptatem ut voluptatibus'
}, {
  id: 4,
  first: 'Don',
  last: 'Donson',
  company: 'Don Inc.',
  sentence: 'voluptatem voluptatem ut voluptatibus'
}];

class DragAndDropTable extends React.Component {
  constructor(props) {
    super(props);

    this.editable = edit.edit({
      // Determine whether the current cell is being edited or not.
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,

      // The user requested activation, mark the current cell as edited.
      // IMPORTANT! If you stash the rows at this.state.rows, DON'T
      // mutate it as that will break Table.Body optimization check.
      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].editing = columnIndex;

        this.setState({ rows });
      },

      // Capture the value when the user has finished and update
      // application state.
      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].editing = false;

        // Optional: capture the fact that a field was edited for visualization
        rows[index].edited = true;

        this.setState({ rows });
      }
    });

    this.state = {
      columns: [
      {
        property: 'first',
        props: {
          style: {
            width: 50
          }
        },
        header: {
          label: 'First Name',
          props: {
            label: 'First Name',
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
      },
      {
        property: 'last',
        props: {
          style: {
            width: 50
          }
        },
        header: {
          label: 'Last Name',
          props: {
            label: 'Last Name',
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
      },
      {
        property: 'company',
        props: {
          label: 'Company',
          style: {
            width: 100
          }
        },
        header: {
          label: 'Company',
          props: {
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
      },
      {
        property: 'sentence',
        props: {
          style: {
            width: 300
          }
        },
        header: {
          label: 'Sentence',
          props: {
            label: 'Sentence',
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
      }
      ],
      rows
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
    this.onMoveColumn = this.onMoveColumn.bind(this);
    this.onMoveChildColumn = this.onMoveChildColumn.bind(this);
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
    const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(rows);

    return (
      <div>
      <Table.Provider
      components={components}
      columns={resolvedColumns}
      >
      <Table.Header
      headerRows={resolve.headerRows({ columns })}
      />

      <Table.Body
      rows={resolvedRows}
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
      // Retain widths to avoid flashing while drag and dropping.
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
      };

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
const WikiTableEditor = DragDropContext(HTML5Backend)(DragAndDropTable);

export default WikiTableEditor;
