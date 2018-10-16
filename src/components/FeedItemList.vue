<template>
<div id="feed-items">
	<div class="activity" v-for="(pp, idx) in feedItemList">
		<div class="ftl" style="width: 80%;">
			<p class="ftl activity-title" v-if="'gift' == pp.type">
				{{ pp.giveaway.name }}<br>
			</p>
			<p class="ftl activity-title" v-else-if="'promo_coupon' == pp.type">
				{{ pp.desc }}<br>
			</p>
			<p class="ftl activity-title" v-else-if="'repost' == pp.type || 'repost_deleted' == pp.type">
				{{ pp.desc }}<br>
				<a :href="pp.repost.post_link">{{ pp.repost.network }}</a>
			</p>
			<p class="ftl activity-title" v-else-if="'reference' == pp.type">
				{{ pp.desc }}<br>
				<a :href="'/person/'+pp.person_id">{{ feedTitles[pp.type] }}</a>
			</p>
			<p class="ftl activity-title" v-else-if="'vk_linked' == pp.type||'fb_linked' == pp.type||'in_linked' == pp.type ||'tw_linked' == pp.type">
				{{ pp.desc }}<br>
				<a :href="pp.sa_link">{{ feedTitles[pp.type] }}</a>
			</p>
			<p class="ftl activity-title" v-else>
				{{ pp.desc }}<br>
			</p>
			<br>

			<span class="ftl" v-if="'repost' == pp.type || 'repost_deleted' == pp.type">
				{{ pp.post_text }}
			</span>
			<span class="ftl" v-else-if="'forecast_winner' == pp.type">
				Матч "{{ pp.ev_name }}" проведен {{ getFDate(pp.ev_date) }}
			</span>
			<span class="ftl" v-else-if="'reference' == pp.type && 'frozen' == pp.state">
				Зены заморожены, пока друг не активирует аккаунт
			</span>
			<span class="ftl" v-else-if="'purchase' == pp.type && 'purchase_refund' == pp.type">
				{{ pp.prize_name }}
			</span>
			<span class="ftl" v-else-if="'ticket_register' == pp.type || 'sub_att' == pp.type">
				Матч "{{ pp.ev_name }}" проведен {{ getFDate(pp.ev_date) }}
			</span>
			<span class="ftl" v-else-if="'sub_register' == pp.type">
				"№" {{ pp.subscription.number }} сектор {{ pp.subscription.sector }} ряд {{ pp.subscription.row }} место {{ pp.subscription.seat }}
			</span>
			<br>

			<span class="s-unfreeze ftl" :data-id="pp.id" v-if="'tounfreeze' == pp.state && !view_only">Разморозить</span>
		</div>

		<div class="ftr" style="width: 19%; text-align: right;">
			{{ pp.zen }}<br/>ZEN
		</div>
		<div style="clear:both;"></div>
		<div class="act_data" >
			<div class="act_img"></div>
			<span>{{ getFDate(pp.dtstring) }}</span>
		</div>
	</div>
</div>
</template>

<script>
import FormatHelper from '../utils/format.js'
export default {
  name: 'feed-item-list',
  data () {
    return {
    }
  },
	methods: {
		getFDate: FormatHelper.getFDate,
	},
  props: ['feedItemList', 'feedTitles'],
};
</script>

<style lang="scss">
</style>
