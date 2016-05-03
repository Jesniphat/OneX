import React  from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import counterpart from 'counterpart'
import cookie from 'react-cookie';

import signinRoutes from './modules/signin-customer/routes'
import helper from '../../server/lib/helper'

console.log('language', cookie.load('SS_LANG'));
counterpart.setLocale(helper.getCookie('app.lang', cookie.load('SS_LANG') || 'en'));

ReactDOM.render(<Router routes={signinRoutes} />, document.getElementById('securestock-app'))
