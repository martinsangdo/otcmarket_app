/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, Dimensions, TextInput, Keyboard} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon,Form, Item, Input, Textarea} from "native-base";
import styles from "./style";    //CSS defined here
import common_styles from "../../css/common";
import BaseScreen from "../base/BaseScreen.js";
import Toast from 'react-native-simple-toast';
import { WebView } from 'react-native-webview';
import RequestData from '../utils/https/RequestData';
import Utils from "../utils/functions";
import {API_URI} from '../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {C_Const} from '../utils/constant';
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import MyText from '../component/MyText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height - 50;

class Contact extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			options: {
				'download_report': true,		//default
				'download_sec_filling': false,
				'newsletter': false,
				'daily_report': false,
				'connect_api': false,
				'other': false
			},	//checkbox values
			loading_indicator_state: false,
			email: '',
			message: '',
			is_done_sending: false
		};
	}

	componentDidMount() {
  }
	//
	_toogle_options_value(key, new_val){
		var current_options = this.state.options;
		current_options[key] = new_val;
		this.setState({options: current_options}, ()=>{
			// Utils.xlog('changed', this.state.options);
		});
	}
	//
	_send_contact(){
		if (this.state.loading_indicator_state){
			return;
		}
		var params = {
			email: this.state.email,
			message: this.state.message,
			options: JSON.stringify(this.state.options),
			device_info: JSON.stringify({
				app_version: DeviceInfo.getVersion(),
				device_id: DeviceInfo.getUniqueId(),
				device_name: DeviceInfo.getDeviceId(),
				device_version: Platform.OS + ' ' + DeviceInfo.getSystemVersion()
			})
		};
		//validate input
		if (Utils.isEmpty(this.state.email) || !Utils.validateEmail(this.state.email)){
			Toast.show('Please input valid email');
			return;
		}
		if (Utils.isEmpty(this.state.message)){
			Toast.show('Please input the message content');
			return;
		}
		//
		var me = this;
		Keyboard.dismiss();
		this.setState({is_done_sending:false, loading_indicator_state: true}, ()=>{
			RequestData.sentPostRequest(API_URI.SEND_CONTACT, params, (detail, error) => {
				// Utils.xlog('detail', detail);
				// Utils.xlog('error', error);
				me.setState({loading_indicator_state: false, is_done_sending: true});
			});
		});
		setTimeout(() => {
			if (this.state.loading_indicator_state){
				this.setState({loading_indicator_state: false});  //stop loading
			}
		}, C_Const.MAX_WAIT_RESPONSE);
	}
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
									<TouchableOpacity
										onPress={() => this.props.navigation.openDrawer()}
									>
										<Icon name="menu" style={common_styles.greenColor}/>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>Contact</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
								<View style={[common_styles.margin_10]}>
									<MyText>What I want is (*):</MyText>
								</View>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('download_report', !this.state.options['download_report'])}>
									{this.state.options['download_report'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['download_report'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Download Reports</MyText></View>
								</TouchableOpacity>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('download_sec_filling', !this.state.options['download_sec_filling'])}>
									{this.state.options['download_sec_filling'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['download_sec_filling'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Download SEC Fillings</MyText></View>
								</TouchableOpacity>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('newsletter', !this.state.options['newsletter'])}>
									{this.state.options['newsletter'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['newsletter'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Newsletter (1 mail per week)</MyText></View>
								</TouchableOpacity>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('daily_report', !this.state.options['daily_report'])}>
									{this.state.options['daily_report'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['daily_report'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Receive daily stock/market reports</MyText></View>
								</TouchableOpacity>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('connect_api', !this.state.options['connect_api'])}>
									{this.state.options['connect_api'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['connect_api'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Connect API endpoints</MyText></View>
								</TouchableOpacity>
								<TouchableOpacity style={[common_styles.flex_row, common_styles.margin_10]} onPress={() => this._toogle_options_value('other', !this.state.options['other'])}>
									{this.state.options['other'] && <MaterialCommunityIcons name="checkbox-marked" style={[common_styles.font_30, common_styles.default_font_color]}/>}
									{!this.state.options['other'] && <MaterialCommunityIcons name="checkbox-blank-outline" style={common_styles.font_30}/>}
										<View style={common_styles.justifyCenter}><MyText>Others</MyText></View>
								</TouchableOpacity>

								<View style={[common_styles.margin_10]}>
									<MyText>Your Email (*):</MyText>
									<Form style={common_styles.margin_t_5}>
										<Item style={styles.contact_email} regular>
											<Input ref='email' returnKeyType = {"done"} onSubmitEditing={Keyboard.dismiss}
						 						keyboardType='email-address' onChange={(event) => this.setState({email : event.nativeEvent.text})} value={this.state.email}/>
										</Item>
									</Form>
								</View>
								<View style={[common_styles.margin_10]}>
									<MyText>Message content (*):</MyText>
									<Textarea ref='message' rowSpan={5} bordered onChange={(event) => this.setState({message : event.nativeEvent.text})} value={this.state.message}/>
								</View>
								<View style={[common_styles.view_align_center]}>
									<TouchableOpacity style={[common_styles.default_button]} onPress={() => this._send_contact()}>
										<MyText style={common_styles.whiteColor}>Send</MyText>
									</TouchableOpacity>
								</View>
								{this.state.is_done_sending &&
									<View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
										<MyText style={common_styles.greenColor}>Thank you! We will contact you shortly</MyText>
									</View>
								}
							</Content>
						</Container>
				);
		}
}

export default Contact;
