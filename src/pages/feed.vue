<template>
<main-layout v-bind:person="this.$parent.person">
  <profile-layout v-bind:person="this.$parent.person">
    <!-- ACTIVITY SUBTAB -->
    <div id="feed" class="tab">
    	<div class="invite" id="refer">
    		<p>
    			<span>Пригласи друга</span><br/>
    			Перешли другу эту ссылку: <a target="_blank" :href="person.refer_link">{{ person.refer_link }}</a>, <br>и после его регистрации ты получишь 20 ZEN!
    		</p>
    		<form name="refer" action="#" class="st-form" onsubmit="return false;">
    			<input type="text" size="40" maxlength=100 name="email" placeholder="Email" required />
    			<button class="btn" name="save" type="submit">Отправить</button>
    			<div class="btn-form">
    				<div name="info" style="position:absolute;margin:0;margin-top:-63px;margin-left:150px;">
    					<div name="i-notice" style="display: none; background-color: #EFF884; padding: 5px;">Запрос к серверу...</div>
    					<div name="i-error" style="display: none; background-color: #FFD7D7; padding: 5px;">Ошибка запроса к серверу</div>
    					<div name="i-success" style="display: none; background-color: #E7F8E7; padding: 5px;">Приглашение отправлено</div>
    				</div>
    			</div>
    		</form>
    	</div>
    	<div>
        <feed-item-list v-bind:feedItemList="this.items" v-bind:feedTitles="this.$parent.feedTitles"></feed-item-list>
    		<div class="btn-form">
    			<button class="btn" name="feed_next_list" type="button" style="margin: 0 auto; margin-top: 10px; display: block;">Загрузить еще</button>
    		</div>
    	</div>
    </div>
  </profile-layout>
</main-layout>
</template>
<script>
import MainLayout from '../layouts/Main.vue'
import ProfileLayout from '../layouts/Profile.vue'
import FeedItemList from '../components/FeedItemList.vue'
import ZApi from '../services/zapi.js'
import FormatHelper from '../utils/format.js'
export default {
  name: 'page-profile-feed',
  inject: ['zvueportLogout'],
  data () {
    return {
      person: this.$parent.person,
      items: [],
      loading: true,
    }
  },
  methods: {
    getFDate: FormatHelper.getFDate,
  },
  components: {
    MainLayout,
    ProfileLayout,
    FeedItemList
  },
  created () {
    if (0 === this.items.length) {
      ZApi.getUserFeed()
        .then(items => this.items = items)
        .catch(error => console.log(error))
        .finally(() => this.loading = false);
    }
  }
}
</script>

<style lang="scss">
</style>
