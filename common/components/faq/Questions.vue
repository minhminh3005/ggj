<template>
  <div class="questions-container">
    <div v-if="title" class="title">
      <div v-if="keyTitle" class="mr-10">「{{ keyTitle }}」</div>
      <div>{{ title }}</div>
    </div>
    <div>
      <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
      <div class="questions-wrapper" :class="{ 'mt-30-sub': subtitle }">
        <div
          class="flex question-wrapper"
          v-for="(result, key) in questions"
          :key="key + `-qs`"
        >
          <span class="question-letter">Q.</span>
          <a :href="'/faq/' + result.id" class="question word-break-all">
            <span>{{ result.question }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      subtitle: {
        type: String,
        default: '',
      },
      keyTitle: {
        type: String,
        default: '',
      },
      questions: {
        type: Array,
        default() {
          return []
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
@import '@@/../common/assets/variables.scss';
@import '@@/../common/assets/faq/faq.scss';
.questions-container {
  .divider {
    margin-bottom: 40px;
    @media only screen and (max-width: $screen-sm) {
      margin: 15px 0;
    }
  }
  .mt-30-sub {
    margin-top: 30px !important;
  }
  .title {
    display: flex;
    justify-content: center;
    font-size: 25px;
    font-weight: bold;
    color: $grey4;
    padding-bottom: 20px;
    border-bottom: 1px solid $grey1;
    margin-top: 100px;
    @media only screen and (max-width: $screen-sm) {
      font-size: 20px;
      padding-bottom: 17px;
      margin-top: 40px;
    }
  }
  .subtitle {
    font-size: 22px;
    font-weight: bold;
    margin-top: 40px;
    @media only screen and (max-width: $screen-sm) {
      font-size: 17px;
      margin-top: 15px;
      padding-bottom: 17px;
    }
  }
  .questions-wrapper {
    margin-top: 40px;
    @media only screen and (max-width: $screen-sm) {
      margin-top: 15px;
    }
  }
  .question-wrapper {
    font-size: 20px;
    margin-bottom: 20px;
    .question-letter {
      font-weight: bold;
      color: $faq-q;
    }
    .question {
      color: $grey5;
      text-decoration: none;
      margin-left: 15px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: $faq-q;
      }
      @media only screen and (max-width: $screen-sm) {
        margin-left: 10px;
      }
    }
    @media only screen and (max-width: $screen-sm) {
      font-size: 14px;
    }
  }
}
</style>
