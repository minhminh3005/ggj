<template>
  <div>
    <svg v-if="articleOption == SALON_ARTICLE" data-name="レイヤー 1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" class="svg-inline--fa graduation-cap fa-w-20" role="img" viewBox="0 0 640 512">
      <defs>
        <style>
          .graduation-cap { fill: #5d5e5e; }
        </style>
      </defs><title>icon</title>
      <path class="graduation-cap" d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z" />
    </svg>
    <svg v-else id="a08e44b1-e901-460f-ab81-e345d0e57a68" data-name="レイヤー 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <defs>
        <style>
          .fcad599e-3657-423e-99b8-35d77ca6b6b8 { fill: #5d5e5e; }
        </style>
      </defs><title>icon</title><path class="fcad599e-3657-423e-99b8-35d77ca6b6b8" d="M8.84,9.63h9.27a3,3,0,0,1,3,3v7.09a0,0,0,0,1,0,0H5.84a0,0,0,0,1,0,0V12.63A3,3,0,0,1,8.84,9.63Z" /><path class="fcad599e-3657-423e-99b8-35d77ca6b6b8" d="M8.84,61.18h9.27a3,3,0,0,1,3,3v7.09a0,0,0,0,1,0,0H5.84a0,0,0,0,1,0,0V64.18A3,3,0,0,1,8.84,61.18Z" transform="translate(26.95 132.45) rotate(180)" /><rect class="fcad599e-3657-423e-99b8-35d77ca6b6b8" x="5.84" y="21.91" width="15.27" height="37.09" /><path class="fcad599e-3657-423e-99b8-35d77ca6b6b8" d="M27.11,9.63h9.27a3,3,0,0,1,3,3v7.09a0,0,0,0,1,0,0H24.11a0,0,0,0,1,0,0V12.63A3,3,0,0,1,27.11,9.63Z" /><path class="fcad599e-3657-423e-99b8-35d77ca6b6b8" d="M27.11,61.18h9.27a3,3,0,0,1,3,3v7.09a0,0,0,0,1,0,0H24.11a0,0,0,0,1,0,0V64.18A3,3,0,0,1,27.11,61.18Z" transform="translate(63.5 132.45) rotate(180)" /><rect class="fcad599e-3657-423e-99b8-35d77ca6b6b8" x="24.11" y="21.91" width="15.27" height="37.09" /><path class="fcad599e-3657-423e-99b8-35d77ca6b6b8" d="M58.39,8.35l-2.55.59a2,2,0,0,0-1.5,2.41l.15.61-9.06,2.11-.15-.61a2,2,0,0,0-2.4-1.5l-2.55.6a2,2,0,0,0-1.5,2.4L52.15,72.11a2,2,0,0,0,2.4,1.49l2.56-.6a2,2,0,0,0,1.49-2.4l-.54-2.32,9.06-2.11.54,2.32a2,2,0,0,0,2.4,1.5l2.55-.6a2,2,0,0,0,1.5-2.4l-.54-2.32-1.46-6.24L62.39,16.7l-1.45-6.24-.15-.62A2,2,0,0,0,58.39,8.35Zm7.27,51.58L56.6,62,46.88,20.32l9.06-2.11Z" />
    </svg>
  </div>
</template>
<script>
import { SALON_ARTICLE } from '@@/../common/assets/consts/article'

export default {
  name: 'SeriesIcon',
  props: ['articleOption'],
  data() {
    return {
      SALON_ARTICLE
    }
  }
}
</script>
<style scoped>
svg {
  width: 28px;
}
</style>