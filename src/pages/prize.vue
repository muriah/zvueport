<template>
<main-layout v-bind:person="this.$parent.person">
  <profile-layout v-bind:person="this.$parent.person">
    <!-- PRIZES SUBTAB -->
    <div id="prize" class="tab">
    	<div class="list_prof game">
    		[% FOR item_x IN items %]
    		<div class="list_item games [% IF 1 != item_x.active; 'disabled'; END %]" data-itemid="[% item_x.id %]" data-itemname="[% item_x.name | html %]" data-itemprice="[% item_x.price_points | html %]">
    			<div class="list_img [% 'item' _ item_x.id %]">
    				<img src="[% item_x.img | html %]" />
    			</div>
    			<div class="priz_txt">
    				<p>[% item_x.name %]</p>
    			</div>
    			[% IF 0 < item_x.price_points %]
    			<div class="prize-price-right">
    				<div class="button-prize-price">
    					<a href="#item15" class="all-btn no-btn aixconfirm" [% IF 2 == item_x.active %]title="Временно отсутствует"[% END %]>
    						[% item_x.price_points %]&nbsp;ZEN
    					</a>
    				</div>
    				[% IF 2 == item_x.active %]<p class="prize-outofstock-label">Временно отсутствует</p>[% END %]
    			</div>
    			[% ELSE %]
    			<div class="button-prize-price">
    				<a href="#item15" class="all-btn no-btn aixconfirm">
    					Главный приз сезона
    				</a>
    			</div>
    			[% END %]
    		</div>
    		[% END %]
    	</div>
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
