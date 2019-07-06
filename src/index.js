const codeMirror = require('codemirror')
const fullscreen = require('codemirror/addon/display/fullscreen')
const debounce = require('lodash.debounce')
const d3 = require('d3')
const d3Sankey = require('d3-sankey')
const dotSankey = require('dot-sankey')

const dot =  'digraph {\n  a -> b [value=100]\n}'
const config = {
  value: dot,
  theme: 'monokai',
  fullScreen: true,
}
const mirror = codeMirror(document.getElementById('mirror'), config)

function render (dot) {
  const svgElem = document.getElementById('sankey')
  Array.from(svgElem.children).forEach(c => c.remove())
  const svg = d3.select(svgElem)
  const data = dotSankey.dotToData(dot)
  console.log(data)
  const sankey = d3Sankey.sankey()
        .nodeAlign(d3Sankey.sankeyLeft)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [svgElem.clientWidth - 1, svgElem.clientHeight - 5]])

  const {nodes, links} = sankey(data)
  console.log(nodes)
  console.log(links)

  const DOM = {
    count: 0,
    uid: function (name) {
      return "O-" + (name == null ? "" : name + "-") + ++this.count
    }
  }

  svg.append('g')
    .attr('stroke', '#000')
    .selectAll('rect')
    .data(nodes)
    .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => '#fff')

  const link = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
    .selectAll('g')
    .data(links)
    .join('g')
      .style('mix-blend-mode', 'multiply')

  const gradient = link.append('linearGradient')
      .attr('id', d => (d.uid = DOM.uid('link')))
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => d.source.x1)
      .attr('x2', d => d.target.x0)

  gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => 'magenta')

  gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => 'cyan')

  link.append('path')
    .attr('d', d3Sankey.sankeyLinkHorizontal())
    .attr('stroke', d => `url(#${d.uid})`)
    .attr('stroke-width', d => d.width)
}

mirror.on('change', debounce(function (instance) {
  render(instance.getValue())
}, 500))

render(dot)

