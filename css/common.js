/**
 * author: Martin SD
 * common styles of the app
 */
const React = require("react-native");

const {StyleSheet, Dimensions} = React;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default {
		mainGreenBg: {
			backgroundColor: "#008da9"    //main background of the app
		},
		default_font_color: {color: '#008da9'},
		mainTitle: {
			fontSize: 24, fontWeight: 'bold'
		},
		btn_rect: {
			borderColor: '#fff', padding: 10,
			width: 200, borderWidth: 1, alignItems: 'center'
		},
		btn_rect_active: {
			backgroundColor: '#fff'
		},
		greenColor: {
				color: '#008da9'
		},
		container: {
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100%'
		},
		btn_share: {
			borderColor: '#ccc',justifyContent: 'center', backgroundColor: '#fff',
			borderRadius: 4, borderWidth: 1, width: 150
		},
		badge: {
			height:20, justifyContent: 'center', padding:2
		},
		badge_text: {
			fontSize:10, top: 0
		},
		//tab_icon: {fontSize:20, margin: 0},
		tab_icon: {width:30, height:30},
    header_icon: {fontSize:22},
		mainBg: {
				backgroundColor: "#fff"    //white
		},
		//header
    flex_row: {flexDirection: 'row'},
		flex_column: {flexDirection: 'column'},
		header: {},
		headerBg: {
				backgroundColor: '#0097de'
		},
		headerLeft: {
				flex: 1, flexDirection: 'row'
		},
		headerBody: {
				left: -90
		},
		headerRight: {
				width: 30
		},
		//
		defaultFont: {
				fontSize: 18
		},
		bold: {
				fontWeight: 'bold'
		},
		font_10: {
				fontSize: 10
		},
		font_15: {
				fontSize: 15
		},
		font_20: {
				fontSize: 20
		},
		font_25: {
				fontSize: 25
		},
		font_30: {
				fontSize: 30
		},
		font_40: {
				fontSize: 40
		},
		//color in Home page
		grayColor: {color: '#ccc'},
		darkGrayColor: {
			color: '#999'
		},
		blackColor: {color: '#000'},
		//
		whiteColor: {
				color: '#fff'
		},
    redColor: {color:'#f00'},
    orangeColor: {color: '#008da9'},
		lightBlackBg: {
				backgroundColor: '#444'
		},
		whiteBg: {backgroundColor: '#fff'},
		grayBg: {backgroundColor: '#ccc'},
		//align
		view_align_right: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
		view_align_center: {flex: 1, flexDirection: 'row', justifyContent: 'center'},
		view_align_center_evenly: {flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'},
		//float
		float_left: {alignSelf: 'flex-start'},
		float_right: {alignSelf: 'flex-end'},
		float_center: {alignSelf: 'center'},
		align_items_center: {alignItems: 'center'},
		justifyCenter: {justifyContent: "center", textAlign: 'center'},
    text_align_right: {alignItems:'flex-end'},
		//margin
		margin_5: {margin: 5},
		margin_10: {margin: 10},
    margin_15: {margin: 15},
		margin_20: {margin: 20},
		margin_l_5: {marginLeft: 5},
		margin_l_10: {marginLeft: 10},
		margin_l_20: {marginLeft: 20},
		margin_r_5: {marginRight: 5},
    margin_r_10: {marginRight: 10},
		margin_r_20: {marginRight: 20},
		margin_t_0: {marginTop: 0},
		margin_t_5: {marginTop: 5},
		margin_t_10: {marginTop: 10},
		margin_t_20: {marginTop: 20},
		margin_t_40: {marginTop: 40},
		margin_t_50: {marginTop: 50},
		margin_b_0: {marginBottom: 0},
		margin_b_10: {marginBottom: 10},
		margin_b_20: {marginBottom: 20},
    margin_b_30: {marginBottom: 30},
		margin_b_50: {marginBottom: 50},
		margin_b_100: {marginBottom: 100},
		margin_b_200: {marginBottom: 200},
		//
		padding_5: {padding: 5},
		padding_10: {padding: 10},
		padding_20: {padding: 20},
		padding_h_10: {paddingHorizontal: 10},
		padding_h_5: {paddingHorizontal: 5},
		padding_r_10: {paddingRight: 10},
		//width
		width_200: {width: 200},
		width_300: {width: 300},
		width_20p: {width: '20%'},
		width_25p: {width: '25%'},
    width_30p: {width: '30%'},
    width_50p: {width: '50%'},
		flex_10p: {flex: 0.1},
		flex_20p: {flex: 0.2},
		flex_40p: {flex: 0.4},
		flex_50p: {flex: 0.5},
		flex_60p: {flex: 0.6},
		flex_80p: {flex: 0.8},
		flex_100p: {flex: 1},
		txt_item_center: {width: '80%', alignSelf: 'center'},  //used in form textbox
		txt_item_center_row: {flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center'},  //used in form textbox
		txt_item_left: {width: '80%', alignSelf: 'flex-start'},  //used in form textbox
		//
		min_w_70p: {minWidth: '70%'},
		min_w_80: {minWidth: 80},
		hide: {width: 0, height: 0},
		invisible: {opacity: 0},
		default_button: {
				justifyContent: "center",
				alignItems: 'center',
				paddingHorizontal: 20,
				width: 150,
				backgroundColor: '#0097de'
		},
		//
		border_b_active: {
				borderBottomColor: '#008da9',
				borderBottomWidth: 4
		},
    border_b_tab:{
      borderBottomColor: '#008da9',
      borderBottomWidth: 1
    },
		arrow_color: {color: '#444'},
		load_more: {marginBottom: 10},
		text_input: {width: '100%', fontSize: 18},
    fetch_row: {flexDirection: 'row', justifyContent: 'space-between'}
};
