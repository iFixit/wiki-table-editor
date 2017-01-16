import WikiTableEditor from './wiki-table-editor.jsx'
import ReactDOM from 'react-dom'
import React from 'react'

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render((<WikiTableEditor />), document.querySelector('#root'));
});
