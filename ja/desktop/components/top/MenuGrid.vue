<template>
  <div>
    <div class="block-1">
      <div>
        <a href="/tools/search?large=3" class="item center">
          <div class="icon center"><SkillShareIcon /></div>
        </a>
        <a href="/tools/search?large=3" class="title center no-underlying">
          {{ $t('1') }}
        </a>
      </div>
      <div>
        <a href="/systemtrade" class="item center">
          <div class="icon center"><SystemtradeIcon /></div>
        </a>
        <a href="/systemtrade" class="title center no-underlying">{{ $t('2') }}</a>
      </div>
      <div>
        <a href="/tools" class="item center">
          <div class="icon center"><IndicatorIcon /></div>
        </a>
        <a href="/tools" class="title center no-underlying">{{ $t('3') }}</a>
      </div>
    </div>
    <div class="block-2">
      <div>
        <a href="/finance/navi" class="item center">
          <div class="icon center"><NaviIcon /></div>
        </a>
        <a href="/finance/navi" class="title center no-underlying">{{ $t('4') }}</a>
      </div>
      <div>
        <a href="/tools" class="item center">
          <div class="icon center"><EbookIcon /></div>
        </a>
        <a href="/tools" class="title center no-underlying">{{ $t('5') }}</a>
      </div>
      <div>
        <a href="/finance/salons" class="item center">
          <div class="icon center"><MailmagazineIcon /></div>
        </a>
        <a href="/finance/salons" class="title center no-underlying">{{ $t('6') }}</a>
      </div>
      <div>
        <a href="/finance/videos" class="item center">
          <div class="icon center"><MovieIcon /></div>
        </a>
        <a href="/finance/videos" class="title center no-underlying">{{ $t('7') }}</a>
      </div>
      <div>
        <a href="/crowdsourcing" class="item center">
          <div class="icon center"><CrowdsourcingIcon /></div>
        </a>
        <a href="/crowdsourcing" class="title center no-underlying">{{ $t('8') }}</a>
      </div>
      <div>
        <a href="/kabu-api" class="item center">
          <div class="icon center"><ApiIcon /></div>
        </a>
        <a href="/kabu-api" class="title center no-underlying">{{ $t('9') }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import ApiIcon from '@@/../components/top/ApiIcon.vue'
import CrowdsourcingIcon from '@@/../components/top/CrowdsourcingIcon.vue'
import EbookIcon from '@@/../components/top/EbookIcon.vue'
import IndicatorIcon from '@@/../components/top/IndicatorIcon.vue'
import MailmagazineIcon from '@@/../components/top/MailmagazineIcon.vue'
import MovieIcon from '@@/../components/top/MovieIcon.vue'
import NaviIcon from '@@/../components/top/NaviIcon.vue'
import SkillShareIcon from '@@/../components/top/SkillShareIcon.vue'
import SystemtradeIcon from '@@/../components/top/SystemtradeIcon.vue'
import i18n from '@@/lang/components-desktop/menu-grid.json'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    title: String,
    info: String,
  },
  components: {
    ApiIcon,
    CrowdsourcingIcon,
    EbookIcon,
    IndicatorIcon,
    MailmagazineIcon,
    MovieIcon,
    NaviIcon,
    SkillShareIcon,
    SystemtradeIcon,
  },
}
</script>
<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
$b1-height: 200px;
$b2-height: 100px;
$b1-icon: 150px;
$b2-icon: 70px;
$b1-cls: 80px;
$b2-cls: 30px;
$hover: 10px;

$b1-height-mb: $b1-height - 100px;
$b2-height-mb: $b2-height - 50px;
$b1-icon-mb: 80px;

$b1-cls-mb: 50px;
$b2-icon-mb: 55px;
div[class^='block'] {
  display: grid;
  grid-gap: 30px;
  /deep/ i.icon-cls {
    display: inline-block;
    transition: 0.2s;
  }
}
.block {
  &-1 {
    grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
    /deep/ i.icon-cls {
      width: $b1-cls;
      height: $b1-cls;
    }
    .item {
      min-height: $b1-height;
      &:hover {
        .icon {
          width: $b1-icon + $hover;
          height: $b1-icon + $hover;
        }
        /deep/ i.icon-cls {
          width: $b1-cls + $hover;
          height: $b1-cls + $hover;
        }
      }
      .icon {
        width: $b1-icon;
        height: $b1-icon;
      }
    }
  }
  &-2 {
    grid-template-columns: repeat(auto-fill, minmax(13%, 1fr));
    margin-top: 30px;
    /deep/ i.icon-cls {
      width: $b2-cls;
      height: $b2-cls;
    }
    .item {
      min-height: $b2-height;
      &:hover {
        .icon {
          width: $b2-icon + $hover;
          height: $b2-icon + $hover;
        }
        /deep/ i.icon-cls {
          width: $b2-cls + $hover;
          height: $b2-cls + $hover;
        }
      }
      .icon {
        width: $b2-icon;
        height: $b2-icon;
      }
    }
  }
}
.item {
  border-radius: 10px;
  background: #eee;
  transition: 0.2s;
  &:hover {
    background: #c9c9c9;
  }
  .icon {
    transition: 0.2s;
    background: #fff;
    border-radius: 50%;
  }
}
.title {
  margin-top: 10px;
  font-weight: 600;
  color: #474747;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
@media only screen and (max-width: $screen-xs) {
  .block {
    &-1 {
      grid-gap: 20px !important;
      /deep/ i.icon-cls {
        width: $b1-cls-mb;
        height: $b1-cls-mb;
      }
      .item {
        min-height: $b1-height-mb;
        .icon {
          width: $b1-icon-mb;
          height: $b1-icon-mb;
        }
      }
    }
    &-2 {
      grid-gap: 15px !important;
      grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
      margin-top: 20px;
      .item {
        min-height: 80px;
        .icon {
          width: $b2-icon-mb;
          height: $b2-icon-mb;
        }
      }
    }
  }
}
</style>
