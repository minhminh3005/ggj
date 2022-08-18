<template>
  <div>
    <UserMessage :buyer="buyer" @delete-topic="onDeleteTopic" :message="content" class="message" />
    <div class="panel-group reply-content" v-if="this.commentCount || !isTsukuruProduct(this.$route.params.id)">
      <div :id="'replies-detail' + content.id" class="panel-collapse collapse fs-13">
        <div class="panel-body msg-border-bottom pr-30">
          <div v-for="item in content.replies" :key="item.id">
            <UserMessage :buyer="buyer" @delete-reply="onDeleteReply" :type="1" :message="item" />
          </div>
          <div class="mt-20 flex content-end" v-if="!isTsukuruProduct(this.$route.params.id)">
            <textarea class="text-area p-20" v-model="replyContent"></textarea>
          </div>
          <div class="text-center mt-20" v-if="!isTsukuruProduct(this.$route.params.id)">
            <button class="btn-comment" @click="onPostReply" :disabled="processing">
              <div class="flex mid center">
                <b>{{ $t('1') }}</b>
                <Loading v-if="processing" class="ml-10 sm" style="width: 20px; height: 20px;" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div v-if="panelTitle" class="bg-co-59 pl-20 pr-20 pt-15 pb-15">
        <h4 class="panel-title">
          <a data-toggle="collapse" :href="'#replies-detail' + content.id" class="no-underlying fs-12 flex mid">
            <i class="expand-icon mr-10" :is="onExpand ? 'AngleUp' : 'AngleDown'" />
            <b>{{ onExpand ? $t('3') : commentDisplay }}</b>
          </a>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-singlecommunity.json'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import UserMessage from './UserMessage.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { gotoLogin } from '@/utils/client/common'
if (process.browser) {
  require('bootstrap/js/modal.js')
  require('bootstrap/js/transition.js')
  require('bootstrap/js/collapse.js')
}
export default {
  components: {
    AngleUp,
    AngleDown,
    UserMessage,
    Loading,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    commentCount() {
      return (this.content.replies || []).length
    },
    commentDisplay() {
      if (!this.commentCount) {
        return this.$t('2')
      }
      return this.commentCount + this.$t('4')
    },
  },
  props: {
    content: {
      type: Object,
      default() {
        return {}
      },
    },
    theirMsg: {
      type: Boolean,
      default: null,
    },
    panelTitle: {
      type: Boolean,
      default: true,
    },
    buyer: [Number, String],
  },
  data() {
    return {
      onExpand: false,
      replyContent: null,
      processing: false,
    }
  },
  mounted() {
    // handle collapse event
    $('#replies-detail' + this.content.id).on('hide.bs.collapse', () => {
      this.onExpand = false
    })
    $('#replies-detail' + this.content.id).on('show.bs.collapse', () => {
      this.onExpand = true
    })
  },
  methods: {
    onDeleteTopic(id) {
      this.$emit('delete-topic', id)
    },
    onDeleteReply(id) {
      /* eslint-disable vue/no-mutating-props */
      this.content.replies = this.content.replies.filter(item => {
        return item.id !== id
      })
      /* eslint-enable vue/no-mutating-props */
      this.$emit('delete-reply')
    },
    fileChanged(_file) {
      this.$emit('input', _file)
    },
    onPostReply() {
      if (!this.replyContent) {
        return
      }
      if (!this.$store.state.user.id) {
        gotoLogin()
      } else {
        this.processing = true
        this.GoGoHTTP.post('/api/v3/surface/communities', {
          productId: this.$route.params.id,
          content: this.replyContent,
          isTopic: 0,
          topicId: this.content.id,
        })
          .then(data => {
            if (data.id) {
              if (!this.content.replies) {
                this.$set(this.content, 'replies', [])
              }
              /* eslint-disable vue/no-mutating-props */
              this.content.replies.push({
                content: this.replyContent,
                id: data.id,
                publishedDate: moment()
                  .utc()
                  .unix(),
                topicId: this.content.id,
                userId: this.$store.state.user.id,
                userName: this.$store.state.user.name,
              })
              /* eslint-enable vue/no-mutating-props */
              this.replyContent = '' // reset reply content
              this.$emit('posted')
            } else {
              this.$emit('show-warning-modal')
            }
          })
          .finally(() => {
            this.processing = false
          })
      }
    },
    /* eslint-disable */
    isTsukuruProduct(productId) {
      // https://gogojungle.backlog.jp/view/OAM-55697
      return false
      // return [5735, 7560, 5939, 5941, 7561].includes(parseInt(productId))
    },
    /* eslint-enable */
    // onSubmitLike(cId, type) {
    //   this.GoGoHTTP.post('/api/surface/tools/' + cId + '/good', {
    //     type: type,
    //   }).then(data => {
    //     if (data) {
    //       let el,
    //         el2,
    //         oldNum = 0,
    //         oldNum2 = 0
    //       if (type === 1) {
    //         el = $('#like-' + cId)
    //         el2 = $('#dislike-' + cId)
    //       } else {
    //         el = $('#dislike-' + cId)
    //         el2 = $('#like-' + cId)
    //       }
    //       oldNum = parseInt(el.text())
    //       oldNum2 = parseInt(el2.text())
    //       if (!data.type) {
    //         el.text(oldNum - 1)
    //       } else {
    //         el.text(oldNum + 1)
    //         if (data.id) {
    //           el2.text(oldNum2 - 1)
    //         }
    //       }
    //     }
    //   })
    // },
  },
}
</script>

<style lang="scss" scoped>
.message {
  border: 1px solid #aab2bd;
}
.msg-border-bottom {
  border-bottom: 1px solid #aab2bd;
}
.btn-comment {
  width: 300px;
  height: 40px;
  line-height: 41px;
  background: #f6bb42;
  font-size: 18px;
  color: white;
  border-radius: 4px;
  border: none;
  outline: none;
  &:hover {
    opacity: 0.9;
  }
}
.reply-button {
  color: #9c3;
}
.h-18 {
  height: 18px;
}
.bg-co-59 {
  background: #e6e9ed;
}
.expand-icon {
  width: 18px;
  height: 18px;
  background: #707070;
  color: #e6e9ed;
  border-radius: 50%;
  margin-bottom: 1px;
  /deep/ svg {
    width: 80%;
    margin: 1px auto;
  }
  ~ b {
    font-size: 18px;
    color: #707070;
  }
}
.reply-content {
  border-left: 1px solid #aab2bd;
  border-bottom: 1px solid #aab2bd;
  border-right: 1px solid #aab2bd;
  background: #e6e9ed;
}
.text-area {
  width: calc(100% - 130px);
  height: 300px;
  border: 1px solid #707070;
  resize: none;
  outline: none;
}
</style>

<docs>
  ```vue
  <template>
    <SingleCommunity :content="content"/>
  </template>
  <script>
  export default {
    data() {
      return {
        content: {
          "id": 62443,
          "content": "abc",
          "publishedDate": 1533608042,
          "userId": 140003,
          "userName": "テストマン",
          "isTopic": true
        }
      }
    },
  }
  </script>
  ```
</docs>
