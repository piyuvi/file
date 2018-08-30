import { eventBus } from '@/main.js'

export default function wrapActions (scope, originalActions) {
  let modifiedActions = {}
  // console.log('ORIG ATIONS', originalActions)
  for (let actionName in originalActions) {
    // console.log('ACTION NAME', actionName)
    modifiedActions[actionName] = async function () {
      setImmediate(() => {
        eventBus.$emit('changeLoader', true, actionName)
      })
      let actionResponse = await originalActions[actionName].apply(scope, arguments)
      // console.log('ACTION RESP', actionResponse)
      setImmediate(() => {
        eventBus.$emit('changeLoader', false, actionName)
      })
      return actionResponse
    }
  }
  // console.log('MODIFIED ACTIONS', modifiedActions)
  return modifiedActions
}
