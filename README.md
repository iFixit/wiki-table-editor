# wiki-table-editor

## Usage

### Build

```
npm run build
```

#### my-app.html

```html
<script src="/js/react.js"></script>
<script src="/js/react-dom.js"></script>
<script src="/js/wiki-table-editor/dist/wiki-table-editor.js"></script>
<script src="/js/my-app.js"></script>

...

<div id="root"></div>
```

#### my-app.jsx

```jsx
ReactDOM.render((<WikiTableEditor />), document.querySelector('#root'));
```

## Development

### Build

Run

```
npm run build-dev
```

and open `demo.html` in a web browser.
