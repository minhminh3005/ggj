export const state = () => ({
  productInfo: {},
})

export const mutations = {
  productInfo: function(state, productInfo) {
    state.productInfo = productInfo
  },
}

export const getters = {
  productInfo: state => {
    return state.productInfo
  },
}
