const codeMirror = require('codemirror')
const debounce = require('lodash.debounce')

const config = {
  value: 'digraph {\n  a -> b [value=100]\n}',
  theme: 'monokai'
}
const mirror = codeMirror(document.body, config)

mirror.on('change', debounce(function (e) {
  console.log(e) // TODO render the sankey diagram in this callback
}, 500))
