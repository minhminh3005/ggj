<template>
  <div class="flex space-between w-1000" style="align-items: flex-start;">
    <div style="width: 680px;" class="bg-white p-35 left">
      <h4 v-if="title" class="mb-25" style="font-weight: bold;">{{ title }}</h4>
      <template v-if="list.data && list.data.length">
        <ListItem v-for="(item, index) in list.data"
                  class="mb-20"
                  :item="item"
                  :key="item.productId + 'ls121s'"
                  :rank="(list.currentPage - 1)*20 + index + 1"
        />
        <Paging class="text-center mt-20"
                :cur-page="list.currentPage"
                :total="list.lastPage"
                :from="list.pagingFrom"
                :to="list.pagingTo"
                theme-class="theme4"
                @pagingclick="handlePagingClick"
        />
      </template>
    </div>
    <div style="width: 300px;" class="right">
      <template v-for="(obj, index) in rightData">
        <div v-if="(obj.list || {}).length" :key="index" class="mb-20 p-20 bg-white" style="border-radius: 5px;">
          <h4><strong v-html="obj.title"></strong></h4>
          <ReviewHorizontal01 :item="item" v-for="item in obj.list" :key="item.productId + index + 'it'" />
          <ShowMore01 :target="obj.url" />
        </div>
      </template>
      <SocialLinks class="mt-20" />
    </div>
  </div>
</template>

<script>
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ShowMore01 from '@/components/common/ShowMore01.vue'
import ListItem from '@/components/review/list/ListItem.vue'
import Paging from '@@/../components/paging/Paging.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'

export default {
  components: {
    ListItem,
    ReviewHorizontal01,
    Paging,
    ShowMore01,
    SocialLinks,
  },
  props: {
    list: {
      type: Object,
      default() {
        return {}
      },
    },
    rightData: {
      type: Array,
      default() {
        return []
      },
    },
    title: {
      type: String,
      default() {
        return ''
      },
    },
  },
  methods: {
    handlePagingClick(p) {
      this.$emit('pagingClick', p)
    }
  },
}
</script>
<style lang='scss' scoped>
.left {
  /deep/ .item {
    width: 610px;
    padding: 20px 10px 20px 15px;
    .item-info-ctn {
      width: 495px;
    }
    .item .item-img-ctn .rank {
      top: -8px;
      left: -5px;
    }
  }
}
/deep/.btn-loadmore:hover {
  opacity: 0.7;
}
.right {
  .rv-hori-item /deep/ {
    width: 260px;
    .item-content {
      width: 180px;
    }
    .item-content-name {
      font-weight: 700;
    }
    .gg-rating {
      margin-top: 12px;
      font-size: 12px;
    }
  }
}
/deep/ .btn-loadmore {
  border-top: 1px solid #ececec;
  padding-top: 15px;
}
</style>
<docs>
  ```vue
  <template>
    <ListB :list="list"
           :right-data="rightData"
           @pagingClick="pagingClick"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        list: {
          "total": 135,
          "currentPage": 1,
          "lastPage": 7,
          "pagingFrom": 1,
          "pagingTo": 5,
          "data": [
            {
              "productId": 14352,
              "typeId": 1,
              "categoryId": 1,
              "review": {
                "stars": 1.6875,
                "count": 32
              },
              "productUrl": "/systemtrade/fx/14352",
              "reviewTitle": "運ゲーの領域で使えない",
              "reviewContent": "★１つ付与しないとレビューできないので★１つ付けました。月曜日の定時にエントリーし、あとは１週間のうち、上にいくか下にいくか、まさに運ゲーの領域です。これがたまたま当たればOK、そうでなければ大損。他のEAにロットを配分して安定運用した方がよいですね。",
              "userId": 159587,
              "publishedAt": 1573305429,
              "name": "Beatrice DELTA2",
              "nickName": "festa"
            },
          ]
        },
        rightData: [
          {
            "title": "電子書籍",
            "list": [
              {
                "productId": 21332,
                "typeId": 2,
                "review": {
                  "stars": 4.77027027027027,
                  "count": 74
                },
                "productUrl": "/tools/indicators/21332",
                "reviewTitle": "がっかり",
                "reviewContent": "指定の口座を開設したのに\n確認ができないとかで特典を拒否された\nその特典が欲しくて購入したのにもらえないなら\n購入した意味がない\nバカみたいだ\n二度とGogoJungleでの購入はしない‼️",
                "userId": 44532,
                "publishedAt": 1573967896
              }
            ],
            "url": "/review/highpost/tools/12"
          },
        ]
      }
    },
    methods: {
      pagingClick() {

      }
    }
  }
  </script>
  ```
</docs>