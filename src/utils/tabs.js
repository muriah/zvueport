import * as $ from 'jquery';

export default {
  select_tab ( tab_id ) {
    if( tab_id ){
      _select_tab(tab_id);
    }
    else {
      var tabs = /\btab=(\w+)/.exec(location.search);
      if( tabs ){
        _select_tab("#"+tabs[1])
      }
      else {
        _select_tab($( '.ul-tab-headers a' ).first().attr('href'));
      }
    }
  },
  init () {
    $('.ul-tab-headers').on('click', 'li>a', function(evt) {
      evt.preventDefault();
      _select_tab(evt.target.hash);
    });
  },
}

function _select_tab ( state_id ) {
  var state2tab = {
    '#prize':  '#profile',
    '#prizes':  '#profile',
    '#feed':   '#profile',
    '#ticket': '#profile',
    '#goal': '#profile',
    '#profile-edit': '#profile',
    '#rating-alltime': '#rating',
    '#rating-season': '#rating',
    '#rating-month': '#rating',
  };
  // mark selected tab's header
  $( '.ul-tab-headers li.menu-current' ).removeClass('menu-current');
  $( '.ul-tab-headers a[href="'+ state_id +'"]' ).parents("li:first").addClass('menu-current');


  if ( 'undefined' != typeof state2tab[state_id] ) {
    $('.tab-ctrl div.tab').hide();
    $(state2tab[state_id]).show();
    var li = $('a[href="'+state_id+'"]').parent();
    li.addClass('th-selected').siblings().removeClass('th-selected');
    li.parents('.tab-ctrl').first().find('.d-tabs>div').eq(li.index()).show().siblings('div').hide();
  } else {
    $('.tab-ctrl div.tab').hide();
    $(state_id).show();
  }

  if ( state_id == '#profile-edit' ) {
    _mod.account.hideModal();
    _mod.account.showModal(null, 'profile-edit');
  }

  if ( state_id == '#tote' ) {
    _scope.tote.tab_init();
  }
  else if ( state_id == '#profile' ) {
    if ( $('#profile .ul-tab-headers .th-selected').size() ) {
      $($('#profile .ul-tab-headers .th-selected').find('a').attr('href')).show();

    } else {
      $('#profile .ul-tab-headers .th-selected' ).removeClass('th-selected');
      $('#profile .ul-tab-headers li:first').addClass('th-selected');
      $('#profile .d-tabs>div:first').show();
    }
  }
  else if ( '#rating' == state_id ) {
    if ( $('#rating .ul-tab-headers .th-selected').size() ) {
      $($('#rating .ul-tab-headers .th-selected').find('a').attr('href')).show().siblings('div').hide();
    } else {
      $('#rating .ul-tab-headers .th-selected' ).removeClass('th-selected');
      $('#rating .ul-tab-headers li:first').addClass('th-selected');
      $('#rating .d-tabs>div:first').show().siblings('div').hide();
    }
  } else {
  }

  // if ( state_id == '#feed' ) {
  //   _scope.events.tab_activate();
  // }
  //
  // if (state_id) { _scope.menu_lights.activate(state_id.split('#')[1]) };
}
