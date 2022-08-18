<template>
  <div>
    <button :style="!selectedService ? 'background: #f5f5f5' : 'background : white'" style="height: 100%; border: none;" @click="isShowTemplates = true">
      <span class="text-option">{{ $t('7') }}<pencil /></span>
    </button>
    <!-- modal list template -->
    <GogoModal
      :show="isShowTemplates"
      overflow-y="auto"
      height="480px"
      width="800px"
      @update:show="(val) => (isShowTemplates = val)"
    >
      <div slot="modal-header" class="d-none"></div>
      <div slot="modal-body" class="pos-rel bg-white h-full">
        <div class="template-ctn flex layout-col h-full">
          <div
            class="center close-icon flex mid text-gray-light"
            @click="isShowTemplates = false"
          >
            <CloseIcon current-color="#505050" />
          </div>
          <div class="template-header">
            <strong>{{ $t(23) }}</strong>
          </div>
          <div class="text-right mb-3" v-if="(templates || []).length">
            <button class="btn btn-primary btn-sm" @click="openCreateModal">
              {{ $t(24) }}
            </button>
          </div>
          <div class="hide-scroll" style="flex-grow: 1; overflow-y: auto;">
            <template v-if="(templates || []).length">
              <div
                class="flex flex-wrap p-3 template-row"
                v-for="item in templates"
                :key="item.id"
              >
                <div
                  class="col-xs-8 col-sm-10 p-0 wrap-text cursor-pointer"
                  @click="onSelectTemplate(item)"
                >
                  {{ item.title }}
                </div>
                <div
                  class="col-xs-2 col-sm-1 cursor-pointer text-right p-0 text-center text-info"
                  @click.self="onClickEditTemplate(item)"
                >
                  {{ $t(32) }}
                </div>
                <div
                  class="col-xs-2 col-sm-1 cursor-pointer text-right p-0 text-center text-danger"
                  @click.self="onDeleteTemplate(item)"
                >
                  <Loading v-if="isDeleteProcess === item.id" class="loading-icon" style="width: 20px; height: 20px;" />
                  <template v-else>
                    {{ $t(33) }}
                  </template>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="h-full w-full flex mid center">
                <div>
                  <div
                    class="text-primary text-danger text-center m-b-25"
                    v-html="$t(37)"
                  ></div>
                  <div class="text-center">
                    <button
                      class="btn btn-primary btn-lg w-150"
                      @click="openCreateModal"
                    >
                      {{ $t(31) }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="d-none"></div>
    </GogoModal>
    <!-- modal edit template -->
    <GogoModal
      :show="isShowEdit"
      overflow-y="auto"
      height="480px"
      width="800px"
      @update:show="(val) => (isShowEdit = val)"
    >
      <div slot="modal-header"></div>
      <div
        slot="modal-body"
        class="bg-white flex h-full layout-col space-between"
        :class="{ 'modal-disabled': isEditProcess }"
      >
        <div
          class="center close-icon flex mid text-gray-light"
          @click="isShowEdit = false"
          v-if="!isEditProcess"
        >
          <CloseIcon current-color="#505050" />
        </div>
        <div class="template-ctn flex layout-col">
          <div class="template-header">
            <strong>{{ $t(30) }}</strong>
          </div>
          <div class="flex layout-col pl-3 pr-3 pt-3" style="flex-grow: 1;">
            <div class="flex flex-column flex-md-row flex-wrap m-b-10">
              <div
                class="text-primary text-label"
                style="padding: 6px 10px 8px 0;"
              >
                <strong>{{ $t(24) }}：</strong>
              </div>
              <input
                type="text"
                v-model="currentTemplate.title"
                class="template-title form-control fs-14"
                maxlength="200"
                :disabled="isEditProcess"
              />
            </div>
            <div
              class="flex flex-column flex-md-row flex-wrap"
              style="flex-grow: 1;"
            >
              <div
                class="text-primary text-label"
                style="padding: 6px 10px 8px 0;"
              >
                {{ $t(25) }}：
              </div>
              <textarea
                v-model="currentTemplate.content"
                cols="30"
                rows="10"
                maxlength="2000"
                class="template-content form-control fs-14"
                :disabled="isEditProcess"
                ref="commentContentInput"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap" style="padding: 0 16px 10px 16px;">
          <div class="col-md-2 col-sm-2 col-xs-12 hidden-xs"></div>
          <div class="col-xs-12 col-sm-8 col-md-8 text-center">
            <button
              class="btn btn-primary w-120 mt-md-0 mt-2 mr-2"
              @click="onBackToTemplate"
              :disabled="isEditProcess"
            >
              {{ $t(34) }}
            </button>
            <button
              class="btn btn-primary w-120 mt-md-0 mt-2"
              @click="onCreateEditTemplate"
            >
              <Loading v-if="isEditProcess" class="loading-icon" style="width: 20px; height: 20px;" />
              <template v-else>
                {{ $t(35) }}
              </template>
            </button>
          </div>
          <div
            class="col-xs-12 col-md-4 col-lg-2 col-md-2 text-center text-md-right mt-md-0 mt-2"
            v-if="currentTemplate.id"
          >
            <button
              class="btn btn-danger w-120"
              @click.self="onDeleteTemplate(currentTemplate)"
            >
              <Loading v-if="isDeleteProcess === currentTemplate.id" class="loading-icon" style="width: 20px; height: 20px;" /> 
              <template v-else>
                {{ $t(36) }}
              </template>
            </button>
          </div>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import GogoModal from '@@/../components/modals/GogoModal.vue'
import i18n from '@@/lang/desktop/template-estimate-index.json'
import pencil from '@@/../components/icons/Pencil02.vue'
import CloseIcon from '@@/../common/components/close-icon'
import Loading from '@@/../components/icons/Loading.vue'

const TEMPLATE_API = '/api/share-room/display/rooms/templates'

export default {
  components: {
    GogoModal,
    pencil,
    CloseIcon,
    Loading,
  },
  props: ['selectedService'],
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isShowTemplates: false,
      templates: [],
      isDeleteProcess: 0,
      isShowEdit: false,
      isEditProcess: false,
      currentTemplate: {
        id: null,
        title: '',
        content: '',
      },
    }
  },
  mounted() {
    console.log('mounted')
    this.getTemplate()
  },
  methods: {
    async getTemplate() {
      try {
        this.templates = await this.GoGoHTTP.get(TEMPLATE_API)
      } catch (error) {
        console.log(error)
      }
    },
    openCreateModal() {
      this.isShowTemplates = false
      this.isShowEdit = true
      this.currentTemplate = {
        title: '',
        content: '',
      }
    },
    onClickEditTemplate(item) {
      this.currentTemplate = item
      this.isShowTemplates = false
      this.isShowEdit = true
    },
    async onDeleteTemplate({ id }) {
      this.isDeleteProcess = id
      await this.GoGoHTTP.delete(
        `${TEMPLATE_API}/${id}`,
        {},
        { isIgnore: true }
      )
      await this.getTemplate()
      this.isDeleteProcess = 0

      if (this.isShowEdit) {
        this.onBackToTemplate()
      }
    },
    onBackToTemplate() {
      this.isShowEdit = false
      this.isShowTemplates = true
    },
    onSelectTemplate(item) {
      this.$emit('selectTemplate', item.content)
      this.commentForm = JSON.parse(JSON.stringify(item))
      this.isShowTemplates = false
      setTimeout(this.focusCommentContentInput, 0)
    },
    focusCommentContentInput() {
      this.commentForm.content += '\n'
      const commentContentInput = $(this.$refs.commentContentInput)
      commentContentInput.focus()
      commentContentInput.scrollTop(commentContentInput[0].scrollHeight)
    },
    async onCreateEditTemplate() {
      try {
        //
        const { id, title, content } = this.currentTemplate
        this.isEditProcess = true

        // validate
        if (!title || !content) {
          this.$emit('formError', 'form-empty-error')
          return
        }

        //
        if (id) {
          await this.GoGoHTTP.put(
            `${TEMPLATE_API}/${id}`,
            { content, title },
            { isIgnore: true }
          )
        } else {
          await this.GoGoHTTP.post(
            TEMPLATE_API,
            { content, title },
            { isIgnore: true }
          )
        }

        //
        await this.getTemplate()
        this.onBackToTemplate()
      } catch (error) {
        this.$emit('formError', 'unknown-error')
      } finally {
        this.isEditProcess = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$screen-md: 992px;
$screen-sm: 768px;

$gray-base: #000;
$gray-lighter: lighten($gray-base, 93.5%); // #eee
@media screen and (min-width: $screen-sm) {
  .col-sm-8 {
    width: 66.66666667%;
    float: left;
  }
  .col-sm-2 {
    width: 16.66666667%;
    float: left;
  }
  .text-md-right {
    text-align: right !important;
  }
  .mt-md-0 {
    margin-top: 0 !important;
  }
  .col-sm-10 {
    width: 83.33333333%;
    float: left;
  }
  .col-sm-1 {
    width: 8.33333333%;
    float: left;
  }
  .col-md-2 {
    width: 16.66666667%;
    float: left;
  }
}
.text-option {
  color: #377cb8;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 20px;
  .icon-cls {
    width: 18px;
    height: 18px;
  }
}
.template-ctn {
  padding: 8px;
  flex-grow: 1;
  @media screen and (min-width: $screen-md) {
    padding: 16px 16px 10px 16px;
  }
  .template-header {
    padding-bottom: 8px;
    border-bottom: 1px solid $gray-lighter;
    margin-bottom: 14px;
  }
  .template-row {
    &:hover {
      background: $gray-lighter;
    }
  }
  //
  .text-label {
    width: 90px;
  }
  .template-title {
    outline: none;
    font-weight: bold;
    &[disabled] {
      background: none;
    }
  }
  .template-content {
    resize: none;
    outline: none;
    height: auto;
    &[disabled] {
      background: none;
    }
  }
  textarea,
  input {
    flex-grow: 1;
    width: 100%;
    @media screen and (min-width: $screen-sm) {
      width: auto;
      border-radius: 0;
    }
  }
}
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  i.icon-cls {
    display: inline-block;
    width: 15px;
    height: 15px;
  }
}
.text-gray-light {
  color: #707070 !important;
}
.p-3 {
  padding: 1rem !important;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.btn-danger {
  color: #fff;
  background-color: #e5455d;
  border-color: #e5455d;
}
.w-120 {
  width: 120px;
}
.m-b-10 {
  margin-bottom: 10px;
}
.mt-2 {
  margin-top: 0.5rem !important;
}
.mr-2 {
  margin-right: 0.5rem !important;
}
.text-danger,
.btn-danger {
  /deep/ .loader {
    &::before {
      border-top: 3px solid #e05555 !important;
    }
  }
}
.btn-primary {
  /deep/ .loader {
    &::before {
      border-top: 3px solid #55b4e0 !important;
    }
  }
}
/deep/ .loader {
  &::before {
    width: 20px !important;
    height: 20px !important;
    top: calc(50% - 11px) !important;
  }
}
.loading-icon {
  margin-left: 55%;
}
button {
  &:focus {
    outline: none !important;
  }
}
.m-b-25 {
  margin-bottom: 25px;
}
.w-150 {
  width: 150px;
}
.text-danger {
  color: #a94442;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-info {
  color: #31708f;
}
@media screen and (min-width: 1200px) {
  .col-lg-2 {
    width: 16.66666667%;
  }
}
@media screen and (min-width: $screen-md) {
  .col-md-8 {
    width: 66.66666667%;
    float: left;
  }
}
</style>
