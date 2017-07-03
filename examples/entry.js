import {render} from 'react-dom'
import examples from './requireExamples'

let createAppElement = (d, readme) => {
  let appDiv = d.createElement('div'), rDiv = d.createElement('div')
  rDiv.innerHTML = readme ? readme : ''
  d.body.appendChild(rDiv)
  let seperator = d.body.appendChild(d.createElement('hr'))
  return d.body.insertBefore(appDiv, seperator)
}

examples.forEach(([app, readme]) => {
  let elem = createAppElement(document, readme)
  app(elem)
})

require('./sakura.css')