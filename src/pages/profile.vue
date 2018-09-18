<template>
<main-layout v-bind:person="this.$parent.person">
  <profile-layout v-bind:person="this.$parent.person">
    <!-- AWARDS tab -->
    <div id="prizes" class="tab">
    	<ul class="feed-prize">
    		<li v-for="prize in items">
				  <a v-if="!prize.rule" :href="'/myprize/' + prize.purchase_id" target="_blank" :class="prize.status == 1 ? 'status-finished' : prize.status == 2 ? 'status-cancelled' : ''">
          </a>
    			<a v-if="prize.rule" href="#" :class="prize.status == 1 ? 'status-finished' : prize.status == 2 ? 'status-cancelled' : ''">
      				<span class="prize-img"><img :src="prize.prize_img" alt=""></span>
      				<span class="date-prize">{{ prize.dtepoch }}</span>
              <!-- [% date.format(prize.dtepoch, '%d.%m.%y') %] -->
      				<span class="price-bonus">{{ prize.points }} ZEN</span>
      				{{ prize.prize_name }}
			     </a>
    		</li>
    	</ul>
    </div>
  </profile-layout>
</main-layout>
</template>
<script>
import MainLayout from '../layouts/Main.vue'
import ProfileLayout from '../layouts/Profile.vue'
import ZApi from '../services/zapi.js'
export default {
  name: 'page-profile',
  data () {
    return {
      loading: true,
      items: [],
    }
  },
  props: ['koko'],
  inject: ['zvueportLogout'],
  components: {
    MainLayout,
    ProfileLayout
  },
  created () {
    ZApi.getItemList()
      .then(items => this.items = items)
      .catch(error => console.log(error))
      .finally(() => this.loading = false);
  }
}
</script>

<style lang="scss">
</style>
