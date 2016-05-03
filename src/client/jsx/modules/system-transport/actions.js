import Reflux from 'reflux'
import helper from '../../libs/helper'

const actions = Reflux.createActions({
  'session': {children:['success', 'error']},
  'signout': {children:['success', 'error']},
  'toast': {children:['dismiss']},
  'dialog': {children:['dismiss']},
  'sideMenu': {},
  'xxx':{},
  'setTitle': {},
  'moduleChange': {},
})

// actions.sideMenu.preEmit = function() {
//   console.log('preEmit', arguments)
// }
// actions.sideMenu.shouldEmit = function(value) {
//   console.log('shouldEmit', value)
//   return true
// }

const store = Reflux.createStore({
  listenables: [actions],

  onSession() {
    console.log('onSession')
    helper.ajaxRequest('/app/system/session', {}, (result) => {
      actions.session.success(result);
    })
  },

  onSignout() {
    helper.ajaxRequest('/app/system/signout', {}, (result) => {
      actions.signout.success(result)
    })
  }
})

module.exports = actions
