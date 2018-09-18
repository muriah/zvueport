<template>
  <div class="tab-ctrl">
  	<!-- TOP MENU -->
  	<div class="conteiner_menu_in">
  	   <div class="menu_in">
  			<div class="logo">
          <v-link href="/profile" style="display: inline-block; height: 100%; width: 100%;"></v-link>
        </div>
  			<!-- TAB HEADERS -->
  			<ul class="men_in ul-tab-headers">
          <li><v-link href="/profile">ПРОФИЛЬ</v-link></li>
          <li><v-link href="/newsfeed">НОВОСТИ</v-link></li>
          <li><v-link href="/rating">ZEN-РЕЙТИНГ</v-link></li>
          <li><v-link href="/forecast">ZEN-ПРОГНОЗ</v-link></li>
          <li><v-link href="/logout">ВЫЙТИ</v-link></li>
          <li v-if="person.is_admin">
            <v-link href="/updatetokens">Update tokens</v-link>
          </li>
  			 </ul>
  			<!-- END TAB HEADERS -->
  		</div>
  		<hr/>
  	</div>
  	<!-- END TOP MENU -->
  	<!-- TABS -->
  	<div class="content_bl">
  		<div class="conteiner">
          <div class="d-tabs">
            <slot></slot>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VLink from '../components/VLink.vue'
  export default {
    components: {
      VLink
    },
    props: ['person']
  }
</script>

<style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 15px 30px;
    background: #f9f7f5;
  }
</style>
