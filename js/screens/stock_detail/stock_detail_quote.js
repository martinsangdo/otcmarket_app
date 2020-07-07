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
import Spinner from 'react-native-loading-spinner-overlay';

const Item = Picker.Item;

class StockDetailQuote extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        symbol:'',  //current stock
        current_detail_part: 'quote',
        current_quote: 'bid',
        general: {},
        bid_quote:[],
        ask_quote:[],
        trade_data: [],
        short_interest: []
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
			}, 3000);
		}
		//called when open this page again
		componentDidUpdate(prevProps){
			var prevPropParams = prevProps.navigation;
			var newPropParams = this.props.navigation.state.params;
			//check if any param is updated, load data again
      if (prevPropParams.getParam('symbol') != newPropParams['symbol']){
        this.setState({
          loading_indicator_state: true,
          symbol: newPropParams['symbol'],
          current_detail_part: 'quote',
          current_quote: 'bid',
          general: {},
          bid_quote:[],
          ask_quote:[],
          trade_data: [],
          short_interest: []
        }, ()=>{
          this._load_quote();
        });
        setTimeout(() => {
  				if (this.state.loading_indicator_state){
  					this.setState({loading_indicator_state: false});  //stop loading
  				}
  			}, 3000);
      }
		}
    //
    _load_quote(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.QUOTE.GENERAL.replace(/<symbol>/g, this.state.symbol);
      //general
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var save_detail = {
            open: Utils.getNullableString(detail['openingPrice']),
            daily_range: Utils.getNullableString(detail['dailyLow']) + ' - ' + Utils.getNullableString(detail['dailyHigh']),
            volume: Utils.format_currency_thousand(detail['volume']),
            dividend: Utils.getNullableString(detail['dividend']),
            prev_close: Utils.getNullableString(detail['previousClose']),
            wk_range: Utils.getNullableString(detail['annualLow']) + ' - ' + Utils.getNullableString(detail['annualHigh']),
            average_vol: Utils.isEmpty(detail['thirtyDaysAvgVol'])?'-':Utils.format_currency_thousand(Math.round(detail['thirtyDaysAvgVol'])),
            net_dividend: Utils.getNullableString(detail['yield']),
            best_bid: Utils.getNullableString(detail['bidPrice']) + ' x ' + Utils.getNullableString(detail['bidSize']),
            best_ask: Utils.getNullableString(detail['askPrice']) + ' x ' + Utils.getNullableString(detail['askSize']),
            market_cap: Utils.format_currency_thousand(detail['marketCap']),
            shares_out: Utils.format_currency_thousand(detail['sharesOutstanding'])
          };
          me.setState({general: save_detail});
        } else if (error){
          //do nothing
        }
      });
      //Trade data
      var urlTrade = API_URI.STOCK_DETAIL.QUOTE.TRADE_DATA.replace(/<symbol>/g, this.state.symbol);
      RequestData.sentGetRequest(urlTrade, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var trade_data = [];
            for (var i=0; i<records.length; i++){
              trade_data.push({
                eventTimestamp: records[i]['eventTimestamp']+Math.random()+'',
                tradeDate: records[i]['tradeDate'],
                tradeTime: records[i]['tradeTime'],
                lastPrice: records[i]['lastPrice'],
                lastVolume: Utils.format_currency_thousand(records[i]['lastVolume']),
                tradeDirection: records[i]['tradeDirection']
              });
            }
            me.setState({trade_data: trade_data});
          }
        } else if (error){
          //do nothing
        }
      });
      //Short interest
      var urlShortInterest = API_URI.STOCK_DETAIL.QUOTE.SHORT_INTEREST.replace(/<symbol>/g, this.state.symbol);
      RequestData.sentGetRequest(urlShortInterest, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var short_interest = [];
            for (var i=0; i<records.length; i++){
              short_interest.push({
                positionDate: records[i]['positionDate']+'',
                shortInterest: Utils.format_currency_thousand(records[i]['shortInterest']),
                pctChgVolume: records[i]['pctChgVolume'],
                avgDailyVolume: Utils.format_currency_thousand(records[i]['avgDailyVolume']),
                positionDateDisplay: Utils.formatDate(records[i]['positionDate']),
              });
            }
            me.setState({short_interest: short_interest});
          }
        } else if (error){
          //do nothing
        }
      });
      //Real time level 2
      var urlQuote = API_URI.STOCK_DETAIL.QUOTE.REAL_TIME_LEVEL_2.replace(/<symbol>/g, this.state.symbol);
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
    }
    //when user wants to see another part of stock detail
    onChangePart = (new_part) => {
      //move to new page
      switch (new_part) {
        case 'quote':
          this.props.navigation.navigate('StockDetailQuote', {symbol: this.state.symbol});
          break;
          case 'company_profile':
            this.props.navigation.navigate('StockDetailProfile', {symbol: this.state.symbol});
            break;
            case 'security_details':
              this.props.navigation.navigate('StockDetailSecurity', {symbol: this.state.symbol});
              break;
              case 'news':
                this.props.navigation.navigate('StockDetailNews', {symbol: this.state.symbol});
                break;
                case 'financials':
                  this.props.navigation.navigate('StockDetailFinancial', {symbol: this.state.symbol});
                  break;
                  case 'disclosure':
                    this.props.navigation.navigate('StockDetailDisclosure', {symbol: this.state.symbol});
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
					<View style={[common_styles.width_25p]}>
            <Text>{item.mmId}</Text>
          </View>
					<View style={[common_styles.width_25p]}><Text style={[common_styles.float_right]}>{item.priceDisplay}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.sizeDisplay}</Text></View>
          <View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.transTimeDisplay}</Text></View>
				</View>
		);
    //
		_keyExtractorTradeData = (item) => item.eventTimestamp;
		//render the list. MUST use "item" as param
		_renderItemTradeData = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.eventTimestamp}>
					<View style={[common_styles.width_25p]}><Text>{item.tradeDate}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={[common_styles.float_right]}>{item.tradeTime}</Text></View>
					<View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.lastPrice}</Text></View>
          <View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.lastVolume}</Text></View>
          <View>
            {item.tradeDirection == 'Down' &&
              <Icon name="md-arrow-dropdown" style={common_styles.redColor}/>
            }
            {item.tradeDirection == 'Up' &&
              <Icon name="md-arrow-dropup"/>
            }
            {item.tradeDirection != 'Down' && item.tradeDirection != 'Up' &&
              <Icon name="md-remove"/>
            }
          </View>
				</View>
		);
    //
		_keyExtractorShortInterest = (item) => item.positionDate;
		//render the list. MUST use "item" as param
		_renderItemShortInterest = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.positionDate}>
					<View style={[common_styles.width_25p]}><Text>{item.positionDateDisplay}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={[common_styles.float_right]}>{item.shortInterest}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={[common_styles.float_right, styles.positivePriceColor, item.pctChgVolume < 0 && common_styles.redColor]}>{item.pctChgVolume}</Text></View>
          <View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.avgDailyVolume}</Text></View>
				</View>
		);
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.3}]}>
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
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
                  <TouchableOpacity>
                    <Icon name="md-bookmark" style={[common_styles.header_icon, common_styles.margin_b_10]}/>
                  </TouchableOpacity>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select Info"
                    iosIcon={<Icon name="ios-arrow-down" style={{position: 'absolute', right: -15, color: '#008da9', marginRight:10 }}/>}
                    selectedValue={this.state.current_detail_part}
                    onValueChange={(newval)=>{this.onChangePart(newval)}}
                  >
                    <Item label="Quote" value="quote" />
                    <Item label="Profile" value="company_profile" />
                    <Item label="Security" value="security_details" />
                    <Item label="News" value="news" />
                    <Item label="Financials" value="financials" />
                    <Item label="Disclosure" value="disclosure" />
                  </Picker>
								</Right>
							</Header>
							{/* END header */}
              <Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                {/* general data */}
                <View style={common_styles.margin_10}>
                  <Card>
                    <CardItem>
                      <Body>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>OPEN</Text>
                            <Text>{this.state.general['open']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>DAILY RANGE</Text>
                            <Text>{this.state.general['daily_range']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>VOLUME</Text>
                            <Text>{this.state.general['volume']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>DEVIDEND</Text>
                            <Text>{this.state.general['dividend']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>PREV CLOSE</Text>
                            <Text>{this.state.general['prev_close']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>52WK RANGE</Text>
                            <Text>{this.state.general['wk_range']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>AVERAGE VOL (30D)</Text>
                            <Text>{this.state.general['average_vol']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>NET DIVIDENT YIELD</Text>
                            <Text>{this.state.general['net_dividend']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>BEST BID</Text>
                            <Text>{this.state.general['best_bid']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>BEST ASK</Text>
                            <Text>{this.state.general['best_ask']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>MARKET CAP</Text>
                            <Text>{this.state.general['market_cap']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>SHARES OUT</Text>
                            <Text>{this.state.general['shares_out']}</Text>
                          </View>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
                <View style={common_styles.margin_b_10} />
                {/* Trade data */}
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>TRADE DATA</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab, common_styles.margin_l_5, common_styles.margin_r_5]} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TIMESTAMP</Text></View>
									<View style={common_styles.width_20p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={[common_styles.width_20p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>VOLUME</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.trade_data}
												renderItem={this._renderItemTradeData}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractorTradeData}
												initialNumToRender={10}
											/>
								</View>
                <View style={common_styles.margin_b_20} />
                {/* Short Interest */}
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>SHORT INTEREST</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab, common_styles.margin_l_5, common_styles.margin_r_5]} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SHORT INTEREST</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</Text></View>
									<View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>AVG. DAILY SHARE VOL</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.short_interest}
												renderItem={this._renderItemShortInterest}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractorShortInterest}
												initialNumToRender={10}
											/>
								</View>
                <View style={common_styles.margin_b_20} />
                {/* real time level 2 data */}
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>REAL-TIME LEVEL 2 QUOTE</Text></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_quote('bid')}>
				          	<View style={[common_styles.padding_5, common_styles.margin_r_20, this.state.current_quote=='bid'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==1&&common_styles.bold]}>BID</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_quote('ask')}>
										<View style={[common_styles.padding_5, this.state.current_quote=='ask'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.sortOn==0.05&&common_styles.bold]}>ASK</Text></View>
									</TouchableOpacity>
				        </View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>MPID</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</Text></View>
									<View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SIZE</Text></View>
									<View style={[common_styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TIME</Text></View>
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
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailQuote;
