/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, Dimensions} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon} from "native-base";
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

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height - 50;

class WebViewer extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			url: '',
			web_data: '',
			loading_indicator_state: true,
			pure_link: false
		};
	}

	componentDidMount() {
		var me = this;
		this.setState({
			url: this.props.navigation.state.params.url,
			pure_link: this.props.navigation.state.params.pure_link
		}, ()=>{
			if (!me.props.navigation.state.params.pure_link){
				me._load_data();
			}
		});
		setTimeout(() => {
			if (this.state.loading_indicator_state){
				this.setState({loading_indicator_state: false});  //stop loading
			}
		}, C_Const.MAX_WAIT_RESPONSE);
  }
	componentDidUpdate(prevProps){
		var prevPropParams = prevProps.navigation;
		var newPropParams = this.props.navigation.state.params;
		//check if any param is updated, load data again
		if (prevPropParams.getParam('url') != newPropParams['url']){
			this.setState({
				url: newPropParams['url'],
				web_data: '',
				pure_link: newPropParams['pure_link'],
				loading_indicator_state: true
			}, ()=>{
				if (!newPropParams['pure_link']){
					this._load_data();
				}
			});
		}
		setTimeout(() => {
			if (this.state.loading_indicator_state){
				this.setState({loading_indicator_state: false});  //stop loading
			}
		}, C_Const.MAX_WAIT_RESPONSE);
	}
	//
	_load_data(){
		var me = this;
		RequestData.sentGetRequestWithHeader(this.state.url, API_URI.HTML_REQUEST_HEADER, (detail, error) => {
			if (detail){
				var new_html = detail.replace(/<\/head>/g, '<meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>');
				me.setState({web_data: new_html});
			} else if (error){
				Toast.show('No resource is available for this item!');
			}
		});
	}
	//
	_onLoadEnd = () =>{
		this.setState({loading_indicator_state: false});
	}
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.3}]}>
									<TouchableOpacity onPress={() => this._on_go_back()}>
										<View style={styles.left_row}>
											<View style={[common_styles.float_center]}>
												<Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
											</View>
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<Text uppercase={false} style={[common_styles.default_font_color]}>Back</Text>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Viewer</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
								<View>
									{
										this.state.pure_link &&
										<WebView style={{height:deviceHeight}} source={{ uri: this.state.url}}
											onLoadEnd={()=>{this._onLoadEnd()}}
										/>
									}
									{
										!this.state.pure_link &&
										<WebView style={{height:deviceHeight}} source={{ html: this.state.web_data}}
											onLoadEnd={()=>{this._onLoadEnd()}}
										/>
									}
								</View>
							</Content>
						</Container>
				);
		}
}

export default WebViewer;
