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

class StockDetailSecurity extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        symbol:'',  //current stock
        current_detail_part: 'security_details',
        dividend_data: [],
        splits_data: [],
        is_dividend: true,
        bookmarked_symbols:{}
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_bookmarked_state();
        this._load_data();
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
          symbol: newPropParams['symbol'],
          current_detail_part: 'security_details',
          dividend_data: [],
          splits_data: [],
          is_dividend: true,
          bookmarked_symbols:{}
        }, ()=>{
          this._load_bookmarked_state();
          this._load_data();
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
    _load_data(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.SECURITY.DIVIDEND.replace(/<symbol>/g, this.state.symbol);
      //devidend
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var dividend_data = [];
            for (var i=0; i<records.length; i++){
              dividend_data.push({
                changeDate: Utils.formatDate(records[i]['changeDate']),
                cashAmount: records[i]['cashAmount'],
                exerciseDate: Utils.formatDate(records[i]['exerciseDate']),
                recordDate: Utils.formatDate(records[i]['recordDate']),
                payDate: Utils.formatDate(records[i]['payDate'])
              });
            }
            me.setState({dividend_data: dividend_data});
          }
        } else if (error){
          //do nothing
        }
      });
      //splits
      var urlTrade = API_URI.STOCK_DETAIL.SECURITY.SPLIT.replace(/<symbol>/g, this.state.symbol);
      RequestData.sentGetRequest(urlTrade, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var splits_data = [];
            for (var i=0; i<records.length; i++){
              splits_data.push({
                changeDate: Utils.formatDate(records[i]['changeDate']),
                splitRatio: records[i]['splitRatio'],
                recordDate: Utils.formatDate(records[i]['recordDate']),
                payDate: Utils.formatDate(records[i]['payDate'])
              });
            }
            me.setState({splits_data: splits_data});
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
    //
    _change_dividend(is_dividend){
      this.setState({is_dividend: is_dividend});
    }
    //
		_keyExtractorDividend = (item) => item.changeDate + '-' + item.payDate+Math.random();
		//render the list. MUST use "item" as param
		_renderItemDividend = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.changeDate + '-' + item.payDate}>
					<View style={[styles.width_25p]}><MyText>{item.changeDate}</MyText></View>
					<View style={[styles.width_25p]}><MyText style={[common_styles.float_right]}>{item.cashAmount}</MyText></View>
          <View style={[styles.width_25p]}><MyText>{item.recordDate}</MyText></View>
          <View style={[styles.width_25p]}><MyText>{item.payDate}</MyText></View>
				</View>
		);
    //
		_keyExtractorSplit = (item) => item.changeDate + '-' + item.payDate+Math.random();
		//render the list. MUST use "item" as param
		_renderItemSplit = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.changeDate + '-' + item.payDate}>
					<View style={[common_styles.width_25p]}><MyText>{item.changeDate}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText>{item.splitRatio}</MyText></View>
					<View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.recordDate}</MyText></View>
          <View style={[common_styles.width_25p]}><MyText style={common_styles.float_right}>{item.payDate}</MyText></View>
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
								<Left style={[common_styles.headerLeft, {flex:0.3}]}>
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
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>{this.state.symbol}</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
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
                    iosIcon={<Icon name="md-caret-down-sharp" style={{position: 'absolute', right: -15, color: '#008da9', marginRight:10 }}/>}
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
                <View style={common_styles.margin_b_10} />
                {/* List */}
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>DIVIDENDS & SPLITS</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_dividend(true)}>
				          	<View style={[common_styles.padding_5, this.state.is_dividend&&common_styles.border_b_active]}><MyText style={[common_styles.blackColor, this.state.is_dividend&&common_styles.bold]}>Dividends</MyText></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_dividend(false)}>
										<View style={[common_styles.padding_5, !this.state.is_dividend&&common_styles.border_b_active]}><MyText style={[common_styles.blackColor, !this.state.is_dividend&&common_styles.bold]}>Splits</MyText></View>
									</TouchableOpacity>
				        </View>
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
									<View style={styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>{this.state.is_dividend?'$AMT':'SPTRAT'}</MyText></View>
									<View style={[styles.width_25p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>RECDATE</MyText></View>
                  <View style={[styles.width_25p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PAYDATE</MyText></View>
								</View>
								<View>
									<FlatList
												data={this.state.is_dividend?this.state.dividend_data:this.state.splits_data}
												renderItem={this.state.is_dividend?this._renderItemDividend:this._renderItemSplit}
												refreshing={false}
												keyExtractor={this.state.is_dividend?this._keyExtractorDividend:this._keyExtractorSplit}
											/>
								</View>
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailSecurity;
