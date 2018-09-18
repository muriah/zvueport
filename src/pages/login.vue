<template>
   <main-layout v-bind:person="this.$parent.person">
      <div class='join-popup' name="auth" style="height: 250px; display: block;" data-id="login-popup">
      	<div class='wrap-popap'>
          <span class='exit' ></span>
      		<form action="?login" method="POST" id="f-fan-login" v-on:submit.prevent="zvueportLogin">
      			<input type="hidden" name="club" value="9" />
      			<label>Телефон +7<input type='text' name="username" size="40" required></label>
      			<div class="d-error"><div></div></div>
      			<label>Введите пароль<input type="password" name="password" size="40" required></label>
      			<div class="d-error"><div></div></div>
      			<div class='clear'></div>
      			<a href="#" onclick="$('#f-fan-login').hide();$('#f-reset-pwd').show();">Восстановить пароль</a>
      			<input name="login" type='submit' value='Войти' class='w-but'>
      			<div name="info-error" style="display: none;">Не удалось авторизоваться: <span name="mess"></span></div>
      			<div name="info-request" style="
      				display: none;
      				color: #FF7F50;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			">Запрос к серверу...</div>
      			<div name="info-request_error" style="
      				display: none;
      				color: red;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			"></div>
      			<div name="info-request_ok" style="
      				display: none;
      				color: green;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			">Успешная авторизация</div>
      		</form>

      		<form name='reset_pwd' action="[% c.uri_for('/join/reset_pwd') %]" method="POST" id="f-reset-pwd" style="display:none;">
      			<input type="hidden" name="club" value="9" />
      			<label>Телефон&nbsp;+7&nbsp;<input type='text' name="mobile" size="40" required></label>
      			<div class="d-error"><div></div></div>
      			<div class='clear'></div>
      			<a href="#" onclick="$('#f-reset-pwd').hide();$('#f-fan-login').show();">Войти</a>
      			<input name='reset_pwd' type='submit' value='Восстановить' class='w-but'>
      				<div name="info-error" style="display: none;">Не удалось авторизоваться: <span name="mess"></span></div>
      			<div name="info-request" style="
      				display: none;
      				color: #FF7F50;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			">Запрос к серверу...</div>
      			<div name="info-request_error" style="
      				display: none;
      				color: red;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			"></div>
      			<div name="info-request_ok" style="
      				display: none;
      				color: green;
      				float: right;
      				margin-right: 14px;
      				margin-top: 10px;
      			">Выслан код для восстановления пароля</div>
      		</form>
      	</div>
      </div>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
export default {
  name: 'page-login',
  data () {
    return {
      messages: this.$parent.messages,
      is_logged_in: this.$parent.is_logged_in,
    }
  },
  inject: ['zvueportLogin', 'zvueportLogout'],
  provide: ['zvueportLogin', 'zvueportLogout'],
  components: {
    MainLayout
  }
}
</script>

<style lang="scss">
</style>
