import WikiTableEditor from './wiki-table-editor.jsx'
import ReactDOM from 'react-dom'
import React from 'react'

/**
 * Demo file for testing the WikiTableEditor component.
 */

const rows = [{
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

const columns = [{
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

class SpecificWikiTableEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows,
      columns
    };

    this.setRows = this.setRows.bind(this);
    this.printJSON = this.printJSON.bind(this);
  }

  setRows(rows) {
    this.setState({ rows });
  }

  printJSON() {
    console.log(this.state.rows);
  }

  render() {
    return (
      <div>
        <WikiTableEditor
         rows={this.state.rows}
         columns={this.state.columns}
         setRows={this.setRows}
         getDeleteButton={(onClick) => <button onClick={onClick}>Delete</button>}
         getAddButton={(onClick) => <button onClick={onClick}>Add</button>}
         getDragHandle={() => <p>Drag</p>}/>
        <button onClick={this.printJSON}>Print JSON</button>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render((
    <SpecificWikiTableEditor />
  ), document.querySelector('#root'));
});
