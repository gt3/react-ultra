let ctx = require.context(__examplesDir, true, __examplesRegex)
let examples = ctx.keys().map((moduleKey, i) => {
  let mountDir = encodeURI(moduleKey.split('/').slice(-2)[0])
  return {mountDir, app: ctx(moduleKey).default}
})

export default examples
