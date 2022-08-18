// this file is used for styleguidist only, not for running time
import Vue from 'vue'
import NoSSR from 'nuxt/lib/app/components/no-ssr'
import NuxtChild from 'nuxt/lib/app/components/nuxt-child.js'
import NuxtLink from 'nuxt/lib/app/components/nuxt-link.js'
import jquery from 'jquery'
import moment from 'moment-timezone'

Vue.component(NoSSR.name, NoSSR)
Vue.component(NuxtChild.name, NuxtChild)
Vue.component(NuxtLink.name, NuxtLink)

window.$ = jquery
window.moment = moment
