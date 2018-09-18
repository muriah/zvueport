<template>
<main-layout v-bind:person="this.$parent.person">
  <!-- TAB NEWS -->
  <div id="news" class="feed_wrap tab">
    <div class="feed" v-for="post in items">
      <div class="feed_img" v-if="post.pic">
        <a :href="post.link" target="_blank">
          <img :src="post.pic" style="width: 100%;">
        </a>
      </div>
      <p>{{ post.text }}</p>
      <div class="feed_date">
        <div class="post_date">
          <span></span>
          <div class="post_otstup">
            <a :href="post.link" target="_blank">{{ getFDate(post.dtstring) }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  </main-layout>
</template>
<script>
import MainLayout from '../layouts/Main.vue'
import ZApi from '../services/zapi.js'
import FormatHelper from '../utils/format.js'
export default {
  name: 'page-account-newsfeed',
  data () {
    return {
      items: [],
      loading: true,
    }
  },
  methods: {
    getFDate: FormatHelper.getFDate,
  },
  components: {
    MainLayout
  },
  created () {
    if (0 === this.items.length) {
      ZApi.getNewsList()
        .then(items => this.items = items)
        .catch(error => console.log(error))
        .finally(() => this.loading = false);
    }
  }
}
</script>

<style lang="scss">
</style>
