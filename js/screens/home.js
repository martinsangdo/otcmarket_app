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

class Home extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        is_loading_most_active: true,
        is_loading_advancers: true,
        is_loading_decliners: true,
        index_snapshot_data: [],
				tierGroup: 'ALL',	//ALL, QX, DQ, PS, OO
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
      this._load_index_snapshot();
			this._load_snaphot_market();
			this._load_most_active();
			this._load_advancers();
			this._load_decliners();
			setTimeout(() => {
        this.setState({is_loading_most_active: false, is_loading_advancers: false, is_loading_decliners: false});  //stop loading all
			}, C_Const.MAX_WAIT_RESPONSE);
		}
		//
		onChangeMarket(newMarket) {
      if (newMarket != this.state.tierGroup){
        this.setState({tierGroup: newMarket, is_loading_most_active: true,
            is_loading_advancers: true, is_loading_decliners: true}, ()=>{
  				this._load_snaphot_market();
  				this._load_most_active();
  				this._load_advancers();
  				this._load_decliners();
          setTimeout(() => {
    				this.setState({is_loading_most_active: false, is_loading_advancers: false, is_loading_decliners: false});  //stop loading all
    			}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
	  }
    //
    _load_index_snapshot(){
      var me = this;
			Utils.get_data_from_cache(API_URI.INDEX_SNAPSHOT.CACHE_TIME_KEY, API_URI.CACHE_STOCK_PRICE_DURATION,
				API_URI.INDEX_SNAPSHOT.URI, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({index_snapshot_data: cache_data});
				} else {
					//get from server
          RequestData.sentGetRequest(API_URI.INDEX_SNAPSHOT.URI, (detail, error) => {
              if (detail){
                var index_snapshot_data = [];
                for (var i=0; i<detail.length; i++){
                  index_snapshot_data.push({
                    description: detail[i]['description'],
                    lastSale: Utils.format_currency_thousand(Utils.number_to_float_2(detail[i]['lastSale'])),
                    change: Utils.number_to_float_2(detail[i]['change']),
                    percentChange: Utils.number_to_float_2(detail[i]['percentChange'])
                  });
                }
                me.setState({index_snapshot_data: index_snapshot_data});
                store.update(API_URI.INDEX_SNAPSHOT.URI, {d:index_snapshot_data});
                store.update(API_URI.INDEX_SNAPSHOT.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
              } else if (error){
                //do nothing
              }
            });
				}
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
		//Most active
		_load_most_active(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.MOST_ACTIVE.URI + 'tierGroup=' + this.state.tierGroup +
          '&sortOn=' + this.state.sortOn+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.MOST_ACTIVE.CACHE_TIME_KEY, API_URI.CACHE_STOCK_PRICE_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({active_data: cache_data, is_loading_most_active: false});
				} else {
					//get from server
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
              me.setState({is_loading_most_active: false});
            });
				}
			});
		}
		//
		_load_advancers(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.ADVANCERS.URI + 'tierGroup=' + this.state.tierGroup +
        '&priceMin=' + this.state.advancer_priceMin+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.ADVANCERS.CACHE_TIME_KEY, API_URI.CACHE_STOCK_PRICE_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({advancers_data: cache_data, is_loading_advancers: false});
				} else {
					//get from server
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
              me.setState({is_loading_advancers: false});
            });
				}
			});
		}
		//
		_load_decliners(){
			var me = this;
			var url = API_URI.CURRENT_MARKET.DECLINERS.URI + 'tierGroup=' + this.state.tierGroup +
        '&priceMin=' + this.state.decliner_priceMin+'&page=1&pageSize=15';
			Utils.get_data_from_cache(API_URI.CURRENT_MARKET.DECLINERS.CACHE_TIME_KEY, API_URI.CACHE_STOCK_PRICE_DURATION,
				url, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({decliners_data: cache_data, is_loading_decliners: false});
				} else {
					//get from server
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
              me.setState({is_loading_decliners: false});
            });
				}
			});
		}
		//
		_change_sortOn(newSortOn){
			this.setState({sortOn: newSortOn, is_loading_most_active: true}, ()=>{
				this._load_most_active();
			});
		}
		//
		_change_advancers_priceMin(newPriceMin){
			this.setState({advancer_priceMin: newPriceMin, is_loading_advancers: true}, ()=>{
				this._load_advancers();
			});
		}
		//
		_change_decliners_priceMin(newPriceMin){
			this.setState({decliner_priceMin: newPriceMin, is_loading_decliners: true}, ()=>{
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
    //
		_keyExtractorIndexSnapshot = (item) => item.description;
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItemIndexSnapshot = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.description}>
					<View style={common_styles.width_40p}><Text>{item.description}</Text></View>
					<View style={common_styles.width_20p}><Text style={common_styles.float_right}>{item.lastSale}</Text></View>
					<View style={common_styles.width_20p}><Text style={[common_styles.float_right, styles.positivePriceColor, item.change < 0 && common_styles.redColor]}>{item.change}</Text></View>
					<View style={common_styles.width_20p}><Text style={[common_styles.float_right, styles.positivePriceColor, item.percentChange < 0 && common_styles.redColor]}>{item.percentChange}%</Text></View>
				</View>
		);
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
                <Spinner visible={this.state.is_loading_most_active || this.state.is_loading_advancers || this.state.is_loading_decliners} textStyle={common_styles.whiteColor} />
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>All data in this app delayed 15 minutes</Text>
								</View>
                {/* Index snapshot */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>MARKET INDEX</Text></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
								<View>
									<FlatList
												data={this.state.index_snapshot_data}
												renderItem={this._renderItemIndexSnapshot}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractorIndexSnapshot}
												initialNumToRender={10}
											/>
								</View>
								{/* Snap shot */}
                <View style={common_styles.margin_b_20} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>SNAPSHOT</Text></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
								<View>
  								<Picker
  									mode="dropdown"
  									iosHeader="Select Market"
  									iosIcon={<Icon name="ios-arrow-down" />}
  									style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
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
								{/* Most active */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>MOST ACTIVE</Text></View>
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
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
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
                <View style={common_styles.margin_b_10} />
								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_page('MOST ACTIVE')}>
										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
									</TouchableOpacity>
								</View>
								{/* Advancers */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>ADVANCERS</Text></View>
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
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
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
                <View style={common_styles.margin_b_10} />
								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={() => this._open_more_page('ADVANCERS')}>
										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
									</TouchableOpacity>
								</View>
								{/* Decliners */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>DECLINERS</Text></View>
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
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
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
                <View style={common_styles.margin_b_10} />
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
