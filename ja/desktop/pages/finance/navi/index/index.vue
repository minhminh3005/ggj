<template>
  <navi-top :items="naviList" :article-ranking="articleRanking" :series-ranking="seriesRanking" :popular-hashtags-article="popularHashtagsArticle" :hashtags="hashtags" />
</template>

<script>
import naviTop from '@@/../common/containers/navi/top/navi-top'
export default naviTop
</script>
