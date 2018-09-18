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
export default {
  name: 'page-profile-prize',
  data () {
    return {
    }
  },
  props: ['koko'],
  inject: ['zvueportLogout'],
  components: {
    MainLayout,
    ProfileLayout
  }
}
</script>

<style lang="scss">
</style>
