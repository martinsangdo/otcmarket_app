import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox, Linking, Dimensions} from "react-native";

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
const deviceWidth = Dimensions.get("window").width;
import {setting} from '../../utils/config.js';
import FinancialIncome from "./stock_detail_financial_income";
import FinancialBalance from "./stock_detail_financial_balance";
import FinancialCashFlow from "./stock_detail_financial_cash_flow";
import MyText from '../../component/MyText';

const Item = Picker.Item;

class StockDetailFinancial extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        current_detail_part: 'financials',
        symbol:'',  //current stock
        data: {
          'income-statement': {
            annual: [],
            'semi-annual': [],
            quarterly: []
          },
          'balance-sheet': {
            annual: [],
            'semi-annual': [],
            quarterly: []
          },
          'cash-flow': {
            annual: [],
            'semi-annual': [],
            quarterly: []
          }
        },
        bookmarked_symbols:{},
        current_type: 'income-statement', //balance-sheet, cash-flow
        current_duration: 'annual', //semi-annual, quarterly
        current_time_index: 0 //0 -> 3
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
          current_detail_part: 'financials',
          data: {
            'income-statement': {
              annual: [],
              'semi-annual': [],
              quarterly: []
            },
            'balance-sheet': {
              annual: [],
              'semi-annual': [],
              quarterly: []
            },
            'cash-flow': {
              annual: [],
              'semi-annual': [],
              quarterly: []
            }
          },
          bookmarked_symbols:{},
          current_type: 'income-statement',
          current_duration: 'annual',
          current_time_index: 0
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
      if (this.state.data[this.state.current_type][this.state.current_duration].length == 0){
        //load from server
        var me = this;
        var url = API_URI.STOCK_DETAIL.FINANCIAL.
          replace(/<symbol>/g, this.state.symbol).
            replace('<current_type>', this.state.current_type).
              replace('<current_duration>', this.state.current_duration);
        //
          RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var data = me.state.data;
              data[me.state.current_type][me.state.current_duration] = detail;
              me.setState({data: data});
            } else if (error){
              //do nothing
            }
          });
      }
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
    _on_change_type(new_type){
      this.setState({current_type: new_type, current_time_index: 0, current_duration: 'annual'}, ()=>{
         this._load_data();
      });
    }
    //
    _on_change_duration(new_duration){
      this.setState({current_duration: new_duration, current_time_index: 0}, ()=>{
         this._load_data();
      });
    }
    //
    _on_change_time(time){
      var index = 0;
      var me = this;
      this.state.data[this.state.current_type][this.state.current_duration].map(function(item){
        if ((me.state.current_duration=='annual'?Utils.formatYear(item['periodEndDate']):Utils.formatMonthYear(item['periodEndDate'])) == time){
          me.setState({current_time_index: index});
        }
        index++;
      });
    }
    //
    time_index(){
      var me = this;
      var index = 0;
      var display_time = this.state.data[this.state.current_type][this.state.current_duration].map(function(item){
        return <TouchableOpacity key={Math.random()} onPress={()=>me._on_change_time(me.state.current_duration=='annual'?Utils.formatYear(item['periodEndDate']):Utils.formatMonthYear(item['periodEndDate']))}>
            <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, me.state.current_time_index==index++&&{color:'#3f481a', fontWeight:'bold'}]}>{me.state.current_duration=='annual'?Utils.formatYear(item['periodEndDate']):Utils.formatMonthYear(item['periodEndDate'])}</MyText>
          </TouchableOpacity>;
      });
      if (display_time.length > 0){
        return display_time;
      } else {
        return <MyText style={common_styles.grayColor}>...</MyText>;
      }
    }
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
									<MyText style={[common_styles.bold, common_styles.default_font_color]}>{this.state.symbol}</MyText>
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
                <View style={common_styles.margin_b_10} />
                <View style={styles.financial_options}>
                  <TouchableOpacity onPress={()=>this._on_change_type('income-statement')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_type=='income-statement'&&{color:'#3f481a', fontWeight:'bold'}]}>Income Statement</MyText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._on_change_type('balance-sheet')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_type=='balance-sheet'&&{color:'#3f481a', fontWeight:'bold'}]}>Balance Sheet</MyText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._on_change_type('cash-flow')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_type=='cash-flow'&&{color:'#3f481a', fontWeight:'bold'}]}>Cash Flow</MyText>
                  </TouchableOpacity>
				        </View>
                <View style={styles.financial_options}>
                  <TouchableOpacity onPress={()=>this._on_change_duration('annual')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_duration=='annual'&&{color:'#3f481a', fontWeight:'bold'}]}>Annual</MyText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._on_change_duration('semi-annual')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_duration=='semi-annual'&&{color:'#3f481a', fontWeight:'bold'}]}>Semi-Annual</MyText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._on_change_duration('quarterly')}>
                    <MyText style={[common_styles.margin_b_5, common_styles.darkGrayColor, this.state.current_duration=='quarterly'&&{color:'#3f481a', fontWeight:'bold'}]}>Quarterly</MyText>
                  </TouchableOpacity>
				        </View>
                <View style={styles.financial_options}>
									{!this.state.loading_indicator_state && this.time_index()}
				        </View>
                {
                  !this.state.loading_indicator_state && this.state.current_type == 'income-statement' &&
                    <FinancialIncome data={this.state.data[this.state.current_type][this.state.current_duration][this.state.current_time_index]}/>
                }
                {
                  !this.state.loading_indicator_state && this.state.current_type == 'balance-sheet' &&
                    <FinancialBalance data={this.state.data[this.state.current_type][this.state.current_duration][this.state.current_time_index]}/>
                }
                {
                  !this.state.loading_indicator_state && this.state.current_type == 'cash-flow' &&
                    <FinancialCashFlow data={this.state.data[this.state.current_type][this.state.current_duration][this.state.current_time_index]}/>
                }
                <View style={[common_styles.margin_t_20, common_styles.margin_10]}>
									<MyText style={[common_styles.darkGrayColor, common_styles.font_15]}>For information not originally reported in U.S. Dollars, conversion is based on applicable exchange rate on the last day of the period reported</MyText>
								</View>
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailFinancial;
