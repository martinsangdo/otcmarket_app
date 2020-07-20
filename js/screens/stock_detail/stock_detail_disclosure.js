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
import {setting} from '../../utils/config.js';

const Item = Picker.Item;

class StockDetailDisclosure extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        symbol:'',  //current stock
        current_detail_part: 'disclosure',
        data: {
          reports: {
            current_page: 1,
            list: [],
            can_load_more: true
          },
          insiders: {
            current_page: 1,
            list: [],
            can_load_more: true
          }
        }
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_reports();
        this._load_insiders();
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
          current_detail_part: 'disclosure',
          data: {
            reports: {
              current_page: 1,
              list: [],
              totalRecords: 0,
              can_load_more: true
            },
            fillings: {
              current_page: 1,
              list: [],
              can_load_more: true
            },
            insiders: {
              current_page: 1,
              list: [],
              can_load_more: true
            }
          }
        }, ()=>{
          this._load_reports();
          this._load_insiders();
        });
      }
		}
    //
    _load_reports(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.DISCLOSURE.REPORT.
          replace(/<symbol>/g, this.state.symbol).replace('<page_index>', this.state.data['reports']['current_page']);
      //
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var data = me.state.data;
            for (var i=0; i<records.length; i++){
              data['reports']['list'].push({
                id: records[i]['id'],
                name: records[i]['name'],
                releaseDate: Utils.formatDate(records[i]['releaseDate']),
                periodDate: Utils.formatDate(records[i]['periodDate'])
              });
            }
            data['reports']['totalRecords'] = detail['totalRecords'];
            if (data['reports']['list'].length >= detail['totalRecords']){
              data['reports']['can_load_more'] = false;
            }
            me.setState({data: data});
          }
        } else if (error){
          //do nothing
        }
      });
    }
    //
    _load_insiders(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.DISCLOSURE.INSIDER.
          replace(/<symbol>/g, this.state.symbol).replace('<page_index>', this.state.data['insiders']['current_page']);
      //
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var data = me.state.data;
            for (var i=0; i<records.length; i++){
              data['insiders']['list'].push({
                id: records[i]['id'],
                title: records[i]['title'],
                releaseDate: Utils.formatDate(records[i]['releaseDate']),
                typeName: records[i]['typeName']
              });
            }
            data['insiders']['totalRecords'] = detail['totalRecords'];
            if (data['insiders']['list'].length >= detail['totalRecords']){
              data['insiders']['can_load_more'] = false;
            }
            me.setState({data: data});
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
		_keyExtractorReports = (item) => item.id+'';
		//render the list. MUST use "item" as param
		_renderItemReports = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.id}>
					<View style={[styles.width_25p]}><Text style={common_styles.padding_5}>{item.releaseDate}</Text></View>
          <View style={[styles.width_50p, common_styles.view_wrap]}>
            <TouchableOpacity onPress={()=>this._open_pdf_viewer(API_URI.STOCK_DETAIL.DISCLOSURE.REPORT_DOWNLOAD.replace(/<symbol>/g, item.id))}>
              <Text style={[common_styles.padding_5, common_styles.font_15, common_styles.underline]}>{item.name}</Text>
              </TouchableOpacity>
          </View>
          <View style={[styles.width_25p]}><Text style={common_styles.padding_5}>{item.periodDate}</Text></View>
				</View>
		);
    //
		_keyExtractorInsider = (item) => item.id+'';
		//render the list. MUST use "item" as param
		_renderItemInsider = ({item}) => (
      <View style={[styles.list_item, common_styles.fetch_row]} key={item.id}>
        <View style={[styles.width_25p]}><Text style={common_styles.padding_5}>{item.releaseDate}</Text></View>
        <View style={[styles.width_50p, common_styles.view_wrap]}>
          <TouchableOpacity onPress={()=>this._open_pdf_viewer(API_URI.STOCK_DETAIL.DISCLOSURE.REPORT_DOWNLOAD.replace(/<symbol>/g, item.id))}>
            <Text style={[common_styles.padding_5, common_styles.font_15, common_styles.underline]}>{item.title}</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.width_25p, common_styles.view_wrap]}><Text style={common_styles.padding_5}>{item.typeName}</Text></View>
			</View>
		);
    //
    _open_more_page(category){
      if (this.state.loading_indicator_state){
				return;
			}
      switch (category) {
        case 'reports':
          var data = this.state.data;
          data['reports']['current_page'] += 1;
          this.setState({data: data}, ()=>{
            this._load_reports();
          });
          break;
          case 'fillings':
            var data = this.state.data;
            data['fillings']['current_page'] += 1;
            this.setState({data: data}, ()=>{
              this._load_sec_fillings();
            });
            break;
        default:

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
                  </Picker>
								</Right>
							</Header>
							{/* END header */}
              <Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                <View style={common_styles.margin_b_10} />
                {/* List */}
                <View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>Financial Reports</Text></View>
                <View style={[common_styles.margin_l_10, common_styles.margin_r_10, common_styles.border_b_tab]} />
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>PUBLIST DATE</Text></View>
									<View style={styles.width_50p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>TITLE</Text></View>
									<View style={[styles.width_25p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>PERIOD END DATE</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.data['reports']['list']}
												renderItem={this._renderItemReports}
												refreshing={false}
												keyExtractor={this._keyExtractorReports}
                        style={{width:Dimensions.get("window").width}}
											/>
								</View>
                {
                  this.state.data['reports']['can_load_more'] &&
                    <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
    									<TouchableOpacity onPress={() => this._open_more_page('reports')}>
    										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
    									</TouchableOpacity>
    								</View>
                }
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Displaying {this.state.data['reports']['list'].length} of {this.state.data['reports']['totalRecords']} items</Text>
								</View>
                <View style={common_styles.margin_b_20} />
                {/* insider */}
                <View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>INSIDER</Text></View>
                <View style={[common_styles.margin_l_10, common_styles.margin_r_10, common_styles.border_b_tab]} />
								<View style={[common_styles.fetch_row, common_styles.padding_5]}>
									<View style={styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</Text></View>
									<View style={styles.width_50p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>TITLE</Text></View>
                  <View style={styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>TYPE</Text></View>
								</View>
								<View>
									<FlatList
												data={this.state.data['insiders']['list']}
												renderItem={this._renderItemInsider}
												refreshing={false}
												keyExtractor={this._keyExtractorInsider}
                        style={{width:Dimensions.get("window").width}}
											/>
								</View>
                  {
                    this.state.data['insiders']['can_load_more'] &&
                      <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
      									<TouchableOpacity onPress={() => this._open_more_page('insiders')}>
      										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
      									</TouchableOpacity>
      								</View>
                  }
                  <View style={common_styles.view_align_center}>
  									<Text style={common_styles.darkGrayColor}>Displaying {this.state.data['insiders']['list'].length} of {this.state.data['insiders']['totalRecords']} items</Text>
  								</View>
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailDisclosure;
