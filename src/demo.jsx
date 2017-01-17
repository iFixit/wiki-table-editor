import WikiTableEditor from './wiki-table-editor.jsx'
import ReactDOM from 'react-dom'
import React from 'react'

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
  }

  setRows(rows) {
    this.setState({ rows });
  }

  render() {
    return (
      <WikiTableEditor
       rows={this.state.rows}
       columns={this.state.columns}
       setRows={this.setRows} />
    );
  }
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render((
    <SpecificWikiTableEditor />
  ), document.querySelector('#root'));
});
