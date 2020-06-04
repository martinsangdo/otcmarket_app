/**
 * author: Martin SD
 * constants
 */
import {setting} from './config.js';

export const C_Const = {
	RESPONSE_CODE: {
		SUCCESS: 200,
		FORBIDDEN: 403,
		BAD_REQUEST: 502,
		SERVER_ERROR: 500
	},
	ERR_SERVER_MESS: 'Please try it later',
	NET_REQUEST_FAIL: 'Network request failed',   //cannot connect to server
	AUTHORIZATION_PREFIX_HEADER: 'Bearer ', //used in header of Authorization
	ANDROID: 'ANDROID',
	IOS: 'IOS',
	SPLASH_TIMER: 1000,   //time to display splash screen
  MAX_WAIT_RESPONSE: 12000, //12s, max time to wait response
	MAX_SPLASH_TIMER: 30000,   //maximum time to display splash screen
	DATE_FORMAT: 'DD-MMM',   //birthday format
	NOTIFICATION_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
	PAGE_LEN: 10, //default item number in one page, should large enough to load more item
	EMPTY_DATETIME: '0000-00-00 00:00:00',
	EMPTY_DATE: '0000-00-00',
	//message keys get from server API
	RESPONSE_MESS_KEY: {
		LOGIN_SUCCESS: 'LOGIN_SUCCESS',
		SUCCESS: 'SUCCESS',
		NO_DATA: 'NO_DATA'
	},
	JSON_WEB_TOKEN: 'jwt',    //to verify request from this app
	//store/Preference keys
	STORE_KEY: {
		USER_INFO: 'USER_INFO',   //include: user_id, jwt
		CATEGORY_LIST: 'CATEGORY_LIST'
	},
	ACTIVE_COLOR: '#008da9'
};
