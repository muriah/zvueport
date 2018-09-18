<template>
  <main-layout v-bind:person="this.$parent.person">
    <!-- TAB RATING -->
  	<div id="rating" class="tab tab-ctrl">
  		<ul class="menu_tabs ul-tab-headers" style="background: #fff; margin-bottom: 0;">
  			<li class="menu-current th-selected"><a href="#rating-month">Рейтинг за месяц</a></li>
  			<li><a href="#rating-season">Рейтинг за сезон</a></li>
  			<li><a href="#rating-alltime">Рейтинг за всё время</a></li>
  		</ul>
  		<div class="d-tabs">
  			<div class="rating_wrap tab" id="rating-month">
          <rating-list v-bind:ratingList="items.month"></rating-list>
  			</div>
  			<div class="rating_wrap tab" id="rating-season" style="display: none;">
          <rating-list v-bind:ratingList="items.season"></rating-list>
  			</div>
  			<div class="rating_wrap tab" id="rating-alltime" style="display: none;">
          <rating-list v-bind:ratingList="items.alltime"></rating-list>
  			</div>
  		</div>
  	</div>
  </main-layout>
</template>
<script>
import MainLayout from '../layouts/Main.vue'
import RatingList from './ratinglist.vue'
import ZApi from '../../services/zapi.js'
import Tabs from '../../utils/tabs.js'
export default {
  name: 'page-account-rating',
  data () {
    return {
      items: {
        month: [],
        season: [],
        alltime: [],
      },
      loading: true,
    }
  },
  props: ['koko'],
  inject: ['zvueportLogout'],
  components: {
    MainLayout,
    RatingList
  },
  created () {
    if (0 === this.items.alltime.length) {
      ZApi.getRatingList()
        .then(items => this.items = items)
        .catch(error => console.log(error))
        .finally(() => this.loading = false);
    };
  },
  mounted () {
    Tabs.init();
  }
};
</script>

<style lang="scss">
</style>
