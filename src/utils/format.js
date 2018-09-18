import * as moment from 'moment';

export default {
  getFDate (dtstring) {
    return moment(dtstring).format('Do MMMM YYYY в HH:mm');
  }
};
