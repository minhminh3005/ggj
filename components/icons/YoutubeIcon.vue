<template>
  <i class="icon-cls">
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 96 96"
      style="enable-background: new 0 0 96 96;"
      xml:space="preserve"
    >
      <path
        fill="currentColor" 
        stroke="transparent"
        d="M92.7,25.4c-1.1-4-4.2-7.2-8.2-8.3c-7.3-2-36.4-2-36.4-2s-29.1,0-36.4,2c-4,1.1-7.2,4.3-8.2,8.3
  c-2,7.3-2,22.6-2,22.6s0,15.3,2,22.6c1.1,4,4.2,7.2,8.2,8.3c7.3,2,36.4,2,36.4,2s29.2,0,36.4-2c4-1.1,7.2-4.3,8.2-8.3
  c2-7.3,2-22.6,2-22.6S94.6,32.7,92.7,25.4z M38.5,61.9V34.1L62.8,48L38.5,61.9z"
      />
      <polygon
        :fill="colorPolygon" 
        :stroke="colorPolygon" 
        points="62.8,48 38.5,61.9 38.5,34.1 	"
      />
    </svg>
  </i>
</template>
<script>
export default {
  props: {
    colorPolygon: {
      type: String,
      default: '#000',
    },
  },
}
</script>