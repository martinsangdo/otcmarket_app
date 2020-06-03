/**
 * author: Martin SD
 * API URI
 */
import {setting} from './config.js';

export const API_URI = {
		DEFAULT_REQUEST_HEADER: {   //header of request sending to server
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': 0,
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8'
		},
		MULTIPART_REQUEST_HEADER: {
				'Content-Type': 'multipart/form-data'
		},
    //News
		GET_NEWS_LIST: setting.HOME_PAGE + 'posts?per_page=20&_embed',
    //Category
    GET_CATEGORY_LIST: setting.HOME_PAGE + 'categories?per_page=100',

};
