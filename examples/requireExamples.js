let ctx = require.context(__examplesDir, true, __examplesRegex)
let examples = ctx.keys().map((moduleKey, i) => {
  let pathKey = encodeURI(moduleKey.split('/').slice(-2)[0])
  return [pathKey, ctx(moduleKey).default]
})

export default examples
