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

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height - 50;

class Contact extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			options: {
				'download_report': true,
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
			options: JSON.stringify(this.state.options)
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Contact</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
								<View style={[common_styles.margin_10]}>
									<Text>What I want is (*):</Text>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['download_report']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('download_report', !this.state.options['download_report'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Download Reports</Text></View>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['download_sec_filling']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('download_sec_filling', !this.state.options['download_sec_filling'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Download SEC Fillings</Text></View>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['newsletter']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('newsletter', !this.state.options['newsletter'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Newsletter (1 mail per week)</Text></View>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['daily_report']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('daily_report', !this.state.options['daily_report'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Daily stock/market report</Text></View>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['connect_api']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('connect_api', !this.state.options['connect_api'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Connect our API endpoint</Text></View>
								</View>
								<View style={[common_styles.flex_row, common_styles.margin_5]}>
									<CheckBox
										boxType={'square'}
										value={this.state.options['other']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('other', !this.state.options['other'])}
									/>
									<View style={common_styles.justifyCenter}><Text>Others</Text></View>
								</View>
								<View style={[common_styles.margin_10]}>
									<Text>Email (*):</Text>
									<Form style={common_styles.margin_t_5}>
										<Item style={styles.contact_email} regular>
											<Input ref='email' returnKeyType = {"done"} onSubmitEditing={Keyboard.dismiss}
						 						keyboardType='email-address' onChange={(event) => this.setState({email : event.nativeEvent.text})} value={this.state.email}/>
										</Item>
									</Form>
								</View>
								<View style={[common_styles.margin_10]}>
									<Text>Message content (*):</Text>
									<Textarea ref='message' rowSpan={5} bordered onChange={(event) => this.setState({message : event.nativeEvent.text})} value={this.state.message}/>
								</View>
								<View style={[common_styles.view_align_center]}>
									<TouchableOpacity style={[common_styles.default_button]} onPress={() => this._send_contact()}>
										<Text style={common_styles.whiteColor}>Send</Text>
									</TouchableOpacity>
								</View>
								{this.state.is_done_sending &&
									<View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
										<Text style={common_styles.greenColor}>Thank you! We will contact you shortly</Text>
									</View>
								}
							</Content>
						</Container>
				);
		}
}

export default Contact;
