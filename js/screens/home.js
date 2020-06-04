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
import store from 'react-native-simple-store';

class Home extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				loading_indicator_state: true,
				snapshot_data: {}		//general info of market
			};
		}
		//
		componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
			this._load_snaphot_market();
		}
		//snapshot
		_load_snaphot_market(){
			var me = this;
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_DURATION,
				API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_DATA_KEY, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					Utils.xlog('cache data', cache_data);
				} else {
					//get from server
					me._fetch_snapshot_market();
				}
			});
		}
		//
		_fetch_snapshot_market(){
			var me = this;
			this.setState({loading_indicator_state: true}, () => {
				Utils.dlog('Begin get snapshot from server');
				RequestData.sentGetRequest(API_URI.CURRENT_MARKET.SNAPSHOT.URI,
					(detail, error) => {
						Utils.xlog('detail', detail);
						Utils.xlog('error', error);
						if (detail){
							me.setState({snapshot_data: detail});
							store.update(API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_DATA_KEY, {d:detail});
							store.update(API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
						} else if (error){
							//do nothing
						}
						me.setState({loading_indicator_state: false});
					});
			});
			//timeout of waiting request
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
									<Button
										transparent
										onPress={() => this.props.navigation.openDrawer()}
									>
										<Icon name="menu" style={styles.home_icon}/>
									</Button>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>Market Update</Text>
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
