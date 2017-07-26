## `npm i react-ultra`

Ancillary components to use [Ultra](https://github.com/gt3/ultra-router) in your React app.

Includes 3 components (*tiny = `900b`*):

1. `<Ultra />`
  - Creates Ultra container and provides it to children via context.
2. `<Use />`
  - Dynamically adds and removes route configuration (matchers) as the component mounts and unmounts.
3. `<A />`
  - Creates an anchor link to trigger pushstate routing.

## Usage

Quick example to demonstrate app structure with `react-ultra` components.

```
// app.js
import { Ultra, A } from 'react-ultra'
import News from './news'

let Nav, App, renderApp, rootMatch

Nav = () => 
  <div>
    <A href='/news'>news home</A>
    <A href='/news/sports'>sports</A>
    <A href='/news/politics'>politics</A>
  </div>

App = ({path}) => 
  <Ultra matchers={rootMatch} dispatch={false}>
    <Nav />
    {path && path.indexOf('/news') === 0 && <News />}
  </Ultra>

renderApp = route => React.render(<App {...route} />, document.getElementById('root'))

rootMatch = match([ spec('/news')(renderApp), spec('/')(renderApp) ])

renderApp()
```
`app.js` is our entry point where we render the `<App />` component with `<Nav />` links on the page. We use `<Ultra />` to initialize the router container with root level matches. We use `<A />` to create anchor links to navigate to the news section.

Note that `<News />` component mounts only when a news link is clicked.

```
// news.js
import { Use } from 'react-ultra'

let next, newsMatch, News

next = route => console.log('news section: ', route.path)

newsMatch = match([ spec('/news/sports')(next), spec('/news/politics')(next) ])

News = () => 
  <div>
    <h1>News Home</h1>
    <Use matchers={newsMatcher} dispatch={true} />
  </div>

export default News
```

The `<News />` component *prepends* its matchers to the router by rendering `<Use />`. It adds the news section matchers on mount and removes on unmount.

There are more full-proof examples that you can run locally. Check out the examples directory.

### License

MIT