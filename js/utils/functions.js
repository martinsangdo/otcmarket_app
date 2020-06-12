/**
* author: Martin SD
* utility functions
*/
import Moment from 'moment';
import {C_Const, C_MULTI_LANG} from './constant';
import {setting} from "./config";
import 'moment/locale/th';    //thailand
import 'moment/locale/zh-cn';    //chinese
import 'moment/locale/vi';    //vietnamese
import store from 'react-native-simple-store';

//
exports.dlog = function(str){
  console.log(str);
};
//
exports.xlog = function(str, mess){
  console.log(str, mess);
};
//
exports.dynamicSort = function(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
};

exports.removeObjectfromArray = function(array, key, value) {
  return array.filter((el) => el[key] !== value);
};

exports.changeObjectinArray = function(array, key, oldValue, newValue) {
  array.forEach((item) => {
    if (item[key] === oldValue) {
      item[key] = newValue;
    }
  });
  return array;
};

exports.moveObjectinArray = function(array, key, step) {
  const index = array.map(item => item.symbol).indexOf(key);
  const value = array[index];
  let newPos = index + step;

  if (newPos < 0) {
    newPos = 0;
  } else if (newPos > array.length) {
    newPos = array.length;
  }

  array.splice(index, 1);
  array.splice(newPos, 0, value);
  return array;
};

exports.removeArrayAtIndex = function(array, index){
  return array.splice(index, 1);
};
//custom a request
exports.my_fetch = function(url, method, body){
  fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }).then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error(error);
    });
};
//
exports.formatDate = function(date){
  Moment.locale('en');
  return Moment(date).format(C_Const.DATE_US);
};
//
exports.formatYear = function(date){
  Moment.locale('en');
  return Moment(date).format(C_Const.YEAR_FORMAT);
};
//
exports.formatMonthYear = function(date){
  Moment.locale('en');
  return Moment(date).format(C_Const.MONTH_YEAR_FORMAT);
};
//trim a text
exports.trim = function(str){
  return String.prototype.trim.call(str);
};
//
exports.parseInt = function(str){
  return Number.parseInt(str, 10);
};
//
exports.isEmpty = function(str){
  return str == null || str == '';
};
//
exports.getNullableString = function(str){
  if (str == null || str === undefined)
    return '';
  return str;
};
//format currency to thousand style
exports.format_currency_thousand = function(number){
  if (number != null && number !== undefined && number !=''){
    return (''+number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
  return number;
};
exports.shorten_big_num = function(number){
  if (number != null && number != ''){
    if (number >= 1000000000){
      return (number / 1000000000).toFixed(2) + 'B';
    } else if (number >= 1000000){
      return (number / 1000000).toFixed(2) + 'M';
    } if (number >= 1000){
      return (number / 1000).toFixed(2) + 'K';
    }
  }
  return number;
};
//format number to float
exports.number_to_float = function(number){
  if (number != null && number != '')
    return number.toFixed(4);
  return '';
};
//format number to float
exports.number_to_float_2 = function(number){
  if (number != null && number != '')
    return number.toFixed(2);
  return '';
};
exports.makeApplink = function (file_src) {
    return setting.SERVER_URL + file_src;
};
//check response from server API
exports.isSuccessResponse = function (response) {
    return response != null && response.status == C_Const.RESPONSE_CODE.SUCCESS;
};
//
exports.getHomepageLanguage = function (lang) {
    return lang==C_Const.EN_LANG_KEY?setting.HOME_PAGE:setting.HOME_PAGE+lang;
};
//
exports.decodeHtml = function(str){
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};
//parse data into hierachy of data
exports.parse_level_data = function(original_data){
  // console.log(original_data);
  if (original_data.length == 0){
    return {};
  }
  var len = original_data.length;
  var result = {};
  var item;
  //parse top level
  for (var i=len-1; i>=0; i--){
    item = original_data[i];
    result[item.id] = {
      name: item.name.replace('&amp;', '&'),
      parent: item.parent
    };
  }
  return result;
};
exports.get_current_timestamp = function () {
    return Moment().unix() * 1000;  //milliseconds
};
//get data from cache, if any
//cache_data_key should be url
exports.get_data_from_cache = function(cache_time_key, cache_duration, cache_data_key, callback){
  store.get(cache_time_key).then(saved_time => {
    if (saved_time!=null){
      //saved last time
      var current_timestamp = Moment().unix() * 1000;
      // console.log('current_timestamp', current_timestamp);
      // console.log('saved_time.t', saved_time.t);
      // console.log('diff', current_timestamp - saved_time.t);
      if (current_timestamp - saved_time.t >= cache_duration){
        //expired
        callback(false, {});
      } else {
        //get data from cache
        store.get(cache_data_key)
        .then(saved_data => {
          if (saved_data!=null){
              //saved cache
              callback(true, saved_data.d);
            } else {
              //no cache
              callback(false, {});
            }
          });
        }
      } else {
        //no cache
        callback(false, {});
		  }
  });
};
