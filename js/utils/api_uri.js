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
		CACHE_STOCK_PRICE_DURATION: 15*60*1000,	//15 mins
    //Current Market
    CURRENT_MARKET: {
      SNAPSHOT: { //general info
        URI: setting.BACKEND_SERVER + 'market-data/snapshot/current?tierGroup=',
        CACHE_TIME_KEY: 'CURRENT_MARKET_SNAPSHOT_CACHE_TIME_KEY',
        CACHE_TIME_DURATION: 60*60*1000  //60 mins in timestamp
      },
			MOST_ACTIVE: {
        URI: setting.BACKEND_SERVER + 'market-data/active/current?page=1&pageSize=10&',
        CACHE_TIME_KEY: 'CURRENT_MARKET_MOST_ACTIVE_CACHE_TIME_KEY'
      },
			ADVANCERS: {
        URI: setting.BACKEND_SERVER + 'market-data/advancers/current?page=1&pageSize=10&',
        CACHE_TIME_KEY: 'CURRENT_MARKET_ADVANCERS_CACHE_TIME_KEY'
      },
			DECLINERS: {
        URI: setting.BACKEND_SERVER + 'market-data/decliners/current?page=1&pageSize=10&',
        CACHE_TIME_KEY: 'CURRENT_MARKET_DECLINERS_CACHE_TIME_KEY'
      }
    }

};
