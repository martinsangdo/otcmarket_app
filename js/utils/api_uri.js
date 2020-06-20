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
		HTML_REQUEST_HEADER: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Pragma': 'no-cache',
			'Expires': 0,
			'Content-Type': 'text/html;charset=UTF-8',
			'Accept': 'application/json, text/plain, */*'
		},
		CACHE_STOCK_PRICE_DURATION: 15*60*1000,	//15 mins
		INDEX_SNAPSHOT: {
			URI: setting.BACKEND_SERVER + 'index/snapshot',
			CACHE_TIME_KEY: 'INDEX_SNAPSHOT_CACHE_TIME_KEY',
		},
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
      PROFILE: setting.BACKEND_SERVER + 'company/profile/full/<symbol>?symbol=<symbol>',
      SECURITY: {
        DIVIDEND: setting.BACKEND_SERVER + 'company/dividends?page=1&pageSize=20&symbol=<symbol>&retainPageSize=true',
        SPLIT: setting.BACKEND_SERVER + 'company/splits?page=1&pageSize=20&symbol=<symbol>&retainPageSize=true'
      },
      NEWS: setting.BACKEND_SERVER + 'company/<symbol>/dns/news?symbol=<symbol>&pageSize=20&sortOn=releaseDate&sortDir=DESC&page=',
      NEWS_DETAIL: setting.BACKEND_SERVER + 'company/dns/news/',
			NEWS_CONTENT: setting.BACKEND_SERVER + 'company/dns/news/content/<id>?newsId=<id>',	//html
      FINANCIAL: setting.INTERNAL_BACKEND_SERVER + 'financials/<current_type>/<symbol>?symbol=<symbol>&duration=<current_duration>',
      DISCLOSURE: {
        REPORT: setting.BACKEND_SERVER + 'company/<symbol>/financial-report?symbol=<symbol>&page=<page_index>&pageSize=20&sortOn=releaseDate&sortDir=DESC',
        REPORT_DOWNLOAD: setting.BACKEND_SERVER + 'company/financial-report/<symbol>/content',
        FILLING: setting.BACKEND_SERVER + 'company/sec-filings/<symbol>?symbol=<symbol>&page=<page_index>&pageSize=20',
        INSIDER: setting.BACKEND_SERVER + 'insider-disclosure/otc/<symbol>?symbol=<symbol>&sortOn=transDate&sortDir=DESC&page=<page_index>&pageSize=20'
      }
		},
		STOCK_FINDER: {	//stock screener
			GET_FILTERS: {
				URL: setting.HOMEPAGE + 'research/stock-screener/api/controls',
				CACHE_TIME_KEY: 'STOCK_FINDER_CONTROLS_CACHE_TIME_KEY',
				CACHE_TIME_DURATION: 7*24*60*60*1000  //7 days in timestamp
			},
			SEARCH: setting.HOMEPAGE + 'research/stock-screener/api?page=<page_index>&pageSize=25&'
		},
		NEWS_REPORTS: {
			NEWS_URI: setting.BACKEND_SERVER + 'company/dns/tier/news?tierGroups=<tierGroup>&page=<page_index>&pageSize=20',
			FINANCIAL_URI: setting.BACKEND_SERVER + 'company/financial-report?tierGroup=<tierGroup>&page=<page_index>&pageSize=20',
			SEC_URI: setting.BACKEND_SERVER + 'company/sec-filings?tierGroup=<tierGroup>&page=<page_index>&pageSize=20'
		},
		SEC_FILLING_DETAIL: setting.HOMEPAGE + 'filing/html?id=<id>&guid=<guid>',
    PROMO_DATA: setting.BACKEND_SERVER + 'stock/promo-data', //compliance_statistic
    SHORT_SALE: {
      DATES: setting.BACKEND_SERVER + 'stock/short-sale/dates',
      LIST: setting.BACKEND_SERVER + 'stock/short-sale?date=<date>&page=<page_index>&pageSize=25'
    }
};
