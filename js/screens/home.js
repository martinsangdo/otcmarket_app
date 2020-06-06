import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Card,
  CardItem, Picker} from "native-base";

import BaseScreen from "../base/BaseScreen.js";
import common_styles from "../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import {C_Const} from '../utils/constant';
import RequestData from '../utils/https/RequestData';
import store from 'react-native-simple-store';

const Item = Picker.Item;

class Home extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				tierGroup: 'ALL',	//ALL, QX, DQ, PS, OO
				loading_indicator_state: true,
				snapshot_data: {},		//general info of market
				active_data: {},
				advancers_data: {},
				decliners_data: {},
				sortOn: 'dollarVolume',	//dollarVolume, volume, tradeCount
				advancer_priceMin: 1,	//1, 0.05, 0
				decliner_priceMin: 1	//1, 0.05, 0
			};
		}
		//
		componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
			YellowBox.ignoreWarnings([
			  'VirtualizedLists should never be nested', // TODO: Remove when fixed
			]);
			this._load_snaphot_market();
			this._load_most_active();
			this._load_advancers();
			this._load_decliners();
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
		//
		onChangeMarket(newMarket) {
	    this.setState({tierGroup: newMarket}, ()=>{
				this._load_snaphot_market();
				this._load_most_active();
				this._load_advancers();
				this._load_decliners();
				setTimeout(() => {
					if (this.state.loading_indicator_state){
						this.setState({loading_indicator_state: false});  //stop loading
					}
				}, C_Const.MAX_WAIT_RESPONSE);
			});
	  }
		//general info
		_load_snaphot_market(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.SNAPSHOT.URI + this.state.tierGroup;
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({snapshot_data: cache_data});
				} else {
					//get from server
          RequestData.sentGetRequest(url, (detail, error) => {
              if (detail){
                me.setState({snapshot_data: detail});
                store.update(url, {d:detail});
                store.update(API_URI.CURRENT_MARKET.SNAPSHOT.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
              } else if (error){
                //do nothing
              }
            });
				}
			});
		}
		//Most active
		_load_most_active(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.MOST_ACTIVE.URI + 'tierGroup=' + this.state.tierGroup +
          '&sortOn=' + this.state.sortOn+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					Utils.xlog('cached active data', cache_data);
					me.setState({active_data: cache_data});
				} else {
					//get from server
					Utils.xlog('get active data from server', url);
					me.setState({loading_indicator_state: true}, () => {
						RequestData.sentGetRequest(url, (detail, error) => {
								if (detail){
									var save_detail = {
										totalRecords: detail['totalRecords'],
										records: detail['records']
									};
									me.setState({active_data: save_detail});
									store.update(url, {d:save_detail});
									store.update(API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
								} else if (error){
									//do nothing
								}
							});
					});
				}
			});
		}
		//
		_load_advancers(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.ADVANCERS.URI + 'tierGroup=' + this.state.tierGroup +
        '&priceMin=' + this.state.advancer_priceMin+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					Utils.xlog('cached advancers data', cache_data);
					me.setState({advancers_data: cache_data});
				} else {
					//get from server
					Utils.xlog('get advancers data from server', url);
					me.setState({loading_indicator_state: true}, () => {
						RequestData.sentGetRequest(url, (detail, error) => {
								if (detail){
									var save_detail = {
										totalRecords: detail['totalRecords'],
										records: detail['records']
									};
									me.setState({advancers_data: save_detail});
									store.update(url, {d:save_detail});
									store.update(API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
								} else if (error){
									//do nothing
								}
							});
					});
				}
			});
		}
		//
		_load_decliners(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.DECLINERS.URI + 'tierGroup=' + this.state.tierGroup +
        '&priceMin=' + this.state.decliner_priceMin+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					Utils.xlog('cached decliner data', cache_data);
					me.setState({decliners_data: cache_data});
				} else {
					//get from server
					Utils.xlog('get decliner data from server', url);
					me.setState({loading_indicator_state: true}, () => {
						RequestData.sentGetRequest(url, (detail, error) => {
								if (detail){
									var save_detail = {
										totalRecords: detail['totalRecords'],
										records: detail['records']
									};
									me.setState({decliners_data: save_detail});
									store.update(url, {d:save_detail});
									store.update(API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
								} else if (error){
									//do nothing
								}
							});
					});
				}
			});
		}
		//
		_change_sortOn(newSortOn){
			this.setState({sortOn: newSortOn}, ()=>{
				this._load_most_active();
			});
		}
		//
		_change_advancers_priceMin(newPriceMin){
			this.setState({advancer_priceMin: newPriceMin}, ()=>{
				this._load_advancers();
			});
		}
		//
		_change_decliners_priceMin(newPriceMin){
			this.setState({decliner_priceMin: newPriceMin}, ()=>{
				this._load_decliners();
			});
		}
		//
		_open_more_page(active_part){
      this.props.navigation.navigate('CurrentMarket', {
				active_part: active_part,
        tierGroup: this.state.tierGroup,
        sortOn: this.state.sortOn,
        advancer_priceMin: this.state.advancer_priceMin,
        decliner_priceMin: this.state.decliner_priceMin
			});
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Market Update</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<TouchableOpacity style={common_styles.margin_r_20}>
										<Icon name="ios-search" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</TouchableOpacity>
                  <TouchableOpacity>
										<Icon name="md-bookmark" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								{/* Snap shot */}
								<View>
								<Picker
									mode="dropdown"
									iosHeader="Select Market"
									iosIcon={<Icon name="ios-arrow-down" />}
									style={{ width: undefined }}
									selectedValue={this.state.tierGroup}
									onValueChange={this.onChangeMarket.bind(this)}
								>
									<Item label="All Markets" value="ALL" />
									<Item label="OTCQX" value="QX" />
									<Item label="OTCQB" value="DQ" />
									<Item label="Pink" value="PS" />
									<Item label="Grey" value="OO" />
								</Picker>
								</View>
								<View style={common_styles.margin_10}>
									<Card>
				            <CardItem>
				              <Body>
												<View style={[common_styles.flex_row, common_styles.padding_5]}>
													<View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor]}>$ VOLUME</Text></View>
													<View style={common_styles.width_50p}><Text>{Utils.format_currency_thousand(this.state.snapshot_data['dollarVolume'])}</Text></View>
												</View>
												<View style={[common_styles.flex_row, common_styles.padding_5]}>
													<View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor]}>SHARE VOLUME</Text></View>
													<View style={common_styles.width_50p}><Text>{Utils.format_currency_thousand(this.state.snapshot_data['shareVolume'])}</Text></View>
												</View>
												<View style={[common_styles.flex_row, common_styles.padding_5]}>
													<View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor]}>TRADES</Text></View>
													<View style={common_styles.width_50p}><Text>{Utils.format_currency_thousand(this.state.snapshot_data['trades'])}</Text></View>
												</View>
												<View style={[common_styles.flex_row, common_styles.padding_5]}>
													<View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor]}>ADVANCERS</Text></View>
													<View style={common_styles.width_50p}><Text>{Utils.format_currency_thousand(this.state.snapshot_data['advancers'])}</Text></View>
												</View>
												<View style={[common_styles.flex_row, common_styles.padding_5]}>
													<View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor]}>DECLINERS</Text></View>
													<View style={common_styles.width_50p}><Text>{Utils.format_currency_thousand(this.state.snapshot_data['decliners'])}</Text></View>
												</View>
				              </Body>
				            </CardItem>
				          </Card>
								</View>
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Tap stock symbol to view detail</Text>
								</View>
								{/* Most active */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.bold, common_styles.font_20]}>MOST ACTIVE</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_sortOn('dollarVolume')}>
				          	<View style={[common_styles.padding_5, this.state.sortOn=='dollarVolume'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==1&&common_styles.bold]}>$ Volume</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_sortOn('volume')}>
										<View style={[common_styles.padding_5, this.state.sortOn=='volume'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==0.05&&common_styles.bold]}>Share Volume</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_sortOn('tradeCount')}>
										<View style={[common_styles.padding_5, this.state.sortOn=='tradeCount'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==0&&common_styles.bold]}>Trades</Text></View>
									</TouchableOpacity>
				        </View>
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[styles.td_stock_price_item]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.active_data['records']}
												renderItem={this._renderItem}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
											/>
								</View>
								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_page('MOST ACTIVE')}>
										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
									</TouchableOpacity>
								</View>
								{/* Advancers */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.bold, common_styles.font_20]}>ADVANCERS</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_advancers_priceMin(1)}>
				          	<View style={[common_styles.padding_5, this.state.advancer_priceMin==1&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.advancer_priceMin==1&&common_styles.bold]}>Over $1</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_advancers_priceMin(0.05)}>
										<View style={[common_styles.padding_5, this.state.advancer_priceMin==0.05&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.advancer_priceMin==0.05&&common_styles.bold]}>Over $0.05</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_advancers_priceMin(0)}>
										<View style={[common_styles.padding_5, this.state.advancer_priceMin==0&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.advancer_priceMin==0&&common_styles.bold]}>All</Text></View>
									</TouchableOpacity>
				        </View>
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[styles.td_stock_price_item]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.advancers_data['records']}
												renderItem={this._renderItem}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
											/>
								</View>
								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_page('ADVANCERS')}>
										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
									</TouchableOpacity>
								</View>
								{/* Decliners */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.bold, common_styles.font_20]}>DECLINERS</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_decliners_priceMin(1)}>
				          	<View style={[common_styles.padding_5, this.state.decliner_priceMin==1&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.decliner_priceMin==1&&common_styles.bold]}>Over $1</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_decliners_priceMin(0.05)}>
										<View style={[common_styles.padding_5, this.state.decliner_priceMin==0.05&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.decliner_priceMin==0.05&&common_styles.bold]}>Over $0.05</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_decliners_priceMin(0)}>
										<View style={[common_styles.padding_5, this.state.decliner_priceMin==0&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.decliner_priceMin==0&&common_styles.bold]}>All</Text></View>
									</TouchableOpacity>
				        </View>
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[styles.td_stock_price_item]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.decliners_data['records']}
												renderItem={this._renderItem}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
											/>
								</View>
								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_page('DECLINERS')}>
										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
									</TouchableOpacity>
								</View>
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default Home;
