import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Picker, Card,
  CardItem} from "native-base";

import BaseScreen from "../base/BaseScreen.js";
import common_styles from "../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import {C_Const} from '../utils/constant';
import RequestData from '../utils/https/RequestData';
import store from 'react-native-simple-store';
import Spinner from 'react-native-loading-spinner-overlay';
import MyText from '../component/MyText';

const Item = Picker.Item;
//define display format
const extra_info_scheme = {
  'symbol-changes':[
    {key: 'oldSymbol', label: 'OLD SYMBOL'},
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'typeName', label: 'SPLIT TYPE'},
    {key: 'splitFactor', label: 'SPLIT FACTOR'}
  ],
  'venue-changes':[
    {key: 'oldSymbol', label: 'OLD SYMBOL'},
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'oldVenueName', label: 'OLD VENUE'},
    {key: 'newVenueName', label: 'NEW VENUE'}
  ],
  'name-changes':[
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'oldName', label: 'OLD NAME'}
  ],
  'symbol-name-changes':[
    {key: 'oldSymbol', label: 'OLD SYMBOL'},
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'oldName', label: 'OLD NAME'},
    {key: 'typeName', label: 'SPLIT TYPE'},
    {key: 'splitFactor', label: 'SPLIT FACTOR'}
  ],
  'splits':[
    {key: 'oldSymbol', label: 'OLD SYMBOL'},
    {key: 'effectiveDate', label: 'EFFECTIVE DATE', formatDate: true},
    {key: 'recordDate', label: 'RECORD DATE', formatDate: true},
    {key: 'payDate', label: 'PAYMENT DATE', formatDate: true},
    {key: 'typeName', label: 'SPLIT TYPE'},
    {key: 'splitFactor', label: 'SPLIT FACTOR'}
  ],
  'deletions':[
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'isDeletion', label: 'STATUS', boolean: true, trueLabel: 'Deleted', falseLabel: 'Reactivated'},
    {key: 'comments', label: 'COMMENTS'}
  ],
  'halts':[
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'name', label: 'STATUS'} //status
  ],
  'piggyback-qualified':[
    {key: 'className', label: 'SECURITY TYPE'}
  ],
  'piggyback-anticipated':[
    {key: 'className', label: 'SECURITY TYPE'}
  ],
  'ex-dividends':[
    {key: 'securityType', label: 'SECURITY TYPE'},
    {key: 'typeName', label: 'TYPE'},
    {key: 'cashAmount', label: 'CASH AMOUNT'}
  ],
  'sch-dividends':[
    {key: 'securityType', label: 'SECURITY TYPE'},
    {key: 'typeName', label: 'TYPE'},
    {key: 'cashAmount', label: 'CASH AMOUNT'}
  ],
  'tier-changes':[
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'oldTierName', label: 'OLD TIER'}
  ],
  'ce-changes':[
    {key: 'className', label: 'SECURITY TYPE'},
    {key: 'isCaveatEmptor', label: 'STATUS', boolean: true, trueLabel: 'Added', falseLabel: 'Removed'}
  ]
}

class CorporateActions extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        route: 'symbol-changes',
				security_type: '',
        security_type_list: [],
				tierGroup: '',
        tier_list: [],
				current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true,
        showing_detail_symbols: {}   //default no any symbol showing its detail
			};
		}
		//
		componentDidMount() {
      console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
			YellowBox.ignoreWarnings([
			  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.', // TODO: Remove when fixed
			]);
			this._load_filters();
			this._load_data();
		}
		//
    _load_data(){
      var me = this;
      setTimeout(()=>{
        me.setState({loading_indicator_state: true}, ()=>{
  				var url = API_URI.CORPORATE_ACTIONS.ROUTE.
              replace(/<route>/g, this.state.route).
  						replace(/<page_index>/g, this.state.current_page);
          if (!Utils.isEmpty(this.state.tierGroup)){
            url += '&tierCode=' + this.state.tierGroup;
          }
          if (!Utils.isEmpty(this.state.security_type)){
            url += '&securityTypeId=' + this.state.security_type;
          }
          // Utils.dlog(url);
          RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var data = me.state.list_data;
              var item, extra_info_meta_data;
              for (var i=0; i<detail['records'].length; i++){
                //mandatory fields
                item = {
                  changeDate: Utils.formatDate(detail['records'][i]['changeDate'] || detail['records'][i]['eligibleDate']),
                  symbol: detail['records'][i]['symbol'], //new symbol
                  tierName: detail['records'][i]['tierName'],
                  companyName: detail['records'][i]['companyName'] || detail['records'][i]['newName'],
                  className: Utils.getNullableString(detail['records'][i]['className'] || detail['records'][i]['securityType'])
                };
                //optional fields
                extra_info_meta_data = extra_info_scheme[me.state.route];
                if (extra_info_meta_data != null){
                  for (var j=0; j<extra_info_meta_data.length; j++){
                    if (extra_info_meta_data[j]['formatDate']){
                      item[extra_info_meta_data[j]['key']] = Utils.formatDate(Utils.getNullableString(detail['records'][i][extra_info_meta_data[j]['key']]));
                    } else if (extra_info_meta_data[j]['boolean']){
                      item[extra_info_meta_data[j]['key']] = detail['records'][i][extra_info_meta_data[j]['key']]?
                          extra_info_meta_data[j]['trueLabel']:extra_info_meta_data[j]['falseLabel'];
                    } else {
                      item[extra_info_meta_data[j]['key']] = Utils.getNullableString(detail['records'][i][extra_info_meta_data[j]['key']]);
                    }
                  }
                }
                data.push(item);
              }
              // Utils.xlog('data', data);
              //save it
              me.setState({list_data: data, totalRecords: detail['totalRecords'],
  								can_load_more:detail['totalRecords'] > data.length});
            } else if (error){
              //do nothing
            }
            me.setState({loading_indicator_state: false});
          });
        });
      }, 500);
    }
    //
		_keyExtractor = (item) => item.symbol+Math.random()+'';
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
      <View style={[common_styles.border_b_gray]}>
				<View style={[styles.list_item, common_styles.flex_row, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_25p]}><MyText>{item.changeDate}</MyText></View>
					<View style={[common_styles.width_20p]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailQuote', {symbol: item.symbol})}
            >
              <MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_30p]}><MyText>{item.companyName}</MyText></View>
          <View style={common_styles.width_20p}>
            <TouchableOpacity
              onPress={() => this._toogle_showing_detail(item.symbol)}
            >
              <MyText style={common_styles.font_12}>{item.tierName}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_5p, common_styles.margin_l_5, common_styles.margin_r_5]}>
            <TouchableOpacity
              onPress={() => this._toogle_showing_detail(item.symbol)}
            >
              {
                !this.state.showing_detail_symbols[item.symbol] &&
                <Icon name="md-caret-down-sharp" style={[common_styles.greenColor, common_styles.font_20]}/>
              }
              {
                this.state.showing_detail_symbols[item.symbol] &&
                <Icon name="md-caret-up-sharp" style={[common_styles.greenColor, common_styles.font_20, common_styles.margin_l_5]}/>
              }
            </TouchableOpacity>
          </View>
				</View>
        {/* sub info */}
        {
          this.state.showing_detail_symbols[item.symbol] &&
          <View>
            {extra_info_scheme[this.state.route].map(function(extra_info){
              if (!Utils.isEmpty(item[extra_info['key']]))
                return <View style={[common_styles.fetch_row, common_styles.margin_5]} key={Math.random()+''}>
                  <MyText style={[common_styles.width_45p, common_styles.darkGrayColor, common_styles.bold]}>{extra_info['label']}</MyText>
                  <MyText style={[common_styles.width_55p]}>{item[extra_info['key']]}</MyText>
                </View>
            })
            }
          </View>
        }
      </View>
		);
		//filters in picker
		_load_filters(){
			var me = this;
			var url = API_URI.CORPORATE_ACTIONS.FILTERS;
			RequestData.sentGetRequest(url, (detail, error) => {
					if (detail){
						me.setState({security_type_list: detail['securityTypes']['records'], tier_list: detail['tiers']['records']});
					} else if (error){
						//do nothing
					}
				});
		}
		//
		onChangeMarket(newMarket) {
      if (newMarket != this.state.tierGroup){
        this.setState({tierGroup: newMarket, current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true}, ()=>{
  				this._load_data();
          setTimeout(() => {
    				this.setState({loading_indicator_state: false});  //stop loading all
    			}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
	  }
    //
		onChangeRoute(newRoute) {
      if (newRoute != this.state.route){
        this.setState({route: newRoute, current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true}, ()=>{
  				this._load_data();
          setTimeout(() => {
    				this.setState({loading_indicator_state: false});  //stop loading all
    			}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
	  }
    //
		onChangeType(newType) {
      if (newType != this.state.security_type){
        this.setState({security_type: newType, current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true}, ()=>{
  				this._load_data();
          setTimeout(() => {
    				this.setState({loading_indicator_state: false});  //stop loading all
    			}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
	  }
		//
		_open_more_data(){
			if (this.state.loading_indicator_state){
				return;
			}
			this.setState({current_page: this.state.current_page+1}, ()=>{
				this._load_data();
			})
		}
    //
		_render_security_types(){
			var display_options = this.state.security_type_list.map(function(item){
				return <Item label={item.caption} value={item.id} key={Math.random()}/>;
			});
			return display_options;
		}
    //
		_render_markets(){
			var display_options = this.state.tier_list.map(function(item){
				return <Item label={item.caption} value={item.id} key={Math.random()}/>;
			});
			return display_options;
		}
    //
    _toogle_showing_detail(symbol){
      var showing_detail_symbols = this.state.showing_detail_symbols;
      if (showing_detail_symbols[symbol]){
        showing_detail_symbols[symbol] = false;
      } else {
        showing_detail_symbols[symbol] = true;
      }
      this.setState({showing_detail_symbols: showing_detail_symbols});
    }
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
									<TouchableOpacity
										onPress={() => this.props.navigation.openDrawer()}
									>
										<Icon name="menu" style={common_styles.greenColor}/>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>Corporate Actions</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                <View style={[common_styles.flex_row, common_styles.padding_5]}>
                  <View style={[common_styles.width_25p, common_styles.justifyCenter]}>
                    <MyText>Action</MyText>
                  </View>
                  <View style={common_styles.width_75p}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select Changes"
                      iosIcon={<Icon name="md-caret-down-sharp" />}
                      style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
                      selectedValue={this.state.route}
                      onValueChange={this.onChangeRoute.bind(this)}
                    >
                      <Item label="Symbol Changes" value="symbol-changes" />
                      <Item label="Venue Changes" value="venue-changes" />
                      <Item label="Company Name Changes" value="name-changes" />
                      <Item label="Symbol And Name Changes" value="symbol-name-changes" />
                      <Item label="Splits" value="splits" />
                      <Item label="Deletion" value="deletions" />
                      <Item label="Suspensions / Halts" value="halts" />
                      <Item label="Piggyback Qualified" value="piggyback-qualified" />
                      <Item label="Anticipated Piggybacks" value="piggyback-anticipated" />
                      <Item label="Ex-Dividends" value="ex-dividends" />
                      <Item label="Scheduled Dividends" value="sch-dividends" />
                      <Item label="Tier Changes" value="tier-changes" />
                      <Item label="Caveat Emptor" value="ce-changes" />
                    </Picker>
                  </View>
                </View>
                <View style={[common_styles.flex_row, common_styles.padding_5]}>
                  <View style={[common_styles.width_25p, common_styles.justifyCenter]}>
                    <MyText>Security Type</MyText>
                  </View>
                  <View style={common_styles.width_75p}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select Security Type"
                      iosIcon={<Icon name="md-caret-down-sharp" />}
                      style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
                      selectedValue={this.state.security_type}
                      onValueChange={this.onChangeType.bind(this)}
                    >
                      <Item label="All" value="" key={Math.random()}/>
                      {this._render_security_types()}
                    </Picker>
                  </View>
                </View>
                <View style={[common_styles.flex_row, common_styles.padding_5]}>
                  <View style={[common_styles.width_25p, common_styles.justifyCenter]}>
                    <MyText>Market</MyText>
                  </View>
                  <View style={common_styles.width_75p}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select Market"
                      iosIcon={<Icon name="md-caret-down-sharp" />}
                      style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
                      selectedValue={this.state.tierGroup}
                      onValueChange={this.onChangeMarket.bind(this)}
                    >
                      <Item label="All" value="" key={Math.random()}/>
                      {this._render_markets()}
                    </Picker>
                  </View>
                </View>
                {/*  */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.flex_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_30p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>COMPANY NAME</MyText></View>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>MARKET</MyText></View>
                  <View style={[common_styles.width_5p]}></View>
                </View>
                <View>
                  <FlatList
                        data={this.state.list_data}
                        renderItem={this._renderItem}
                        refreshing={false}
                        keyExtractor={this._keyExtractor}
                        initialNumToRender={10}
                        extraData={this.state}
                      />
                </View>
								{this.state.can_load_more && <View style={[common_styles.view_align_center, common_styles.margin_10]}>
										<TouchableOpacity onPress={() => this._open_more_data()}>
											<MyText style={common_styles.darkGrayColor}>LOAD MORE >></MyText>
										</TouchableOpacity>
									</View>
								}
								<View style={common_styles.view_align_center}>
									<MyText style={common_styles.darkGrayColor}>Displaying {this.state.list_data.length} of {this.state.totalRecords} items</MyText>
								</View>
                <View style={common_styles.margin_b_20} />
							</Content>
						</Container>
				);
		}
}

export default CorporateActions;
