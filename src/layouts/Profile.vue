<template>
  <!-- TAB PROFILE -->
  <div id="profile" class="tab tab-ctrl">
    <div class="profile_promoblock">
      <div class="rating_radius" id="above-avatar"></div>
      <!-- AVATAR -->
      <div class="ava">
        <div id="d-avatar">
          <img :src="person.avatar_icon || '//zenomania.ru/static/images/avatar/none.icon.jpg'" alt="Аватарка" name="avatar" class="i-avatar" />
        </div>
      </div>
      <!-- PERSONAL -->
      <div class="name_surname">
        <div class="name">{{ person.first_name }}</div>
        <div class="surname">{{ person.last_name }}</div>
        <div class="bottom_edit"><a href="#profile-edit" class="stateful">РЕДАКТИРОВАТЬ</a></div>
        <div class="favorite_player" v-if="person.fav_players && person.fav_players.length">
          <p>Любимые игроки</p>
          <div class="favorite_player_1" v-for="player in person.fav_players">{{ player.name }}</div>
        </div>
        <div class="ration_bl">
          <p class="ava_rating"><b><b data-name="person_points">{{ person.points || 0 }}</b>&nbsp;ZEN</b></p>
          <p class="ava_rating_1">Место в&nbsp;<v-link href="/rating" style="color:#fff">рейтинге</v-link>&nbsp;:&nbsp;<b>{{ person.top_place }}</b></p>
        </div>
      </div>

      <!-- SOCIAL NETWORKS LINK/UNLINK -->
      <div class="soc_profile" id="social">
        <div v-for="(acc, sn_name) in person.sn_accounts"
          :id="'d-link-' + sn_name.toUpperCase()"
          :class="'D-SN-link sp_check ' + (acc.id ? 'linked' : '')"
          :title="acc.id ? 'Unlink ' : 'Link ' + sn_name"
          :data-network="sn_name">
          <a data-action="unlink" href="#"></a>
          <a data-action="link" href="#"></a>
        </div>
      </div>

      <div class="bckg_profile_promoblock"></div>
    </div>

    <div class="wrapper_content_tabs" id="profile-subtabs">
      <ul class="menu_tabs ul-tab-headers">
        <li><v-link href="/profile">ZENOMANIA</v-link></li>
        <li><v-link href="/profile-feed">АКТИВНОСТЬ</v-link></li>
        <li><v-link href="/profile-ticket">БИЛЕТЫ</v-link></li>
        <li><v-link href="/profile-my-prizes">МОИ ПРИЗЫ</v-link></li>
      </ul>
      <div class="content_tabs d-tabs">
        <slot></slot>
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
