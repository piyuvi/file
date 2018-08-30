import HTTP from './http-request-handler'

const url = {
  longurl: function (obj) {
    return HTTP.get('op_listIsos', {params: obj})
      .then(response => {
        if (response.data.success === true) {
          return response.data.result
        }
      }).catch(e => {
        return e
      })
  }
}

export default url