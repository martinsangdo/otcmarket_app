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
import MyText from '../component/MyText';

const Item = Picker.Item;

class StockFinder extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        current_page: 0,
        totalRecords: 0,
        data_list:[],
        controls: {},
        showing_detail_symbols: {},   //default no any symbol showing its detail
        can_load_more: true,
        is_loaded_controls: false,
        advanced_options: ''  //search params
			};
		}
		//
		componentDidMount() {
      this._load_controls();
      this._load_data();
		}
    //
    _load_data(){
      var me = this;
			var url = API_URI.STOCK_FINDER.SEARCH.replace(/<page_index>/g, this.state.current_page) + this.state.advanced_options;
      // Utils.xlog('url', url);
      this.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var rawDataJson = JSON.parse(detail);
              // Utils.xlog('detail', rawDataJson);
              if (rawDataJson['stocks'] != null){
                var len = rawDataJson['stocks'].length;
                var new_list = [];
                for (var i=0; i<len; i++){
                  var item = rawDataJson['stocks'][i];
                  new_list.push({
                    id: item['securityId'],
                    symbol: item['symbol'],
                    securityName: item['securityName'],
                    market: Utils.getNullableString(item['market']),
                    securityType: Utils.getNullableString(item['securityType']),
                    country: Utils.getNullableString(item['state'])+' ' +Utils.getNullableString(item['country']),
                    price: Utils.number_to_float_2(item['price']),
                    pct1Day: item['pct1Day']!=null?Utils.number_to_float_2(item['pct1Day']*100):'',
                    volume: Utils.format_currency_thousand(item['volume']),
                    penny: item['penny']?'Yes':'No',
                    dividendYield: Utils.getNullableString(item['dividendYield']),
                    shortInterest: Utils.format_currency_thousand(item['shortInterest']),
                    shortInterestRatio: (item['shortInterestRatio']!=null)?Utils.number_to_float_2(item['shortInterestRatio']*100):'',
                    isBank: item['isBank']
                  });
                }
                if (me.state.current_page > 0){
                  var current_data = me.state.data_list;
                  current_data.push(...new_list); //append
                } else {
                  var current_data = new_list;
                }
                me.setState({data_list: current_data});
              }
              me.setState({totalRecords: Utils.format_currency_thousand(rawDataJson['count']),
                can_load_more: rawDataJson['count'] > current_data.length });
            } else if (error){
              //do nothing
            }
            me.setState({loading_indicator_state: false});
          });
      });
    }
    //
    _load_controls(){
      var me = this;
      Utils.get_data_from_cache(API_URI.STOCK_FINDER.GET_FILTERS.CACHE_TIME_KEY, API_URI.STOCK_FINDER.GET_FILTERS.CACHE_TIME_DURATION,
          API_URI.STOCK_FINDER.GET_FILTERS.URL, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
					me.setState({controls: cache_data, is_loaded_controls: true});
				} else {
          //load from server
          RequestData.sentGetRequest(API_URI.STOCK_FINDER.GET_FILTERS.URL, (detail, error) => {
            if (detail){
              var rawDataJson = JSON.parse(detail);
              store.update(API_URI.STOCK_FINDER.GET_FILTERS.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
              store.update(API_URI.STOCK_FINDER.GET_FILTERS.URL, {d: rawDataJson});
              me.setState({controls: rawDataJson, is_loaded_controls: true});
            } else {
              //error
            }
          });
        }
      });
    }
    //
    _open_more_data(){
			if (this.state.loading_indicator_state){
				return;
			}
      this.setState({current_page: this.state.current_page+1}, ()=>{
        this._load_data();
      });
    }
    //
    _toogle_showing_detail(symbol){
      var showing_detail_symbols = this.state.showing_detail_symbols;
      if (showing_detail_symbols[symbol]){
        showing_detail_symbols[symbol] = false;
      } else {
        showing_detail_symbols[symbol] = true;
      }
      this.setState({showing_detail_symbols: showing_detail_symbols});
    }
    //
		_keyExtractor = (item) => item.symbol+Math.random()+'';
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItem = ({item}) => (
      <View style={[common_styles.border_b_gray]}>
				<View style={[styles.list_item, common_styles.fetch_row]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_25p_first]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.price}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={[common_styles.float_right]}>{item.pct1Day}</MyText></View>
					<View style={[common_styles.width_20p]}>
            <TouchableOpacity
              onPress={() => this._toogle_showing_detail(item.symbol)}
            >
              <MyText style={common_styles.float_right}>{item.volume}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_5p, common_styles.margin_l_5, common_styles.margin_r_5]}>
            <TouchableOpacity
              onPress={() => this._toogle_showing_detail(item.symbol)}
            >
              {
                !this.state.showing_detail_symbols[item.symbol] &&
                <Icon name="ios-arrow-down" style={[common_styles.greenColor, common_styles.font_20]}/>
              }
              {
                this.state.showing_detail_symbols[item.symbol] &&
                <Icon name="ios-arrow-up" style={[common_styles.greenColor, common_styles.font_20, common_styles.margin_l_5]}/>
              }
            </TouchableOpacity>
          </View>
				</View>
        {
          this.state.showing_detail_symbols[item.symbol] &&
          <View>
            <View style={[common_styles.fetch_row, common_styles.margin_5]}>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>NAME</MyText>
              <MyText style={common_styles.width_75p}>{item.securityName}</MyText>
            </View>
            <View style={[common_styles.fetch_row, common_styles.margin_5]}>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>MARKET</MyText>
              <MyText style={common_styles.width_75p}>{item.market}</MyText>
            </View>
            <View style={[common_styles.fetch_row, common_styles.margin_5]}>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>SEC TYPE</MyText>
              <MyText style={common_styles.width_75p}>{item.securityType}</MyText>
            </View>
            <View style={[common_styles.fetch_row, common_styles.margin_5]}>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>COUNTRY</MyText>
              <MyText style={common_styles.width_50p}>{item.country}</MyText>
              <View style={[common_styles.width_25p, common_styles.flex_row]}><MyText style={[common_styles.bold, common_styles.margin_r_10]}>BANK</MyText><MyText>{item.isBank}</MyText></View>
            </View>
            <View style={[common_styles.fetch_row, common_styles.margin_5]}>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>SHORT INT</MyText>
              <MyText style={common_styles.width_25p}>{item.shortInterest}</MyText>
              <MyText style={[common_styles.width_25p, common_styles.bold]}>SHORT %</MyText>
              <MyText style={common_styles.width_25p}>{item.shortInterestRatio}</MyText>
            </View>
          </View>
        }
      </View>
		);
    //
    _show_controls=()=>{
      this.props.navigation.navigate('StockFinderControls', {
        controls: this.state.controls,
        _on_search_advance: this._on_search_advance
			});
    }
    //called from another page
    _on_search_advance=(new_options)=>{
      if (this.state.advanced_options != new_options){
        this.setState({advanced_options: new_options, current_page: 0}, ()=>{
          this._load_data();
        });
      }
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
								<Body style={common_styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color]}>Stock Finder</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
                  {
                    this.state.is_loaded_controls &&
                    <TouchableOpacity style={common_styles.margin_r_20} onPress={() => this._show_controls()}>
  										<Icon name="ios-search" style={[common_styles.header_icon, common_styles.greenColor]}/>
  									</TouchableOpacity>
                  }
                  <TouchableOpacity onPress={() => this._check_login()}>
                    <View style={[common_styles.float_center]}>
                      <Icon name="md-download" style={common_styles.default_font_color}/>
                    </View>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>VOL</MyText></View>
                  <View style={[common_styles.width_5p]}></View>
                </View>
                <View>
									<FlatList
												data={this.state.data_list}
												renderItem={this._renderItem}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={25}
												extraData={this.state}
											/>
								</View>
  							{this.state.can_load_more && <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
  									<TouchableOpacity onPress={() => this._open_more_data()}>
  										<MyText style={common_styles.darkGrayColor}>LOAD MORE >></MyText>
  									</TouchableOpacity>
  								</View>
                }
                <View style={common_styles.margin_b_10} />
                <View style={common_styles.view_align_center}>
									<MyText style={common_styles.darkGrayColor}>Displaying {this.state.data_list.length} of {this.state.totalRecords} items</MyText>
								</View>
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default StockFinder;
