import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Card,
  CardItem, Picker} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./../style";    //CSS defined here
import {API_URI} from '../../utils/api_uri';
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import RequestData from '../../utils/https/RequestData';
import store from 'react-native-simple-store';

const Item = Picker.Item;

class StockDetailQuote extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        symbol:'',  //current stock
        current_detail_part: 'quote',
        current_quote: 'bid',
        quote_data:{
          general: {},
          real_time_level_2: {},
          trade: {},
          short_interest: {}
        },
        bid_quote:[],
        ask_quote:[]
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_quote();
			});
      //todo: check bookmark
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
          me.setState({quote_data: {...me.state.quote_data, general: save_detail}});
        } else if (error){
          //do nothing
        }
      });
      //Real time level 2
      var urlQuote = API_URI.STOCK_DETAIL.QUOTE.REAL_TIME_LEVEL_2.replace('<symbol>', this.state.symbol);
      RequestData.sentGetRequest(urlQuote, (detail, error) => {
        if (detail){
          var bid_data = detail['montageBuyList'];
          if (bid_data != null){
            var bid_quote = [];
            for (var i=0; i<bid_data.length; i++){
              bid_quote.push({
                priceDisplay: bid_data[i]['priceDisplay'],
                mmIdDisplay: bid_data[i]['mmIdDisplay'],
                mmId: bid_data[i]['mmId'],
                sizeDisplay: bid_data[i]['sizeDisplay'],
                transTimeDisplay: bid_data[i]['transTimeDisplay']
              });
            }
            me.setState({bid_quote: bid_quote});
          }
            //
            var ask_data = detail['montageSellList'];
            if (ask_data != null){
              var ask_quote = [];
              for (var i=0; i<ask_data.length; i++){
                ask_quote.push({
                  priceDisplay: ask_data[i]['priceDisplay'],
                  mmIdDisplay: ask_data[i]['mmIdDisplay'],
                  mmId: ask_data[i]['mmId'],
                  sizeDisplay: ask_data[i]['sizeDisplay'],
                  transTimeDisplay: ask_data[i]['transTimeDisplay']
                });
              }
              me.setState({ask_quote: ask_quote});
          }
        } else if (error){
          //do nothing
        }
      });
      //Trade data

      //Short interest
    }
    //when user wants to see another part of stock detail
    onChangePart = (new_part) => {
      //move to new page
      switch (new_part) {
        case 'quote':
          this.props.navigation.navigate('StockDetailQuote', {symbol: this.state.symbol});
          break;

      }
    }
    //real time level 2
    _change_quote(new_quote){
      this.setState({current_quote: new_quote});
    }
    //
		_keyExtractorQuote = (item) => item.mmId;
		//render the list. MUST use "item" as param
		_renderItemQuote = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.mmId}>
					<View style={[styles.td_stock_price_item]}>
            <Text>{item.mmId}</Text>
          </View>
					<View style={[styles.td_stock_price_item]}><Text style={[common_styles.float_right]}>{item.priceDisplay}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{item.sizeDisplay}</Text></View>
          <View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{item.transTimeDisplay}</Text></View>
				</View>
		);
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
                  <TouchableOpacity>
                    <Icon name="md-bookmark" style={[common_styles.header_icon]}/>
                  </TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
              <View>
                <Picker
                  mode="dropdown"
                  iosHeader="Select Info"
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={this.state.current_detail_part}
                  onValueChange={(newval)=>{this.onChangePart(newval)}}
                >
                  <Item label="Quote" value="quote" />
                  <Item label="Overview" value="overview" />
                  <Item label="Company Profile" value="company_profile" />
                  <Item label="Security Details" value="security_details" />
                  <Item label="News" value="news" />
                  <Item label="Financials" value="financials" />
                  <Item label="Disclosure" value="disclosure" />
                  <Item label="Research" value="research" />
                </Picker>
              </View>
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
                <View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.bold, common_styles.font_20]}>REAL-TIME LEVEL 2 QUOTE</Text></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_quote('bid')}>
				          	<View style={[common_styles.padding_5, common_styles.margin_r_20, this.state.current_quote=='bid'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==1&&common_styles.bold]}>BID</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_quote('ask')}>
										<View style={[common_styles.padding_5, this.state.current_quote=='ask'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==0.05&&common_styles.bold]}>ASK</Text></View>
									</TouchableOpacity>
				        </View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>MPID</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={styles.td_stock_price_item}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SIZE</Text></View>
									<View style={[styles.td_stock_price_item]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TIME</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.current_quote=='bid'?this.state.bid_quote:this.state.ask_quote}
												renderItem={this._renderItemQuote}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractorQuote}
												initialNumToRender={10}
											/>
								</View>
              </Content>
						</Container>
				);
		}
}

export default StockDetailQuote;
