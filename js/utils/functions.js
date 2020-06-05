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
//fetch with progress
// https://github.com/g6ling/React-Native-Tips/tree/master/How_to_upload_photo%2Cfile_in%20react-native
// exports.my_futch = function(url, opts={}, onProgress) => {
//     console.log(url, opts)
//     return new Promise( (res, rej)=>{
//         var xhr = new XMLHttpRequest();
//         xhr.open(opts.method || 'get', url);
//         for (var k in opts.headers||{})
//             xhr.setRequestHeader(k, opts.headers[k]);
//         xhr.onload = e => res(e.target);
//         xhr.onerror = rej;
//         if (xhr.upload && onProgress)
//             xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
//         xhr.send(opts.body);
//     });
// };
//
exports.formatDate = function(date){
  Moment.locale('en');
  return Moment(date).format(C_Const.DATE_FORMAT);
};
//https://momentjs.com/docs/#/customization/
exports.formatCourseDate = function(lang_key, date){
  if (lang_key == C_Const.VI_LANG_KEY){
    Moment.locale('vi');
  } else if (lang_key == C_Const.CN_LANG_KEY){
    Moment.locale('zh-cn');
  } else {
    Moment.locale(lang_key);
  }
  return Moment(date).format(C_Const.COURSE_DATE_FORMAT);
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
//format currency to thousand style
exports.format_currency_thousand = function(number){
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

exports.makeApplink = function (file_src) {
    return setting.SERVER_URL + file_src;
};
//convert date time to duration likes "xx ago"
exports.getDurationTime = function (target_date, lang_info){
  // var today = Moment.utc(new Date()).format(C_Const.NOTIFICATION_DATE_FORMAT);
  var today = Moment(new Date()).format(C_Const.NOTIFICATION_DATE_FORMAT);
  // var diff = Moment.duration(Moment(today, C_Const.NOTIFICATION_DATE_FORMAT).diff(Moment(target_date, C_Const.NOTIFICATION_DATE_FORMAT)));
  // target_date = Moment.utc(target_date).format(C_Const.NOTIFICATION_DATE_FORMAT);
  var diff = Moment.duration(Moment(today, C_Const.NOTIFICATION_DATE_FORMAT).diff(Moment(target_date, C_Const.NOTIFICATION_DATE_FORMAT)));
  //
  if (diff._data != null){
    var _d = diff._data;
    // console.log(today);
    // console.log(target_date);
    // console.log(_d);
    if (_d.hours == 0 && _d.days == 0 && _d.months == 0 && _d.years == 0) {
      //less than 1 hour
      if (_d.minutes < 2){   //less than 1 minute
        return '1 ' + lang_info[C_MULTI_LANG.min_ago];
      } else {
        return _d.minutes + ' ' + lang_info[C_MULTI_LANG.mins_ago];
      }
    } else if (_d.days == 0 && _d.months == 0 && _d.years == 0){
      //less than 1 day
      if (_d.hours < 2){   //less than 1 hour
        return '1 ' + lang_info[C_MULTI_LANG.hour_ago];
      } else {
        return _d.hours + ' ' + lang_info[C_MULTI_LANG.hours_ago];
      }
    } else if (_d.months == 0 && _d.years == 0){
      //less than 1 month
      if (_d.days < 2){   //less than 1 day
        return '1 ' + lang_info[C_MULTI_LANG.day_ago];
      } else {
        //calculate week
        if (_d.days < 7){ //less than 1 week
          return _d.days + ' ' + lang_info[C_MULTI_LANG.days_ago];
        } else if (_d.days % 7 == 0){   //enough week
          if (_d.days / 7 == 1){
            return '1 ' + lang_info[C_MULTI_LANG.week_ago];
          } else {
            return (_d.days / 7) + ' ' + lang_info[C_MULTI_LANG.weeks_ago];
          }
        } else {
          return _d.days + ' ' + lang_info[C_MULTI_LANG.days_ago];
        }
      }
    } else if (_d.years == 0){
      //less than 1 year
      if (_d.months < 2){   //less than 1 month
        return '1 ' + lang_info[C_MULTI_LANG.month_ago];
      } else {
        return _d.months + ' ' + lang_info[C_MULTI_LANG.months_ago];
      }
    } else if (_d.years == 1){
      return '1 ' + lang_info[C_MULTI_LANG.year_ago];
    } else {
      return _d.years + ' ' + lang_info[C_MULTI_LANG.years_ago];
    }
  } else {
    return '';
  }
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
