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
        URI: setting.BACKEND_SERVER + 'market-data/active/current?',
        CACHE_TIME_KEY: 'CURRENT_MARKET_MOST_ACTIVE_CACHE_TIME_KEY'
      },
			ADVANCERS: {
        URI: setting.BACKEND_SERVER + 'market-data/advancers/current?',
        CACHE_TIME_KEY: 'CURRENT_MARKET_ADVANCERS_CACHE_TIME_KEY'
      },
			DECLINERS: {
        URI: setting.BACKEND_SERVER + 'market-data/decliners/current?',
        CACHE_TIME_KEY: 'CURRENT_MARKET_DECLINERS_CACHE_TIME_KEY'
      }
    },
		//Stock detail
		STOCK_DETAIL: {
			QUOTE: {
				GENERAL: setting.BACKEND_SERVER + 'stock/trade/inside/<symbol>?symbol=<symbol>',
				REAL_TIME_LEVEL_2: setting.BACKEND_SERVER + 'stock/level2/<symbol>?symbol=<symbol>',
				TRADE_DATA: setting.BACKEND_SERVER + 'stock/trade/data/<symbol>?symbol=<symbol>&page=1&pageSize=10',
				SHORT_INTEREST: setting.BACKEND_SERVER + 'stock/short-sale/<symbol>?symbol=<symbol>&page=1&pageSize=10'
			},
      PROFILE: setting.BACKEND_SERVER + 'company/profile/full/<symbol>?symbol=<symbol>'
		}

};
