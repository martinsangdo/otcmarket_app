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

class StockFinder extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        current_page: 0,
        totalRecords: 0,
        data_list:[],
        filter: {},
        can_load_more: true
			};
		}
		//
		componentDidMount() {
      this._load_data();
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
    //
    _load_data(){
      if (this.state.loading_indicator_state){
        return;
      }
      var me = this;
			var url = API_URI.STOCK_FINDER.SEARCH.replace(/<page_index>/g, this.state.current_page);
      Utils.xlog('url', url);
      this.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var rawDataJson = JSON.parse(detail);
              Utils.xlog('detail', rawDataJson);
              if (rawDataJson['stocks'] != null){
                var len = rawDataJson['stocks'].length;
                var new_list = [];
                for (var i=0; i<len; i++){
                  var item = rawDataJson['stocks'][i];
                  new_list.push({
                    id: item['securityId'],
                    symbol: item['symbol'],
                    securityName: item['securityName'],
                    market: item['market'],
                    securityType: item['securityType'],
                    country: item['state']+', '+item['country'],
                    price: Utils.number_to_float_2(item['price']),
                    pct1Day: item['pct1Day']!=null?Utils.number_to_float_2(item['pct1Day']*100):'',
                    volume: Utils.format_currency_thousand(item['volume']),
                    penny: item['penny']?'Yes':'No',
                    dividendYield: item['dividendYield'],
                    shortInterest: Utils.format_currency_thousand(item['shortInterest']),
                    shortInterestRatio: item['shortInterestRatio']*100,
                    isBank: item['isBank']
                  });
                }
                var current_data = me.state.data_list;
                current_data.push(...new_list);
                Utils.xlog('new list', current_data);
                me.setState({data_list: current_data});
              }
              me.setState({totalRecords: Utils.format_currency_thousand(rawDataJson['count'])});
            } else if (error){
              //do nothing
            }
            me.setState({loading_indicator_state: false});
          });
      });
    }
    //
    _open_more_data(){
			if (this.state.loading_indicator_state){
				return;
			}
    }
    //
		_keyExtractor = (item) => item.symbol+Math.random()+'';
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_25p_first]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.price}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={[common_styles.float_right]}>{item.pct1Day}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.volume}</Text></View>
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>StockFinder</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<TouchableOpacity style={common_styles.margin_r_20}>
										<Icon name="ios-search" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</TouchableOpacity>
                  <TouchableOpacity onPress={() => this._check_login()}>
                    <View style={[common_styles.float_center]}>
                      <Icon name="md-download" style={common_styles.default_font_color}/>
                    </View>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                <View style={common_styles.margin_b_10} />
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Total Securities: {this.state.totalRecords}</Text>
								</View>
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
                  <View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>VOL</Text></View>
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
  										<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
  									</TouchableOpacity>
  								</View>
                }
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default StockFinder;
