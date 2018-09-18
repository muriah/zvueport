import Vue from 'vue'
import * as $ from 'jquery';
import axios from 'axios';
import * as moment from 'moment';

import './static/css/account/css_reset.css';
import './static/css/account/style_1.css';
import * as Popup from './static/js/account/popup.js';
import * as Join from './static/js/account/join.js';

import routes from './routes.js'

moment.locale('ru');

let localStorageKeys = {
  'is_logged_in': 'zvueport-logged-in',
};

const app = new Vue({
  el: '#app',
  data: {
    messages: {
      kakaka: 'kukuku',
      lala: 'falala',
    },
    is_logged_in: false,
    is_admin: false,
    currentRoute: window.location.pathname,
    person: get_person(),
    next_event: get_next_event(),
    refer_link: '//zenomania.ru/join/13'
  },
  methods: {
    zvueportLogin: function(evt) {
      let is_logged_in = window.localStorage.getItem('zvueport-logged-in');
      return false;
    },
  },
  provide: function () {
    return {
      zvueportLogin: function(evt) {
        this.is_logged_in = true;
        window.localStorage.setItem(localStorageKeys.is_logged_in, true);
        return false;
      },
      zvueportLogout: function(evt) {
        this.is_logged_in = false;
        console.log('logging out');
        window.localStorage.removeItem(localStorageKeys.is_logged_in);
      }
    }
  },

  computed: {
    ViewComponent () {
      const matchingView = routes[this.currentRoute];
      return matchingView
        ? require('./pages/' + matchingView + '.vue').default
        : require('./pages/404.vue').default;
    }
  },
  render (h) {
    return h(this.ViewComponent)
  }

});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})

$('#rating .ul-tab-headers').on('click', 'li>a', function(evt) {
  evt.preventDefault();
  select_tab(evt.target.hash);
});

function get_person () {
  return {
    first_name: 'Mr',
    last_name: 'Koroviev',
    top_place: 23,
    points: 459,
    fav_players: [ { name: 'Verbov' }, { name :'Spiridonov' } ],
    sn_accounts: {
        'vk': { id: 13 },
        'ig': {  },
        'fb': { id: 15 },
        'tw': { id: 16 },
    },
    subscription: {
      id: 4599,
      number: 123,
      sector: 34,
      row: 24,
      seat: 9
    }
  }
}

function get_next_event () {
  return {
    date: '2018-09-19T19:00:00',
    club_home: { name: 'HOME CLUB' },
    club_guest: { name: 'GUEST CLUB' },
  }
}
