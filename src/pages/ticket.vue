<template>
<main-layout v-bind:person="this.$parent.person">
  <profile-layout v-bind:person="this.$parent.person">
    <!-- TICKETS SUBTAB -->
    <div id="ticket" class="tab">
    	<div class="content_tabs">
    		<div class="wrapper_forms">
    			<!-- TICKET BUY -->
    			<div v-if="this.$parent.next_event" class="buy_a_ticket" style="color: #000; padding: 50px 0 0 0;">
	          <span class="buy" style="display:inline-block;max-width:49%;">
                <a href="http://www.go.zenit-kazan.com/rus" target="_blank">Купить билет онлайн</a>
		        </span>
    				<div class="ftr" style="max-width:49%;">
    					<p>Ближайший матч:&nbsp;<span style="font-weight:bold;">{{ getFDate(next_event.date) }}</span></p>
    					<p>{{ next_event.club_home.name }}&nbsp;&mdash;&nbsp;{{ next_event.club_guest.name }}</p>
    				</div>
    			</div>

    			<!-- PROMO COUPON REGISTER -->
    			<div class="ticket_register">
    				<div name="page-d">
    					<form name="pcoupon_register" class="reg-form st-form">
    						<p><span>Зарегистрировать промо-код</span><br>
    							<input type="text" name="code" maxlength="20" required />
    							<button name="save" style="padding: 9px 25px; display: inline; margin: 0;">Отправить</button>
    						<div name="info" style="position: absolute; margin: 0px; margin-top: 8px; margin-left: 0px;">
    							<div name="i-notice" style="display: none; background-color: #EFF884; padding: 5px;">Запрос к серверу...</div>
    							<div name="i-error" style="display: none; background-color: rgb(210, 164, 164); padding: 5px;">Ошибка запроса к серверу</div>
    							<div name="i-success" style="display: none; background-color: rgb(134, 175, 134); padding: 5px;">Код успешно зарегистрирован</div>
    						</div>
    					</form>
    				</div>
    			</div>

    			<!-- TICKET REGISTER -->
    			<div class="ticket_register">
    				<div name="page-b">
    					<p><span>Зарегистрировать билет</span></p>
    					<img src="/static/img/ticket-blank.png" style="margin: 10px 0;" />
    					<form name="ticket" class="reg-form st-form">
    						<input type="text" name="ticket_num" placeholder="XXXXXXXXXXXXX" maxlength="13" required />
    						<button name="save" style="padding: 9px 25px; display: inline; margin: 0;">Отправить</button>
    						<p class="ti_reg_1">*Зарегистрировать можно только один купленный билет за матч. ZENы зачисляются в соответствии со схемой начисления ZENов. Регистрация билета на матч открывается на следующий день после того, как матч состоялся.</p>
    						<div name="info" style="position: absolute; margin: 0px; margin-top: -100px; margin-left: 0px;">
    							<div name="i-notice" style="display: none; background-color: #EFF884; padding: 10px;">Запрос к серверу...</div>
    							<div name="i-error" style="display: none; background-color: #FFD7D7; padding: 10px;">Ошибка запроса к серверу</div>
    							<div name="i-success" style="display: none; background-color: #E7F8E7; padding: 10px;">Билет зарегистрирован</div>
    						</div>
    					</form>
    				</div>
    			</div>
    			<!-- SUBSCRIPTION REGISTER -->
    			<div class="ticket_register" style="color: #3e5462;">
    				<div v-if="sub && sub.id" name="page-c">
    					<p><span>Ваш абонемент</span></p>
    					<form name="subscription" class="reg-form st-form">
    						<span>Номер:</span><input disabled="disabled" type=text name="subscription_num" :value="sub.number"><br/>
    						<span>Сектор:</span><input disabled="disabled" type=text name="subscription_sector" :value="sub.sector"><br/>
    						<span>Ряд:</span><input disabled="disabled" type=text name="subscription_row" :value="sub.row"><br/>
    						<span>Место:</span><input disabled="disabled" type=text name="subscription_seat" :value="sub.seat"><br/>
    					</form>
            </div>
            <div v-else name="page-c">
    					<p><span>Зарегистрировать абонемент</span></p>
    					<form name="subscription" class="reg-form st-form">
    						<span>Номер:</span>ВЗ1&nbsp;<input style="width: 330px;" type=text name="subscription_num" placeholder="Номер абонемента" required maxlength="20"><br/>
    						<span>Сектор:</span><input type=text name="subscription_sector" placeholder="Сектор" required maxlength="3"><br/>
    						<span>Ряд:</span><input type=text name="subscription_row" placeholder="Ряд" required maxlength="4"><br/>
    						<span>Место:</span><input type=text name="subscription_seat" placeholder="Место" required maxlength="4"><br/>
    						<button name="save" style="padding: 9px 25px; display: inline; margin: 20px 0;">Отправить</button>
    						<div name="info" style="position: absolute; margin: 0px; margin-top: -59px; margin-left: 155px;">
    							<div name="i-notice" style="display: none; background-color: #EFF884; padding: 5px;">Запрос к серверу...</div>
    							<div name="i-error" style="display: none; background-color: #FFD7D7; padding: 5px;">Ошибка запроса к серверу</div>
    							<div name="i-success" style="display: none; background-color: #E7F8E7; padding: 5px;">Абонемент зарегистрирован</div>
    						</div>
    					</form>
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
import FormatHelper from '../utils/format.js'
export default {
  name: 'page-profile-ticket',
  data () {
    return {
      person: this.$parent.person,
      sub: this.$parent.person.subscription,
      next_event: this.$parent.next_event,
    }
  },
  // props: [ 'messages' ],
  methods: {
    getFDate: FormatHelper.getFDate,
  },
  inject: [ 'zvueportLogout' ],
  components: {
    MainLayout,
    ProfileLayout
  }
}
</script>

<style lang="scss">
</style>
