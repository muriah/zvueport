<template>
<ol type="1" start="1" class="rtn">
  <li v-for="(p, i) in ratingList">
    <a :href="'/account/'+ p.id" :title="p.name + ' - ' + p.points" target=_blank>
      <span class="rtn_0">{{ i + 1 }}</span>
      <div class="d-avatar"><img :src="p.avatar == '/static/images/avatar/none.icon.jpg' ? 'http://zenomania.ru/static/images/avatar/none.icon.jpg' : p.avatar" alt="ava" /></div>
    </a>
    <p class="rtn_1">
      <a :href="'/account/'+ p.id" :title="p.name + ' - ' + p.points" target=_blank>{{ p.name }}</a>
      <br/>
      <span class="rtn_2">{{ p.title }}</span>
    </p>
    <span class="rtn_3">{{ p.points }}<br/><span class="rtn_4">ZEN</span></span>
  </li>
</ol>
</template>

<script>
export default {
  name: 'rating-list',
  data () {
    return {
    }
  },
  props: ['ratingList'],
};
</script>

<style lang="scss">
</style>
