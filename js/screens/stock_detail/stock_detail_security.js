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

class StockDetailSecurity extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        symbol:'',  //current stock
        current_detail_part: 'security_details',
        dividend_data: [],
        splits_data: [],
        is_dividend: true
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_data();
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
        this.setState({
          symbol: newPropParams['symbol'],
          current_detail_part: 'security_details',
          dividend_data: [],
          splits_data: [],
          is_dividend: true
        }, ()=>{
          this._load_data();
        });
      }
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
		_keyExtractorDividend = (item) => item.changeDate + '-' + item.payDate;
		//render the list. MUST use "item" as param
		_renderItemDividend = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.changeDate + '-' + item.payDate}>
					<View style={[styles.width_25p]}><Text>{item.changeDate}</Text></View>
					<View style={[styles.width_25p]}><Text style={[common_styles.float_right]}>{item.cashAmount}</Text></View>
          <View style={[styles.width_25p]}><Text>{item.recordDate}</Text></View>
          <View style={[styles.width_25p]}><Text>{item.payDate}</Text></View>
				</View>
		);
    //
		_keyExtractorSplit = (item) => item.changeDate + '-' + item.payDate;
		//render the list. MUST use "item" as param
		_renderItemSplit = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.changeDate + '-' + item.payDate}>
					<View style={[common_styles.width_25p]}><Text>{item.changeDate}</Text></View>
					<View style={[common_styles.width_25p]}><Text>{item.splitRatio}</Text></View>
					<View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.recordDate}</Text></View>
          <View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.payDate}</Text></View>
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
                <Spinner visible={false} textStyle={common_styles.whiteColor} />
                <View style={common_styles.margin_b_10} />
                {/* List */}
                <View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>DIVIDENDS & SPLITS</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_dividend(true)}>
				          	<View style={[common_styles.padding_5, this.state.is_dividend&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.is_dividend&&common_styles.bold]}>Dividends</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_dividend(false)}>
										<View style={[common_styles.padding_5, !this.state.is_dividend&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, !this.state.is_dividend&&common_styles.bold]}>Splits</Text></View>
									</TouchableOpacity>
				        </View>
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</Text></View>
									<View style={styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>{this.state.is_dividend?'$AMT':'SPTRAT'}</Text></View>
									<View style={[styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>RECDATE</Text></View>
                  <View style={[styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PAYDATE</Text></View>
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
