import WikiTableEditor from './wiki-table-editor.jsx'
import ReactDOM from 'react-dom'
import React from 'react'

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

const cols = [{
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

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render((
    <WikiTableEditor initialCols={cols} initialRows={rows} />
  ), document.querySelector('#root'));
});
