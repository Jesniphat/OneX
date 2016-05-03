import React  from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import counterpart from 'counterpart'
import cookie from 'react-cookie';

import systemRoutes from './modules/member-point/routes'
import helper from '../../server/lib/helper'

console.log('language', helper.language);
counterpart.setLocale(helper.getCookie('app.lang', cookie.load('SS_LANG') || 'en'));

ReactDOM.render(<Router routes={systemRoutes} />, document.getElementById('securestock-app'))
