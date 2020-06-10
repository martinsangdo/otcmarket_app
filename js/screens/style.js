/**
 * author: Martin SD
 */
const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  splash_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  splash_logo: {
    width: 300, height: 300, resizeMode: 'contain'
  },
	left_row: {flex:1, flexDirection: 'row'},
	list_item: {margin:10},
	imageContainer: {
    width: deviceWidth-20, height: 170
    // , flex: 1, resizeMode:'stretch'
  },
	item_container: {paddingTop:10, paddingLeft:10, paddingRight:10},
	item_row: {flex:1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'space-between'},
	text_label: {width: deviceWidth - 120, marginRight:10},
  thumb: {width: 80, height: 80},
  forward_ico: {width: 20, justifyContent: 'center'},
  time_label: {fontSize:12, color: '#777'},
	title_home: {color:'#fff', fontSize:20},
	text_cointainer: {backgroundColor: 'rgba(100, 100, 100, 0.8)', width:deviceWidth-20, padding:5, position:'absolute', top:110, height:60},
	webview: {
		flex:1, width:'100%', minWidth:deviceWidth,
		minHeight:deviceHeight-80, //why 80???
		height:'100%'
	},
	search_bar: {
		width: deviceWidth - 120, height: Platform.OS==='ios'?35:40, backgroundColor: '#eee',
		justifyContent: 'center', marginTop: 2, borderRadius:6, borderColor:'#eee'
	},
	search_cancel: {width:100, justifyContent: 'center'},
  home_thumb: {width:100,height:100},
  home_item_row: {flex: 1, flexDirection: 'row', textAlign: 'flex-start'},
  home_item_left: {flex:0.4, backgroundColor:'#f0f', width:120, textAlign: 'flex-start', marginRight:10, textTransform: 'uppercase'},
  home_item_body: {textAlign: 'flex-start'},
  td_stock_price_item: {width:'25%'},
  td_stock_price_item_first: {width: '17%'},
  list_item: {padding:5},
  stock_ico: {maxWidth:25, maxHeight:15, resizeMode:'center'},
  financial_header: {padding:10, borderBottomColor: '#008da9', borderBottomWidth: 1, marginTop:10},
  financial_item: {padding:5, paddingLeft:10, borderBottomColor: '#ccc', borderBottomWidth: 1, justifyContent:'space-between', flexDirection: 'row'},
  financial_master_item: {paddingLeft:20, backgroundColor:'#eee'},
  financial_item_last: {paddingLeft:0},
  financial_options: {flexDirection: 'row', justifyContent: 'space-around', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 5, marginLeft:10, marginRight:10}
};
