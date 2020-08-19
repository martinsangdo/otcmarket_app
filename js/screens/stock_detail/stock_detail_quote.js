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
import MyText from '../../component/MyText';

const Item = Picker.Item;

class StockDetailQuote extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: true,
        symbol:'',  //current stock
        current_detail_part: 'quote',
        current_quote: 'bid',
        general: {},
        bid_quote:[],
        ask_quote:[],
        trade_data: [],
        short_interest: [],
        bookmarked_symbols:{}
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_bookmarked_state();
        this._load_quote();
			});
      //todo: check bookmark
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
          short_interest: [],
          bookmarked_symbols:{}
        }, ()=>{
          this._load_bookmarked_state();
          this._load_quote();
        });
      }
		}
    //
    _load_bookmarked_state(){
      var me = this;
			store.get(C_Const.STORE_KEY.BOOKMARKED_SYMBOLS)
			.then(saved_symbols => {
				// Utils.xlog('saved_symbols', saved_symbols.d);
				if (saved_symbols!=null && saved_symbols.d!=null){
					me.setState({bookmarked_symbols: saved_symbols.d});
				}
			});
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
        me.setState({loading_indicator_state: false});
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
            <MyText>{item.mmId}</MyText>
          </View>
					<View style={[common_styles.width_25p]}><MyText style={[common_styles.float_right]}>{item.priceDisplay}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.sizeDisplay}</MyText></View>
          <View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.transTimeDisplay}</MyText></View>
				</View>
		);
    //
		_keyExtractorTradeData = (item) => item.eventTimestamp;
		//render the list. MUST use "item" as param
		_renderItemTradeData = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.eventTimestamp}>
					<View style={[common_styles.width_25p]}><MyText>{item.tradeDate}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={[common_styles.float_right]}>{item.tradeTime}</MyText></View>
					<View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.lastPrice}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.lastVolume}</MyText></View>
          <View style={[common_styles.width_10p]}>
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
					<View style={[common_styles.width_25p]}><MyText>{item.positionDateDisplay}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={[common_styles.float_right]}>{item.shortInterest}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={[common_styles.float_right, styles.positivePriceColor, item.pctChgVolume < 0 && common_styles.redColor]}>{item.pctChgVolume}</MyText></View>
          <View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.avgDailyVolume}</MyText></View>
				</View>
		);
    //turn on/off bookmark of this symbol
    _toggle_bookmark(){
      var bookmarked_symbols = Utils.cloneObj(this.state.bookmarked_symbols);
      if (bookmarked_symbols[this.state.symbol]){
        //bookmarked
        bookmarked_symbols[this.state.symbol] = false;
      } else {
        bookmarked_symbols[this.state.symbol] = !bookmarked_symbols[this.state.symbol];
      }			//save back to store
			store.update(C_Const.STORE_KEY.BOOKMARKED_SYMBOLS, {d:bookmarked_symbols});
			this.setState({bookmarked_symbols: bookmarked_symbols});
    }
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.2}]}>
									<TouchableOpacity onPress={() => this._on_go_back()}>
										<View style={styles.left_row}>
											<View style={[common_styles.float_center]}>
												<Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
											</View>
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<MyText uppercase={false} style={[common_styles.default_font_color]}>Back</MyText>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color]}>{this.state.symbol}</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.6}]}>
                  <TouchableOpacity onPress={() => this._toggle_bookmark()}>
                    {this.state.bookmarked_symbols[this.state.symbol] &&
                      <Icon name="star" style={[common_styles.header_icon, common_styles.margin_b_10, common_styles.greenColor]}/>
                    }
                    {!this.state.bookmarked_symbols[this.state.symbol] &&
                      <Icon name="star-outline" style={[common_styles.header_icon, common_styles.margin_b_10]}/>
                    }
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
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                {/* general data */}
                <View style={common_styles.margin_10}>
                  <Card>
                    <CardItem>
                      <Body>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>OPEN</MyText>
                            <MyText>{this.state.general['open']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>DAILY RANGE</MyText>
                            <MyText>{this.state.general['daily_range']}</MyText>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>VOLUME</MyText>
                            <MyText>{this.state.general['volume']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>DEVIDEND</MyText>
                            <MyText>{this.state.general['dividend']}</MyText>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>PREV CLOSE</MyText>
                            <MyText>{this.state.general['prev_close']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>52WK RANGE</MyText>
                            <MyText>{this.state.general['wk_range']}</MyText>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>AVERAGE VOL (30D)</MyText>
                            <MyText>{this.state.general['average_vol']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>NET DIVIDENT YIELD</MyText>
                            <MyText>{this.state.general['net_dividend']}</MyText>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>BEST BID</MyText>
                            <MyText>{this.state.general['best_bid']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>BEST ASK</MyText>
                            <MyText>{this.state.general['best_ask']}</MyText>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>MARKET CAP</MyText>
                            <MyText>{this.state.general['market_cap']}</MyText>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <MyText style={[common_styles.darkGrayColor]}>SHARES OUT</MyText>
                            <MyText>{this.state.general['shares_out']}</MyText>
                          </View>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
                <View style={common_styles.margin_b_10} />
                {/* Trade data */}
								<View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>TRADE DATA</MyText></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab, common_styles.margin_l_5, common_styles.margin_r_5]} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TIMESTAMP</MyText></View>
									<View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</MyText></View>
									<View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>VOLUME</MyText></View>
                  <View style={[common_styles.width_10p]}></View>
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
								<View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>SHORT INTEREST</MyText></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab, common_styles.margin_l_5, common_styles.margin_r_5]} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SHORT INTEREST</MyText></View>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>% CHANGE</MyText></View>
									<View style={[common_styles.width_25p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>AVG. DAILY SHARE VOL</MyText></View>
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
								<View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>REAL-TIME LEVEL 2 QUOTE</MyText></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_quote('bid')}>
				          	<View style={[common_styles.padding_5, common_styles.margin_r_20, this.state.current_quote=='bid'&&common_styles.border_b_active]}><MyText style={[common_styles.blackColor, this.state.sortOn==1&&common_styles.bold]}>BID</MyText></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_quote('ask')}>
										<View style={[common_styles.padding_5, this.state.current_quote=='ask'&&common_styles.border_b_active]}><MyText style={[common_styles.blackColor, this.state.sortOn==0.05&&common_styles.bold]}>ASK</MyText></View>
									</TouchableOpacity>
				        </View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>MPID</MyText></View>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PRICE</MyText></View>
									<View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SIZE</MyText></View>
									<View style={[common_styles.width_25p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TIME</MyText></View>
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
