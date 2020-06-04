import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../base/BaseScreen.js";
import common_styles from "../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import {C_Const} from '../utils/constant';
import RequestData from '../utils/https/RequestData';

class Home extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				categories: {},
				offset: 0,
				data_list: [],
				is_getting_data: true,
				loading_indicator_state: true,
				isShowMore: false,
				key_list: {}		//to make sure there is no duplicate item in list
			};
		}
		//
		componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
		}
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
									<Button
										transparent
										onPress={() => this.props.navigation.openDrawer()}
									>
										<Icon name="menu" style={styles.home_icon}/>
									</Button>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>Latest Articles</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<Button
										transparent>
										<Icon name="ios-search" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</Button>
								</Right>
							</Header>
							{/* END header */}

			        <View style={{flex:1}}>
			          <Text>abc</Text>
			        </View>

						</Container>
				);
		}
}

export default Home;
