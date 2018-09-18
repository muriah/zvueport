<template>
<main-layout v-bind:person="this.$parent.person">
  <profile-layout v-bind:person="this.$parent.person">
    <!-- PRIZES SUBTAB -->
    <div id="prize" class="tab">
      <div class="list_prof game">
        <div v-for="item_x in items">
          <div class="list_item games" v-bind:class="{ disabled: item_x.active }" :data-itemid="item_x.id" :data-itemname="item_x.name" :data-itemprice="item_x.price">
            <div :class="'list_img item' + item_x.id">
              <img :src="item_x.img" />
            </div>
            <div class="priz_txt">
              <p>{{ item_x.name }}</p>
            </div>
            <div class="prize-price-right" v-if="0 < item_x.price">
              <div class="button-prize-price">
                <a href="#item15" class="all-btn no-btn aixconfirm" :title="(2 == item_x.active) ? 'Временно отсутствует' : ''">
                  {{ item_x.price }}&nbsp;ZEN
                </a>
              </div>
              <p v-if="2 == item_x.active" class="prize-outofstock-label">Временно отсутствует</p>
            </div>
            <div class="button-prize-price" v-else>
              <a href="#item15" class="all-btn no-btn aixconfirm">
                Главный приз сезона
              </a>
            </div>
          </div>
        </div>
      </div>
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
