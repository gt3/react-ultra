## `npm i react-ultra`

Provides ancillary components to use [Ultra](https://github.com/gt3/ultra-router) in React apps.

1. `<Ultra />` - creates Ultra container and provides it to children via context.
2. `<Use />` - dynamically adds and removes route configuration (matchers) as the component mounts and unmounts.
3. `<A />` - creates an anchor link element to trigger pushstate.

| download | dependencies |
| :----: | ---- |
| `0.9 kb` | ultra, react, prop-types |

## Usage

Quick example to demonstrate code splitting (webpack dynamic import) with `react-ultra` components.

```
// app.js
import { Ultra, A } from 'react-ultra'
import { spec, match } from 'ultra'

let dynamicImport = () => import(/* webpackChunkName: "news" */ './news')

let News, Nav, App, renderApp, rootMatch

Nav = () =>
  <div>
    <A href="/news">news home</A>
    <A href="/news/sports">sports</A>
    <A href="/news/politics">politics</A>
  </div>

App = ({ path } = {}) => {
  let showNews = path && path.indexOf('/news') === 0
  if (showNews && !News) {
    dynamicImport().then(component => {
      News = component
      renderApp({ path })
    })
  }
  return (
    <Ultra matchers={rootMatch} dispatch={false}>
      <Nav />
      {showNews && News ? <News /> : null}
    </Ultra>
  )
}

renderApp = route => React.render(<App {...route} />, document.getElementById('root'))

rootMatch = match([spec('/news')(renderApp), spec('/')(renderApp)])

renderApp()

```
`app.js` is our entry point where we render the `<App />` component with `<Nav />` links on the page. We use `<Ultra />` to initialize the router container with root level matches. We use `<A />` to create anchor links to navigate to the news section.

News module is loaded dynamically using webpack import on `/news` path hit. The `<News />` component mounts once the module is loaded.

```
// news.js
import { Use } from 'react-ultra'
import { spec, match } from 'ultra'

let next, newsMatch, News

next = route => console.log('news section: ', route.path)

newsMatch = match([spec('/news/sports')(next), spec('/news/politics')(next)])

News = () =>
  <div>
    <h1>News Home</h1>
    <Use matchers={newsMatcher} dispatch={true} />
  </div>

export default News
```

The `<News />` component *prepends* its matchers to the router by rendering `<Use />`. It adds the news section matchers on mount and removes on unmount.

For more full-proof examples, check out the examples directory.

### License

MIT