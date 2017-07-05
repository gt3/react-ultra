import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { a, spec, check, match, prefixMatch, container, appendPath, parseQS } from 'ultra'

function pipe(...fns) {
  function invoke(v) {
    return fns.reduce((acc, fn) => (fn ? fn.call(this, acc) : acc), v)
  }
  return invoke
}

let _ultra, A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra: () => _ultra }

let createMatch = select  => {
  let transform = ({values: [year, make, vid], prefix, pValues}) => Object.assign({year, make, vid}, prefix && {curr: pValues[0].split(',')})
	let specSelect = spec('/', '/:year', '/:year/:make', '/:year/:make/:vid')(pipe(transform, select))
  let currCheck = check(':curr')(/^$|^\$(,€)?$|^€(,\$)?$/)
  let addCurrency = ({qs, path}) => appendPath(parseQS(qs, ['curr']), path)
	return [prefixMatch(':curr', match(specSelect, currCheck), addCurrency), match(specSelect)]
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.matchers = createMatch(this.setState.bind(this))
  }
  componentDidMount() {
	  _ultra = container(this.matchers)
  }
  componentWillUnmount() {
    _ultra.stop()
  }
  render() {
    let values = this.state
    return (
      <div>
        <aside>{Nav(values)}</aside>,
        <div>
          <SelectCurrency {...values} />
          <SelectVehicle {...values} />
          {values.vid && <Price {...values} />}
        </div>
      </div>
    )
  }
}

let SelectCurrency = ({curr}) => {
  let encoded = [encodeURIComponent('$'), encodeURIComponent('€')]
  let hrefUSD = `${location.pathname}?curr=${encoded[0]}`
  let hrefEUR = `${location.pathname}?curr=${encoded[1]}`
  let href999 = `${location.pathname}?curr=999`
  let hrefBoth = `${location.pathname}?curr=${encoded[0]}&curr=${encoded[1]}`
  let style = key => curr && curr.includes(key) ? {border: 'solid'} : null
  return (
    <ul key='currency'>
      <li><A href={hrefUSD} retain='' style={style('$')}>usd</A></li>
      <li><A href={hrefEUR} retain='' style={style('€')}>eur</A></li>
      <li><A href={href999} retain='' style={style('999')}>999</A></li>
      <li><A href={hrefBoth} retain=''>both</A></li>
    </ul>
  )
}

let Price = ({vid, curr}) => {
  let [i, j = i] = (curr || ['$']).map(c => ['$','€'].indexOf(c))
  let price = _priceData[vid].slice(i, j+1)
  return (
    <ul key='price'>
      <li><em>{price.toString()}</em></li>
    </ul>
  )
}

let Items = ({data, selected, hrefPrefix=''}) => {
  let style = key => selected === key ? {border: 'solid'} : null
  return Object.keys(data).map( val => 
    <li key={val}>
      <A href={`${hrefPrefix}/${val}`} style={style(val)} retain='qs'>
        { typeof data[val] === 'string' ? data[val] : val }
      </A>
    </li>
  )
}

let Nav = ({ vid }) => {
  let models = Object.keys(_data).map(year =>
    Object.keys(_data[year]).map(make =>
      Items({ data: _data[year][make], selected: vid, hrefPrefix: `/${year}/${make}` })
    )
  )
  return <ul key="nav">{models}</ul>
}

let SelectVehicle = ({year, make, vid}) => {
  return (
    <ul key='vehicle'>
      {Items({data: _data, selected: year})}
      {year ? <ul key='make'><MakeModel year={year} make={make} vid={vid} /></ul> : null}
    </ul>
  )
}

let MakeModel = ({year, make, vid}) => {
  let makes = _data[year]
  return (
    <ul key='make'>
    {Items({data: makes, selected: make, hrefPrefix: `/${year}`})}
    {make ? <Model year={year} make={make} vid={vid} /> : null}
    </ul>
  )
}

let Model = ({year, make, vid}) => {
  let models = _data[year][make]
  return (
    <ul key='model'>
    {Items({data: models, selected: vid, hrefPrefix: `/${year}/${make}`})}
    </ul>
  )
}

export default (node) => render(<App />, node)

let _data = {
  2017: {
    porsche: {
      '607': '911 Turbo S 607',
      '3rs': 'GT3 RS'
    },
    bmw: {
      'bm5': 'M5'
    }
  },
  2018: {
    audi: {
      'aa8': 'A8',
      'sq5': 'SQ5'
    },
    'land rover': {
      'rrv': 'RR Velar'
    }
  }
}

let _priceData = {
  '607': ['$109,000', '€109,009'],
  '3rs': ['$200,000', '€200,009'],
  'bm5': ['$77,000', '€77,009'],
  'aa8': ['$85,000', '€85,009'],
  'sq5': ['$80,000', '€80,009'],
  'rrv': ['$70,000', '€70,009']
}
