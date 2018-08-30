import wrapActions from '@/store/_wrap-actions'

const isoActions = {
  state: {
  },

  mutations: {
    
  },
  actions: wrapActions(this, {
    async ACTION_LIST_ISO (context, obj) {
      let uploadActionResponse = await isoServices.listIso(obj)
      // context.commit('MUTATION_LIST_ISO', uploadActionResponse)
      return uploadActionResponse
    }
  }),
  getters: {
    // getIsoList: state => state.listIso,
  }
}

export default isoActions
