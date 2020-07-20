import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox, Linking} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Card,
  CardItem, Picker} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./../style";    //CSS defined here
import {API_URI} from '../../utils/api_uri';
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import {setting} from '../../utils/config.js';

import RequestData from '../../utils/https/RequestData';
import store from 'react-native-simple-store';
import Spinner from 'react-native-loading-spinner-overlay';

const Item = Picker.Item;

class StockDetailProfile extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: true,
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
      var url = API_URI.STOCK_DETAIL.PROFILE.replace(/<symbol>/g, this.state.symbol);
      //general
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var save_detail = {
            name: detail['name'],
            securities_className: detail['securities'][0]['className'],//Sponsored ADR (1 ADS : 0.125 Ordinary)
            tierGroup: detail['tierGroup'], //QX
            tierStartDate: Utils.formatDate(detail['tierStartDate']),
            tierDisplayName: detail['securities'][0]['tierDisplayName'],
            authorizedShares: Utils.format_currency_thousand(detail['securities'][0]['outstandingShares']),
            authorizedSharesAsOfDate: Utils.formatDate(detail['securities'][0]['outstandingSharesAsOfDate']),
            isProfileVerified: detail['isProfileVerified'],
            profileVerifiedAsOfDate: Utils.formatDate(detail['profileVerifiedAsOfDate']),
            hasLogo: detail['hasLogo'],
            companyLogoUrl: detail['companyLogoUrl'],
            businessDesc: detail['businessDesc'],
            address1: detail['address1'],
            city: detail['city'],
            zip: detail['zip'],
            country: detail['country'],
            website: detail['website'],
            phone: detail['phone'],
            email: detail['email'],
            twitter: detail['twitter'],
            estimatedMarketCap: Utils.format_currency_thousand(detail['estimatedMarketCap']),
            estimatedMarketCapAsOfDate: Utils.formatDate(detail['estimatedMarketCapAsOfDate']),
            outstandingShares: Utils.format_currency_thousand(detail['outstandingShares']),
            reportingStandard: detail['reportingStandard'],
            auditedStatusDisplay: detail['auditedStatusDisplay'],
            //report
            hasLatestFiling: Utils.getNullableString(detail['hasLatestFiling']),
            latestFilingType: Utils.getNullableString(detail['latestFilingType']),
            latestFilingDate: Utils.formatDate(detail['latestFilingDate']),
            latestFilingUrl: Utils.getNullableString(detail['latestFilingUrl']),
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
            numberOfEmployees: Utils.format_currency_thousand(detail['numberOfEmployees']),
            numberOfEmployeesAsOf: Utils.formatDate(detail['numberOfEmployeesAsOf']),
            isShell: detail['isShell'],
            security_notes: detail['securities'][0]['notes']
          };
          // Utils.xlog('full detail', save_detail);
          me.setState({general: save_detail});
        } else if (error){
          //do nothing
        }
        me.setState({loading_indicator_state: false});
        setTimeout(() => {
  				if (me.state.loading_indicator_state){
  					me.setState({loading_indicator_state: false});  //stop loading
  				}
  			}, C_Const.MAX_WAIT_RESPONSE);
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
		_keyExtractorOfficers = (item) => item.name + item.title;
		//render the list. MUST use "item" as param
		_renderOfficers = ({item}) => (
      <View style={[common_styles.margin_b_10]}>
        <Text style={[common_styles.margin_b_10, common_styles.bold]}>{item.name}</Text>
        <Text>{item.title}</Text>
      </View>
		);
    //
		_keyExtractorAuditors = (item) => item.name + item.id;
		//render the list. MUST use "item" as param
		_renderAuditors = ({item}) => (
      <View style={[common_styles.margin_b_10]}>
        <Text style={[common_styles.margin_b_10, common_styles.bold]}>{item.typeName}</Text>
        <Text style={[common_styles.margin_b_10, common_styles.bold]}>{item.name}</Text>
        <Text style={[common_styles.margin_b_10]}>{item.address1}</Text>
        <Text style={[common_styles.margin_b_10]}>{item.city + ' ' +item.zip}</Text>
        <Text>{item.country}</Text>
      </View>
		);
    //==========
		render() {
      let display_company_notes = [];
      let company_notes = this.state.general['notes'];
      if (company_notes !== undefined && company_notes != null){
        display_company_notes = company_notes.map(function(item){
          return <View key={Math.random()}><Text style={[common_styles.margin_b_10]}> {item} </Text></View>;
        });
      }
      let display_securities_notes = [];
      let securities_notes = this.state.general['security_notes'];
      if (securities_notes !== undefined && securities_notes != null){
        display_securities_notes = securities_notes.map(function(item){
          return <View key={Math.random()}><Text style={[common_styles.margin_b_10]}>{item}</Text></View>;
        });
      }

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
                    <Item label="Profile" value="company_profile" />
                    <Item label="Security" value="security_details" />
                    <Item label="News" value="news" />
                    <Item label="Financials" value="financials" />
                    <Item label="Disclosure" value="disclosure" />
                  </Picker>
								</Right>
							</Header>
							{/* END header */}
              <Content style={common_styles.padding_10}>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                {/* general data */}
                <View style={common_styles.margin_b_10} />
                <View><Text style={[common_styles.margin_b_10, common_styles.bold]}>{this.state.general['name']}</Text></View>
                <View style={common_styles.margin_b_10}><Text>{this.state.general['tierDisplayName']}</Text></View>
                <View style={common_styles.margin_b_20}><Text>Member since {this.state.general['tierStartDate']}</Text></View>
                {this.state.general['isProfileVerified'] &&
                  <View style={common_styles.margin_b_20}><Text>Verified Profile {this.state.general['profileVerifiedAsOfDate']}</Text></View>
                }
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>DESCRIPTION</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                <View><Text>{this.state.general['businessDesc']}</Text></View>
                {this.state.general['hasLogo'] && !Utils.isEmpty(this.state.general['companyLogoUrl']) &&
                  <Image source={{uri: setting.BACKEND_SERVER_URI + this.state.general['companyLogoUrl']}} style={{maxWidth:170, height:40}}/>
                }
                {
                  !Utils.isEmpty(this.state.general['address1']) &&
                    <View style={common_styles.margin_b_10}><Text>{this.state.general['address1']}</Text></View>
                }
                {
                  !Utils.isEmpty(this.state.general['city']) &&
                    <View style={common_styles.margin_b_10}><Text>{this.state.general['city']}</Text></View>
                }
                {
                  !Utils.isEmpty(this.state.general['country']) &&
                    <View style={common_styles.margin_b_10}><Text>{this.state.general['country']}</Text></View>
                }
                <View style={[common_styles.margin_b_10, common_styles.border_b_gray]} />
                {
                  !Utils.isEmpty(this.state.general['website']) &&
                  <View style={common_styles.margin_b_10}>
                    <TouchableOpacity onPress={()=>Linking.openURL(this.state.general['website'])}>
                      <Text>{this.state.general['website']}</Text>
                    </TouchableOpacity>
                  </View>
                }
                {
                  !Utils.isEmpty(this.state.general['phone']) &&
                  <View style={common_styles.margin_b_10}>
                    <TouchableOpacity onPress={()=>Linking.openURL('tel:'+this.state.general['phone'])}>
                      <Text>{this.state.general['phone']} {this.state.general['zip']}</Text>
                    </TouchableOpacity>
                  </View>
                }
                {
                  !Utils.isEmpty(this.state.general['email']) &&
                  <View style={common_styles.margin_b_10}>
                    <TouchableOpacity onPress={()=>Linking.openURL('mailto:'+this.state.general['email'])}>
                      <Text>{this.state.general['email']}</Text>
                    </TouchableOpacity>
                  </View>
                }
                <View style={[common_styles.margin_b_10, common_styles.border_b_gray]} />
                {
                  !Utils.isEmpty(this.state.general['twitter']) &&
                  <View style={common_styles.margin_b_10}>
                    <TouchableOpacity onPress={()=>Linking.openURL(this.state.general['twitter'])}>
                        <Icon name="logo-twitter" style={common_styles.default_font_color}/>
                    </TouchableOpacity>
                  </View>
                }
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>SECURITY DETAILS</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {
                  !Utils.isEmpty(this.state.general['estimatedMarketCap']) &&
                  <View>
                    <View><Text style={[common_styles.margin_b_10, common_styles.bold]}>Market Cap</Text></View>
                    <View style={[common_styles.margin_b_10, common_styles.flex_row]}>
                      <View style={[common_styles.width_50p]}><Text>{this.state.general['estimatedMarketCap']}</Text></View>
                      <View style={[common_styles.width_50p]}><Text>{this.state.general['estimatedMarketCapAsOfDate']}</Text></View>
                    </View>
                  </View>
                }
                {
                  !Utils.isEmpty(this.state.general['authorizedShares']) &&
                  <View>
                    <View><Text style={[common_styles.margin_b_10, common_styles.bold]}>Shares Out</Text></View>
                    <View style={[common_styles.margin_b_10, common_styles.flex_row]}>
                      <View style={[common_styles.width_50p]}><Text>{this.state.general['authorizedShares']}</Text></View>
                      <View style={[common_styles.width_50p]}><Text>{this.state.general['authorizedSharesAsOfDate']}</Text></View>
                    </View>
                  </View>
                }
                {
                  !Utils.isEmpty(this.state.general['estimatedMarketCap']) && !Utils.isEmpty(this.state.general['authorizedShares']) &&
                  <View style={common_styles.view_align_center}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('StockDetailSecurity', {symbol: this.state.symbol})}>
                      <Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
                    </TouchableOpacity>
                  </View>
                }
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>FINANCIAL REPORTING</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {!Utils.isEmpty(this.state.general['reportingStandard']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Reporting Status</Text>
                    <Text>{this.state.general['reportingStandard']}</Text>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['auditedStatusDisplay']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Audited Financials</Text>
                    <Text>{this.state.general['auditedStatusDisplay']}</Text>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['latestFilingUrl']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Latest Report</Text>
                    <TouchableOpacity onPress={()=>Linking.openURL(setting.BACKEND_SERVER_URI + this.state.general['latestFilingUrl'])}>
                      <Text style={common_styles.underline}>{this.state.general['latestFilingDate'] + ' ' + this.state.general['latestFilingType']}</Text>
                    </TouchableOpacity>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['cik']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>CIK</Text>
                    <Text>{this.state.general['cik']}</Text>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['fiscalYearEnd']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Fiscal Year End</Text>
                    <Text>{this.state.general['fiscalYearEnd']}</Text>
                  </View>
                }
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>OFFICERS</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {
                  this.state.general['officers'] != null && this.state.general['officers'].length > 0 &&
                  <FlatList
												data={this.state.general['officers']}
												renderItem={this._renderOfficers}
												refreshing={false}
												keyExtractor={this._keyExtractorOfficers}
											/>
                }
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>DIRECTORS</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {
                  this.state.general['premierDirectorList'] != null && this.state.general['premierDirectorList'].length > 0 &&
                  <FlatList
												data={this.state.general['premierDirectorList']}
												renderItem={this._renderOfficers}
												refreshing={false}
												keyExtractor={this._keyExtractorOfficers}
											/>
                }
                {
                  this.state.general['standardDirectorList'] != null && this.state.general['standardDirectorList'].length > 0 &&
                  <FlatList
												data={this.state.general['standardDirectorList']}
												renderItem={this._renderOfficers}
												refreshing={false}
												keyExtractor={this._keyExtractorOfficers}
											/>
                }
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>SERVICE PROVIDERS</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                <FlatList
                      data={this.state.general['auditors']}
                      renderItem={this._renderAuditors}
                      refreshing={false}
                      keyExtractor={this._keyExtractorAuditors}
                />
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>PROFILE DATA</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {!Utils.isEmpty(this.state.general['primarySicCode']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>SIC - Industry Classification</Text>
                    <Text>{this.state.general['primarySicCode']}</Text>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['countryOfIncorporationName']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Incorporated In</Text>
                    <Text>{this.state.general['countryOfIncorporationName'] + ', ' + this.state.general['yearOfIncorporation']}</Text>
                  </View>
                }
                {!Utils.isEmpty(this.state.general['numberOfEmployees']) &&
                  <View style={[common_styles.margin_b_10]}>
                    <Text style={[common_styles.margin_b_10, common_styles.bold]}>Employees</Text>
                    <Text>{this.state.general['numberOfEmployees']} as of {this.state.general['numberOfEmployeesAsOf']}</Text>
                  </View>
                }
                <View style={[common_styles.margin_b_10]}>
                  <Text style={[common_styles.margin_b_10, common_styles.bold]}>Shell</Text>
                  <Text>{this.state.general['isShell']?'Yes':'No'}</Text>
                </View>
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>NOTES</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {display_company_notes}
                <View style={[common_styles.margin_b_20]} />
                <View><Text style={[common_styles.margin_b_10, common_styles.heading_1]}>SECURITIES NOTES</Text></View>
                <View style={[common_styles.margin_b_10, common_styles.border_b_tab]} />
                {display_securities_notes}
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailProfile;
