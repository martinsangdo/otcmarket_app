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

const Item = Picker.Item;

class StockDetailFinancial extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: true,
        current_detail_part: 'financials',
        symbol:'',  //current stock
        data: [],
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
          data: [],
          current_type: 'income-statement',
          current_duration: 'annual',
          current_time_index: 0
        }, ()=>{
          this._load_data();
        });
      }
		}
    //
    _load_data(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.FINANCIAL.
        replace('<symbol>', this.state.symbol).
          replace('<current_type>', this.state.current_type).
            replace('<current_duration>', this.state.current_duration);
      //
      this.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(url, (detail, error) => {
          if (detail){
            me.setState({data: detail});
          } else if (error){
            //do nothing
          }
          me.setState({loading_indicator_state: false});
        });
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
                    case 'research':
                      this.props.navigation.navigate('StockDetailResearch', {symbol: this.state.symbol});
                      break;
      }
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
                    <Item label="Research" value="research" />
                  </Picker>
								</Right>
							</Header>
							{/* END header */}
              <Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                <View style={common_styles.margin_b_10} />
                {
                  !this.state.loading_indicator_state && this.state.current_type == 'income-statement' &&
                    <FinancialIncome data={this.state.data[this.state.current_time_index]}/>
                }
                <View style={[common_styles.margin_t_20, common_styles.margin_10]}>
									<Text style={[common_styles.darkGrayColor, common_styles.font_15]}>For information not originally reported in U.S. Dollars, conversion is based on applicable exchange rate on the last day of the period reported</Text>
								</View>
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailFinancial;
