import axios from 'axios';
import * as moment from 'moment';

let token = 'enxFxp7dzwBogYfQJdOONVowQcQgwiXwdPQl7SEO';
axios.defaults.baseURL = 'http://zenomania.ru/api';
// axios.defaults.headers.common['M-Authorization'] = 'Token ' + token;

let config = {
  headers: {'m-authorization': 'Token ' + token},
  params: {
    app_id: 1,
    limit: 10,
    offset: 0,
  },
}

export default {
  getNewsList () {
    return axios.get('/m_news', config)
      .then(response => {
        return response.data;
      });
  },
  getItemList () {
    return axios.get('/m_prizes', config)
      .then(response => {
        return response.data;
      });
  },
  getRatingList () {
    config.params.allratings = 1;
    return axios.get('/m_toprating', config)
      .then(response => {
        return response.data;
      });
  },
  getFDate (dtstring) {
    return moment(dtstring).format('Do MMMM YYYY в HH:mm');
  }
  // getItem (id) {
  //   return axios.get('/items/' + id, config)
  //     .then(response => {
  //       return response.data;
  //     });
  // },
  // createItem (payload) {
  //   return axios.post('/item/create/', payload);
  // },
};
