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

class StockDetailProfile extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        symbol:'',  //current stock
        current_detail_part: 'company_profile',
        general: {}
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
          current_detail_part: 'company_profile',
          general: {}
        }, ()=>{
          this._load_data();
        });
      }
		}
    //
    _load_data(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.PROFILE.replace('<symbol>', this.state.symbol);
      //general
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var save_detail = {
            name: detail['name'],
            securities_className: detail['securities'][0]['className'],//Sponsored ADR (1 ADS : 0.125 Ordinary)
            tierGroup: detail['tierGroup'], //QX
            tierStartDate: Utils.formatDate(detail['tierStartDate']),
            tierDisplayName: detail['tierDisplayName'],
            isProfileVerified: detail['isProfileVerified'],
            profileVerifiedAsOfDate: Utils.formatDate(detail['profileVerifiedAsOfDate']),
            hasLogo: detail['hasLogo'],
            companyLogoUrl: detail['companyLogoUrl'],
            businessDesc: detail['businessDesc'],
            address1: detail['address1'],
            city: detail['city'],
            country: detail['country'],
            website: detail['website'],
            phone: detail['phone'],
            fax: detail['fax'],
            twitter: detail['twitter'],
            estimatedMarketCap: Utils.format_currency_thousand(detail['estimatedMarketCap']),
            estimatedMarketCapAsOfDate: Utils.formatDate(detail['estimatedMarketCapAsOfDate']),
            outstandingShares: Utils.format_currency_thousand(detail['outstandingShares']),
            reportingStandard: detail['reportingStandard'],
            auditedStatusDisplay: detail['auditedStatusDisplay'],
            //report
            hasLatestFiling: detail['hasLatestFiling'],
            latestFilingType: detail['latestFilingType'],
            latestFilingDate: Utils.formatDate(detail['latestFilingDate']),
            cik: detail['cik'],
            fiscalYearEnd: detail['fiscalYearEnd'],
            officers: detail['officers'],
            premierDirectorList: detail['premierDirectorList'],
            standardDirectorList: detail['standardDirectorList'],
            auditors: detail['auditors'],
            notes: detail['notes'],
            primarySicCode: detail['primarySicCode'],
            countryOfIncorporationName: detail['countryOfIncorporationName'],
            yearOfIncorporation: detail['yearOfIncorporation'],
            numberOfEmployees: detail['numberOfEmployees'],
            numberOfEmployeesAsOf: detail['numberOfEmployeesAsOf'],
            isShell: detail['isShell']
          };
          Utils.xlog('full detail', save_detail);
          me.setState({general: save_detail});
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
                    case 'research':
                      this.props.navigation.navigate('StockDetailResearch', {symbol: this.state.symbol});
                      break;
      }
    }
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
                    iosIcon={<Icon name="ios-arrow-down" style={{position: 'absolute', right: -15, color: '#008da9' }} />}
                    selectedValue={this.state.current_detail_part}
                    onValueChange={(newval)=>{this.onChangePart(newval)}}
                  >
                    <Item label="Quote" value="quote" />
                    <Item label="Company Profile" value="company_profile" />
                    <Item label="Security Details" value="security_details" />
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
                {/* general data */}

                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailProfile;
