let examplesCtx = require.context(__examplesDir, true, __examplesRegex)
let readmesCtx = require.context(__readmesDir, true, __readmesRegex)
let examples = requireAllDefaults(examplesCtx, readmesCtx, __readmesMap)

function requireAllDefaults(ctx, readmesCtx, readmesMap) {
  let readmeKeys = readmesCtx.keys()
  let getReadmeKey = i => readmesMap[i] >= 0 ? readmeKeys[readmesMap[i]] : void(0)
  return ctx.keys().map((module, i)  => {
    let readmeKey = getReadmeKey(i)
    return [ctx(module).default, readmeKey && readmesCtx(readmeKey)]
  })
}

export default examples
