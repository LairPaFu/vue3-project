type state = {
  userInfo: {}
}

export default {
  namespaced: true,
  state() {
    return {
      userInfo: {}
    }
  },
  mutations: {
    updateUserInfo(state: state, data: {}) {
      state.userInfo = data
    }
  },
  // actions,
}