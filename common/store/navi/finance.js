import messages from '@@/../ja/lang/common/navi-categories.json'
// import messages from '@@/../ja/lang/common/categories.json'
const defaultLang = messages['ja'] || {}

function arrayLanguage() {
    const jaLanguages = []
    for (const [key, value] of Object.entries(defaultLang)) jaLanguages.push({id: +key, categoryName: value})
    return jaLanguages
}

export const state = {
    categories: arrayLanguage(),
    selectedArticle: {},
    showErrorBuyer: false,
    favData: {
        favorite: [],
        purchased: [],
        follow: [],
        following: [],
        follower: []
    }
}

export const mutations = {
    setNaviCategory: (state, categories) => {
        state.categories = categories
    },
    setSelectedArticle: (state, article) => {
        state.selectedArticle = article
    },
    setShowErrorBuyer: (state) => {
        state.showErrorBuyer = true
    },
    markArticleAsFavourite: (state) => (state.selectedArticle.isFavorite = 1 - state.selectedArticle.isFavorite),
    setFavData: function(state, favData) {
          state.favData = Object.assign({}, state.favData, favData)
    },
    setFavFollowing: function(state, following) {            
        let oldFlw = state.favData.following,
        newFlw = following

        // case new [] or new shorter then old
        if(oldFlw.length > newFlw.length) {
            for(let i = 0; i < oldFlw.length; i++) {
                const idx = newFlw.findIndex(_item => _item.id === oldFlw[i].id)
                if(idx == -1) oldFlw[i].isFollowed = 0
            }
        }

        // case normal
        for(let i = 0; i < newFlw.length; i++) {            
            let item = newFlw[i]
            // isFollowed: 0 | 1 | 2 // 0: no follow, 1: follow & noti, 2: follow without noti
            item.isFollowed = item.isNotification ? 1 : 2
            const idx = oldFlw.findIndex(_item => _item.id === item.id)
            if (idx > -1) oldFlw[idx].isFollowed = item.isFollowed // update if exist
            else oldFlw.push(item) // add if new
        }

        state.favData.following = oldFlw
    },
    updateFollowerItem: (state, data) => {
        if (!state.favData.follower) return
        let idx = state.favData.follower.findIndex(
            item => data.id == item.id
        )
        if (idx != -1) {
            state.favData.follower[idx].isFollowed = data.status
        }
    },
    addFollowingItem: (state, data) => {
        if (!data) return
        let idxFlwing = state.favData.following.findIndex(
            item => data.id == item.id
        )
        if (idxFlwing != -1) {
            state.favData.following[idxFlwing].isNotification = 1
            state.favData.following[idxFlwing].isFollowed = 1
        }else {
            state.favData.following.push({
                ...data,
                isNotification: 1,
                isFollowed: 1
            })
        }
    },
    removeFollowingItem: (state, id) => {
        if (!state.favData.following) return
        let idxFlwing = state.favData.following.findIndex(
            item => id == item.id
        )
        if (idxFlwing != -1) {
            state.favData.following[idxFlwing].isNotification = 0
            state.favData.following[idxFlwing].isFollowed = 0
        }
    },
    updateNotify: (state, data) => {
        if (!state.favData.following || !state.favData.follower) return
        let idxFlwing = state.favData.following.findIndex(
            item => data.id == item.id
        )
        let idxFlwer = state.favData.follower.findIndex(
            item => data.id == item.id
        )
        if (idxFlwing != -1) {
            state.favData.following[idxFlwing].isNotification = data.status
            state.favData.following[idxFlwing].isFollowed = data.status ? 1 : 2
        }
        if (idxFlwer != -1) {
            // isFollowed: 0 | 1 | 2 // 0: no follow, 1: follow & noti, 2: follow without noti
            state.favData.follower[idxFlwer].isFollowed = data.status ? 1 : 2
        }
    },
    addFavItem: (state, favItem) => {
        if (!state.favData.favorite) {
            return
        }
        let isFavExist = state.favData.favorite.findIndex(
            item => favItem.id == item.id
        )
        if (isFavExist != -1) {
            state.favData.favorite[isFavExist] = favItem
        } else {
            state.favData.favorite.push(favItem)
        }
    },
    removeFavItem: (state, favItem) => {
        if (!state.favData.favorite) {
            return
        }
        let favorite = state.favData.favorite.filter(item => item.id != favItem.id)
        state.favData.favorite = favorite
    },
    addFollowItem: (state, followItem) => {
        if (!state.favData.follow) {
            return
        }
        let isFollowExist = state.favData.follow.findIndex(
            item => followItem.id == item.id
        )
        if (isFollowExist != -1) {
            state.favData.follow[isFollowExist] = followItem
        } else {
            state.favData.follow.push(followItem)
        }
    },
    removeFollowItem: (state, followItem) => {
        if (!state.favData.follow) {
            return
        }
        let follow = state.favData.follow.filter(item => item.id != followItem.id)
        state.favData.follow = follow
    },
}

export const getters = {
    getFavData: state => {
        return state.favData
    },
    naviCategories: state => {
        return state.categories
    },
    selectedArticle: state => state.selectedArticle,
    showErrorBuyer: state => state.showErrorBuyer,
    naviCategoryToObject: state => {
        return state.categories.reduce((ob, val) => {
            ob[val.id] = val
            return ob
        }, {})
    }
}
