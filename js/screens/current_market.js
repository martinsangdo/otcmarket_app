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

const oo_icon = require("../../img/OO_icon.jpg");
const pc_icon = require("../../img/PC_icon.jpg");
const pn_icon = require("../../img/PN_icon.jpg");
const qb_icon = require("../../img/QB_icon.jpg");
const qx_icon = require("../../img/QX_icon.jpg");
const em_icon = require("../../img/EM_icon.jpg");
const pl_icon = require("../../img/PL_icon.jpg");

const Item = Picker.Item;

class CurrentMarket extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				tierGroup: 'ALL',	//ALL, QX, DQ, PS, OO
				loading_indicator_state: false,
				snapshot_data: {},		//general info of market
				data_list: {},
				sortOn: 'dollarVolume',	//dollarVolume, volume, tradeCount
				advancer_priceMin: 1,	//1, 0.05, 0
				decliner_priceMin: 1,	//1, 0.05, 0
				active_part: '',
				current_page: 0,
				can_load_more: true
			};
		}
		//
		componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger','VirtualizedLists should never be nested'];   //don't show warning in app when debugging
			YellowBox.ignoreWarnings([
			  'VirtualizedLists should never be nested', // TODO: Remove when fixed
			]);
      this.setState({
        active_part:this.props.navigation.state.params.active_part,
				tierGroup:this.props.navigation.state.params.tierGroup,
				sortOn: this.props.navigation.state.params.sortOn,
				advancer_priceMin:this.props.navigation.state.params.advancer_priceMin,
				decliner_priceMin:this.props.navigation.state.params.decliner_priceMin,
      }, ()=>{
				this._load_snaphot_market();
				this._open_more_data();
			});
			//
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
		//called when open this page again
		componentDidUpdate(prevProps){
			var prevPropParams = prevProps.navigation;
			var newPropParams = this.props.navigation.state.params;
			//check if any param is updated, load data again
			if (prevPropParams.getParam('tierGroup')!=newPropParams['tierGroup']){
				this.setState({tierGroup: newPropParams['tierGroup']}, ()=>{
					this._load_snaphot_market();
				});
			}
			if (prevPropParams.getParam('active_part')!=newPropParams['active_part'] || prevPropParams.getParam('sortOn')!=newPropParams['sortOn'] ||
					prevPropParams.getParam('advancer_priceMin')!=newPropParams['advancer_priceMin'] || prevPropParams.getParam('decliner_priceMin')!=newPropParams['decliner_priceMin']){
						//reset data
						this.setState({
							active_part: newPropParams['active_part'],
							sortOn: newPropParams['sortOn'],
							advancer_priceMin: newPropParams['advancer_priceMin'],
							decliner_priceMin: newPropParams['decliner_priceMin'],
							loading_indicator_state: false,
							data_list: {},
							current_page: 0,
							can_load_more: true
						}, ()=>{
							this._open_more_data();
						});
			}
		}
		//
		onChangeMarket(newMarket) {
	    this.setState({tierGroup: newMarket}, ()=>{
				this._load_snaphot_market();
				this._open_more_data();
				setTimeout(() => {
					if (this.state.loading_indicator_state){
						this.setState({loading_indicator_state: false});  //stop loading
					}
				}, C_Const.MAX_WAIT_RESPONSE);
			});
	  }
		//
		_get_symbol_icon(tierCode){
			switch (tierCode) {
				case 'OO':
					return oo_icon;
					break;
					case 'PC':
						return pc_icon;
						break;
						case 'PN':
							return pn_icon;
							break;
							case 'QB':
								return qb_icon;
								break;
								case 'QX':
									return qx_icon;
									break;
									case 'EM':
										return em_icon;
										break;
										case 'PL':
											return pl_icon;
											break;
				default:
					return pn_icon;
			}
		}
		//
		_keyExtractor = (item) => item.symbol;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row]} key={item.symbol}>
					<View style={[common_styles.margin_r_5]}>
						<Image source={this._get_symbol_icon(item.tierCode)} style={[styles.stock_ico]}/>
					</View>
					<View style={[styles.td_stock_price_item_first]}>
						<Text>{item.symbol}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{Utils.number_to_float(item.price)}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={[common_styles.float_right, common_styles.blackColor, item.pctChange < 0 && common_styles.redColor]}>{item.pctChange}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{Utils.shorten_big_num(item.dollarVolume)}</Text></View>
				</View>
		);
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
		//
		_load_data(url, cache_time_key, cache_duration){
			var me = this;
			Utils.get_data_from_cache(cache_time_key, cache_duration, url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					Utils.xlog('cached data', cache_data);
					//append to list
					var current_data = me.state.data_list;
					if (current_data['records'] == null){
						me.setState({data_list: cache_data});	//first time load
					} else {
						current_data['records'].push(...cache_data['records']);
						current_data['totalRecords'] = cache_data['totalRecords'];
						me.setState({data_list:current_data});		//append & save back
					}
				} else {
					//get from server
					Utils.xlog('get data from server', url);
					me.setState({loading_indicator_state: true}, () => {
						RequestData.sentGetRequest(url, (detail, error) => {
								if (detail){
									var save_detail = {
										totalRecords: detail['totalRecords'],
										records: detail['records']
									};
									//append to list
									var current_data = me.state.data_list;
									if (current_data['records'] == null){
										me.setState({data_list: save_detail});	//first time load
									} else {
										current_data['records'].push(...detail['records']);
										current_data['totalRecords'] = detail['totalRecords'];
										me.setState({data_list:current_data});		//append & save back
									}
									store.update(url, {d:save_detail});
									store.update(cache_time_key, {t: Utils.get_current_timestamp()});
								} else if (error){
									//do nothing
								}
							});
					});
				}
				me.setState({loading_indicator_state:false});
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
		//next page
		_open_more_data(){
			if (this.state.loading_indicator_state){
				return;
			}
			var me = this;
			this.setState({loading_indicator_state: true, current_page: this.state.current_page+1}, ()=>{
				switch (me.state.active_part) {
					case 'MOST ACTIVE':
						var url = API_URI.CURRENT_MARKET.MOST_ACTIVE.URI + 'tierGroup=' + me.state.tierGroup +
							'&sortOn=' + me.state.sortOn+'&page='+me.state.current_page+'&pageSize='+C_Const.PAGE_LEN;
						this._load_data(url, API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_DURATION);
						break;
						case 'ADVANCERS':
							var url = API_URI.CURRENT_MARKET.ADVANCERS.URI + 'tierGroup=' + me.state.tierGroup +
								'&priceMin=' + me.state.advancer_priceMin+'&page='+me.state.current_page+'&pageSize='+C_Const.PAGE_LEN;
							this._load_data(url, API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_DURATION);
							break;
							case 'DECLINERS':
								var url = API_URI.CURRENT_MARKET.DECLINERS.URI + 'tierGroup=' + me.state.tierGroup +
									'&priceMin=' + me.state.decliner_priceMin+'&page='+me.state.current_page+'&pageSize='+C_Const.PAGE_LEN;
								this._load_data(url, API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_DURATION);
								break;
				}
			});
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>{this.state.active_part}</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<Button
										transparent>
										<Icon name="ios-search" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</Button>
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
								{/* detail */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[styles.td_stock_price_item]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.data_list['records']}
												renderItem={this._renderItem}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={25}
												extraData={this.state}
											/>
								</View>
							{this.state.can_load_more && <View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_data()}>
										<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
									</TouchableOpacity>
								</View>}
							</Content>
						</Container>
				);
		}
}

export default CurrentMarket;
