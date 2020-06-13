/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, ScrollView} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon} from "native-base";
import styles from "./style";    //CSS defined here
import common_styles from "../../css/common";
import BaseScreen from "../base/BaseScreen.js";
import RequestData from '../utils/https/RequestData';
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import CheckBox from '@react-native-community/checkbox';

class StockFinderControls extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			controls: {}
		};
	}

	componentDidMount() {
		// this.setState({
		// 	controls: this.props.navigation.state.params.controls
		// });
		var me = this;
		RequestData.sentGetRequest(API_URI.STOCK_FINDER.GET_FILTERS.URL, (detail, error) => {
			if (detail){
				var rawDataJson = JSON.parse(detail);
				Utils.xlog('controls', rawDataJson);
				me.setState({controls: rawDataJson});
			} else {
				//error
			}
		});
  }
	//
	_reset_all(){

	}
	//
	_toogle_options(key){

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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Advanced Settings</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
									<TouchableOpacity onPress={() => this._reset_all()}>
										<Text uppercase={false} style={[common_styles.default_font_color]}>Reset all</Text>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
              <Content>
								{/* Market */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}>
									<Text style={[common_styles.heading_1]}>MARKETS</Text>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>

								<View style={{height: 200}} >
				          <ScrollView>
										<CheckBox
											disabled={false}
											value={false}
											style={{width:20,height:20, margin:5}}
											onValueChange={() => this._toogle_options()}
										/>
				          </ScrollView>
				        </View>
							</Content>
						</Container>
				);
		}
}

export default StockFinderControls;
