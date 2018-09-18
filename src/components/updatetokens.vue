<template>
  <main-layout v-bind:person="this.$parent.person">
    <!-- TAB RATING -->
    <div id="updatetokens" class="tab" style="padding: 10px 20px;">
      <p><a href="#updatetokens" id="a-update-vk-token">Обновить токен ВКонтакте</a></p>
      <p><a href="#updatetokens" id="a-update-fb-token">Обновить токен Facebook</a></p>
      <p><a href="#updatetokens" id="a-update-tw-token">Обновить токен Twitter</a></p>
    </div>
  </main-layout>
</template>
<script>
import MainLayout from '../layouts/Main.vue'
export default {
  name: 'page-account',
  data () {
    return {
    }
  },
  props: ['koko'],
  inject: ['zvueportLogout'],
  components: {
    MainLayout
  }
}
</script>

<style lang="scss">
</style>
