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
import Spinner from 'react-native-loading-spinner-overlay';

const Item = Picker.Item;

class CurrentMarket extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
				tierGroup: 'ALL',	//ALL, QX, DQ, PS, OO
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
      if (newMarket != this.state.tierGroup){
  	    this.setState({tierGroup: newMarket, current_page:0, data_list:{}}, ()=>{
  				this._load_snaphot_market();
  				this._open_more_data();
  				setTimeout(() => {
  					if (this.state.loading_indicator_state){
  						this.setState({loading_indicator_state: false});  //stop loading
  					}
  				}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
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
                var save_detail = {
                  dollarVolume: Utils.format_currency_thousand(detail['dollarVolume']),
                  shareVolume: Utils.format_currency_thousand(detail['shareVolume']),
                  trades: Utils.format_currency_thousand(detail['trades']),
                  advancers: Utils.format_currency_thousand(detail['advancers']),
                  decliners: Utils.format_currency_thousand(detail['decliners'])
                };

                me.setState({snapshot_data: save_detail});
                store.update(url, {d:save_detail});
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
						me.setState({data_list:current_data, can_load_more:current_data['totalRecords'] > current_data['records'].length });		//append & save back
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
										me.setState({data_list:current_data, can_load_more:current_data['totalRecords'] > current_data['records'].length});		//append & save back
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
      var me = this;
			this.setState({sortOn: newSortOn, current_page:1, data_list:{}}, ()=>{
        var url = API_URI.CURRENT_MARKET.MOST_ACTIVE.URI + 'tierGroup=' + me.state.tierGroup +
          '&sortOn=' + newSortOn+'&page=1&pageSize='+C_Const.PAGE_LEN;
        this._load_data(url, API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_DURATION);
			});
		}
		//
		_change_advancers_priceMin(newPriceMin){
      var me = this;
			this.setState({advancer_priceMin: newPriceMin, current_page:1, data_list:{}}, ()=>{
        var url = API_URI.CURRENT_MARKET.ADVANCERS.URI + 'tierGroup=' + me.state.tierGroup +
          '&priceMin=' + newPriceMin+'&page=1&pageSize='+C_Const.PAGE_LEN;
        this._load_data(url, API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_DURATION);
			});
		}
		//
		_change_decliners_priceMin(newPriceMin){
      var me = this;
			this.setState({decliner_priceMin: newPriceMin, current_page:1, data_list:{}}, ()=>{
        var url = API_URI.CURRENT_MARKET.DECLINERS.URI + 'tierGroup=' + me.state.tierGroup +
          '&priceMin=' + newPriceMin+'&page=1&pageSize='+C_Const.PAGE_LEN;
        this._load_data(url, API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_KEY, API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_DURATION);
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
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
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
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>$ VOLUME</Text>
                            <Text>{this.state.snapshot_data['dollarVolume']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>SHARE VOLUME</Text>
                            <Text>{this.state.snapshot_data['shareVolume']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>TRADES</Text>
                            <Text>{this.state.snapshot_data['trades']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>ADVANCERS</Text>
                            <Text>{this.state.snapshot_data['advancers']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>DECLINERS</Text>
                            <Text>{this.state.snapshot_data['decliners']}</Text>
                          </View>
                        </View>
                      </Body>
				            </CardItem>
				          </Card>
								</View>
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Tap stock symbol to view detail</Text>
								</View>
								{/* detail */}
								<View style={common_styles.margin_b_10} />
                {this.state.active_part=='MOST ACTIVE' &&
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
                }
                {this.state.active_part=='ADVANCERS' &&
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
                }
                {this.state.active_part=='DECLINERS' &&
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
                }
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
