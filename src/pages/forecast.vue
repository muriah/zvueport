<template>
<main-layout v-bind:person="this.$parent.person">
  <div id="tote" class="tab" data-options="[% tab_tote_options | html %]">
    <!--<div class="link_ev_gone"><a name="ev_gone" href="#" data-text_for_show="Все матчи" data-text_for_hide="Скрыть">Скрыть</a></div>-->
    <div class="content_prognoz" id="tote-inner">
    </div>
    <div name="info_no_events" style="display: none;">
      Пока не определен ближайший матч.
    </div>
    <div name="info_init_process" style="display: none;">
      Запрос данных...
    </div>
    <div name="forecast_link" style="display: none;">
      <a href="#" name="forecast">Угадайте счёт на следующий матч!</a>
    </div>
    <div name="forecast_result" style="display: none;">
      Ваш прогноз на матч Зенит-Противник: <span name="score_home"></span>:<span name="score_guest"></span>
    </div>
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
