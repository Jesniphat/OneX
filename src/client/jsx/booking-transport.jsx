import React  from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import counterpart from 'counterpart'
import cookie from 'react-cookie';
import injectTapEventPlugin from 'react-tap-event-plugin'

import systemRoutes from './modules/system-transport/routes'
import helper from '../../server/lib/helper'

injectTapEventPlugin();
console.log('language', helper.language);
counterpart.setLocale(helper.getCookie('app.lang', cookie.load('SS_LANG') || 'en'));

ReactDOM.render(<Router routes={systemRoutes} />, document.getElementById('securestock-app'))
