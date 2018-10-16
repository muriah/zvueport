import axios from 'axios';

let token = 'qbpExGdW4rTjrDk3zEWmn5dwSBWIifBhV1K3jjz8';
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
  getUserFeed () {
    return axios.get('/m_zenrecords', config)
      .then(response => {
        return response.data;
      });
//       {
// "giveaway": {
// "name": "В честь дня рождения клуба Зенит-Казань",
// "id": "27"
// },
// "dtepoch": 1494666666,
// "desc": "В честь дня рождения клуба Зенит-Казань (День рождения клуба 2017)",
// "frozen": 0,
// "dtstring": "2017-05-13T09:11:06",
// "zen": "150",
// "id": "200084",
// "type": "gift"
// },
  },
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
