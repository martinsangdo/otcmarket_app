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

class StockDetail extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				loading_indicator_state: false,
				symbol:'',
        quote_data:{
          general: {},
          real_time_level_2: {},
          trade: {},
          short_interest: {}
        }
			};
		}
		//
		componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
			YellowBox.ignoreWarnings([
			  'VirtualizedLists should never be nested', // TODO: Remove when fixed
			]);
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_quote();
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
      if (prevPropParams.getParam('symbol') != newPropParams['symbol']){
        this.setState({symbol: newPropParams['symbol']}, ()=>{
          this._load_quote();
        });
      }
		}
    //
    _load_quote(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.QUOTE.GENERAL.replace('<symbol>', this.state.symbol);
      //general
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var save_detail = {
            open: detail['openingPrice'],
            daily_range: detail['dailyLow'] + ' - ' + detail['dailyHigh'],
            volume: Utils.format_currency_thousand(detail['volume']),
            dividend: Utils.getNullableString(detail['dividend']),
            prev_close: detail['previousClose'],
            wk_range: detail['annualLow'] + ' - ' + detail['annualHigh'],
            average_vol: Utils.format_currency_thousand(Math.round(detail['thirtyDaysAvgVol'])),
            net_dividend: Utils.getNullableString(detail['yield']),
            best_bid: detail['bidPrice'] + ' x ' + detail['bidSize'],
            best_ask: detail['askPrice'] + ' x ' + detail['askSize'],
            market_cap: Utils.format_currency_thousand(detail['marketCap']),
            shares_out: Utils.format_currency_thousand(detail['sharesOutstanding'])
          };
          Utils.dlog(save_detail);
          me.setState({quote_data: {...me.state.quote_data, general: save_detail}});
        } else if (error){
          //do nothing
        }
      });
      //Real time level 2

      //Trade data

      //Short interest
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>{this.state.symbol}</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
              <Content>
                <View style={common_styles.margin_10}>
                  <Card>
                    <CardItem>
                      <Body>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>OPEN</Text>
                            <Text>{this.state.quote_data['general']['open']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>DAILY RANGE</Text>
                            <Text>{this.state.quote_data['general']['daily_range']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>VOLUME</Text>
                            <Text>{this.state.quote_data['general']['volume']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>DEVIDEND</Text>
                            <Text>{this.state.quote_data['general']['dividend']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>PREV CLOSE</Text>
                            <Text>{this.state.quote_data['general']['prev_close']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>52WK RANGE</Text>
                            <Text>{this.state.quote_data['general']['wk_range']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>AVERAGE VOL (30D)</Text>
                            <Text>{this.state.quote_data['general']['average_vol']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>NET DIVIDENT YIELD</Text>
                            <Text>{this.state.quote_data['general']['net_dividend']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>BEST BID</Text>
                            <Text>{this.state.quote_data['general']['best_bid']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>BEST ASK</Text>
                            <Text>{this.state.quote_data['general']['best_ask']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>MARKET CAP</Text>
                            <Text>{this.state.quote_data['general']['market_cap']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>SHARES OUT</Text>
                            <Text>{this.state.quote_data['general']['shares_out']}</Text>
                          </View>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>

              </Content>
						</Container>
				);
		}
}

export default StockDetail;
