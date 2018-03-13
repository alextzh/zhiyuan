/* eslint-disable */
import * as types from './mutation-types'

const mutations = {
  [types.SET_VIEW_URL](state, url) {
    state.viewUrl = url
  }
}

export default mutations