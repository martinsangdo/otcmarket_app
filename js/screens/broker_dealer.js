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

const Item = Picker.Item;

class BrokerDealer extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
				tierGroup: 'ALL',	//ALL, QX, DQ, PS, OO
        snapshot_data: {},
				current_type: 'EXCECUTED_VOLUME',	//EXCECUTED_VOLUME/EXCECUTED_LINK_VOLUME/TOTAL_LINK_VOLUME/RESPONSE_QUALITY
				current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true
			};
		}
		//
		componentDidMount() {
			this._load_snaphot_market();
			this._load_data();
		}
		//
    _load_data(){
      var me = this;
      setTimeout(()=>{
        me.setState({loading_indicator_state: true}, ()=>{
  				var url = API_URI.BROKER_DEALER[this.state.current_type].
  						replace(/<page_index>/g, this.state.current_page).replace(/<tierGroup>/g, this.state.tierGroup);
          RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var data = me.state.list_data;
              if (me.state.current_type == 'RESPONSE_QUALITY'){
                for (var i=0; i<detail['records'].length; i++){
    							data.push({	//append
    								mpid: detail['records'][i]['mpid'],
                    brokerDealer: detail['records'][i]['brokerDealer'],
    								l1AvgR: detail['records'][i]['l1AvgR']<1?'<1s':Math.floor(detail['records'][i]['l1AvgR'])+'s',
    								expiredL1Pct: Utils.number_to_float_2(detail['records'][i]['expiredL1Pct'])==''?'0.0':Utils.number_to_float_2(detail['records'][i]['expiredL1Pct']),
                    saturationPct: Utils.number_to_float_2(detail['records'][i]['saturationPct'])==''?'0.0':Utils.number_to_float_2(detail['records'][i]['saturationPct']),
                    qscore: Utils.number_to_float_2(detail['records'][i]['expiredL1Pct'])
    							});
    						}
              } else {
                for (var i=0; i<detail['records'].length; i++){
    							data.push({	//append
    								mpid: detail['records'][i]['mpid'],
                    brokerDealer: detail['records'][i]['brokerDealer'],
    								dollarVolume: Utils.format_currency_thousand(Math.floor(detail['records'][i]['dollarVolume'])),
    								volume: Utils.format_currency_thousand(detail['records'][i]['volume'])
    							});
    						}
              }
              //save it
              me.setState({list_data: data, totalRecords: detail['totalRecords'],
  								can_load_more:detail['totalRecords'] > data.length});
            } else if (error){
              //do nothing
            }
            me.setState({loading_indicator_state: false});
          });
        });
      }, C_Const.DELAY_LOAD_SPINNER);
    }
    //
		_keyExtractor = (item) => item.mpid+Math.random()+'';
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.mpid+Math.random()+''}>
					<View style={[common_styles.width_40p]}><Text>{item.brokerDealer}</Text></View>
					<View style={[common_styles.width_30p]}><Text style={common_styles.float_right}>{item.dollarVolume}</Text></View>
          <View style={[common_styles.width_30p]}><Text style={common_styles.float_right}>{item.volume}</Text></View>
				</View>
		);
    _renderItemResponseQuality = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.mpid+Math.random()+''}>
					<View style={[common_styles.width_40p]}><Text>{item.brokerDealer}</Text></View>
					<View style={[common_styles.width_15p]}><Text style={common_styles.float_right}>{item.l1AvgR}</Text></View>
          <View style={[common_styles.width_15p]}><Text style={common_styles.float_right}>{item.expiredL1Pct}%</Text></View>
          <View style={[common_styles.width_15p]}><Text style={common_styles.float_right}>{item.saturationPct}%</Text></View>
          <View style={[common_styles.width_15p]}><Text style={common_styles.float_right}>{item.qscore}</Text></View>
				</View>
		);
		//general info
		_load_snaphot_market(){
			var me = this;
			var url = API_URI.BROKER_DEALER.SNAPSHOT + this.state.tierGroup;
			RequestData.sentGetRequest(url, (detail, error) => {
					if (detail){
						try{
							var save_detail = {
								dollarVolume: Utils.format_currency_thousand(Utils.number_to_float_2(detail['dollarVolume'])),
								shareVolume: Utils.format_currency_thousand(detail['shareVolume']),
								lastUpdated: Utils.formatTime(detail['lastUpdated']),
								trades: Utils.format_currency_thousand(detail['trades'])
							};
						}catch(e){
						}
						me.setState({snapshot_data: save_detail});
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
  				this._load_snaphot_market();
  				this._load_data();
          setTimeout(() => {
    				this.setState({loading_indicator_state: false});  //stop loading all
    			}, C_Const.MAX_WAIT_RESPONSE);
  			});
      }
	  }
    //
		onChangeType(newType) {
      if (newType != this.state.current_type){
        this.setState({current_type: newType, current_page: 1,
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Broker Dealer Data</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
								<View>
  								<Picker
  									mode="dropdown"
  									iosHeader="Select Market"
  									iosIcon={<Icon name="ios-arrow-down" />}
  									style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
  									selectedValue={this.state.tierGroup}
  									onValueChange={this.onChangeMarket.bind(this)}
  								>
  									<Item label="All Markets" value="ALL" />
  									<Item label="OTCQX" value="QX" />
  									<Item label="OTCQB" value="DQ" />
  									<Item label="Pink" value="PS" />
  									<Item label="Grey" value="OO" />
  								</Picker>
								</View>
								<View style={common_styles.margin_10}>
									<Card>
				            <CardItem>
				              <Body>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>$ VOLUME</Text>
                            <Text>{this.state.snapshot_data['dollarVolume']}</Text>
                          </View>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>SHARE VOLUME</Text>
                            <Text>{this.state.snapshot_data['shareVolume']}</Text>
                          </View>
                        </View>
                        <View style={[common_styles.flex_row]}>
                          <View style={[common_styles.flex_column, common_styles.padding_5, common_styles.width_50p]}>
                            <Text style={[common_styles.darkGrayColor]}>TRADES</Text>
                            <Text>{this.state.snapshot_data['trades']}</Text>
                          </View>
												</View>
				              </Body>
				            </CardItem>
				          </Card>
								</View>
								<View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>{this.state.snapshot_data['lastUpdated']}</Text>
								</View>
                <View>
  								<Picker
  									mode="dropdown"
  									iosHeader="Select Volume"
  									iosIcon={<Icon name="ios-arrow-down" />}
  									style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
  									selectedValue={this.state.current_type}
  									onValueChange={this.onChangeType.bind(this)}
  								>
  									<Item label="Executed Volume" value="EXCECUTED_VOLUME" />
  									<Item label="Executed Link Volume" value="EXCECUTED_LINK_VOLUME" />
  									<Item label="Total Link Volume" value="TOTAL_LINK_VOLUME" />
  									<Item label="Response Statistics" value="RESPONSE_QUALITY" />
  								</Picker>
								</View>
                {/*  */}
                <View style={common_styles.margin_b_20} />
                {
                  this.state.current_type != 'RESPONSE_QUALITY' &&
                  <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                    <View style={common_styles.width_40p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>BROKER DEALER</Text></View>
                    <View style={common_styles.width_30p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>$ VOL</Text></View>
                    <View style={common_styles.width_30p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SHARE VOL</Text></View>
                  </View>
                }
                {
                  this.state.current_type != 'RESPONSE_QUALITY' &&
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
                }
                {
                  this.state.current_type == 'RESPONSE_QUALITY' &&
                  <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                    <View style={common_styles.width_40p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>BROKER DEALER</Text></View>
                    <View style={common_styles.width_15p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>L1 AVG R</Text></View>
                    <View style={common_styles.width_15p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>*EXP L1%</Text></View>
                    <View style={common_styles.width_15p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>**SAT L1%</Text></View>
                    <View style={common_styles.width_15p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SCORE</Text></View>
                  </View>
                }
                {
                  this.state.current_type == 'RESPONSE_QUALITY' &&
                  <View>
  									<FlatList
  												data={this.state.list_data}
  												renderItem={this._renderItemResponseQuality}
  												refreshing={false}
  												keyExtractor={this._keyExtractor}
  												initialNumToRender={10}
  												extraData={this.state}
  											/>
  								</View>
                }

								{this.state.can_load_more && <View style={[common_styles.view_align_center, common_styles.margin_10]}>
										<TouchableOpacity onPress={() => this._open_more_data()}>
											<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
										</TouchableOpacity>
									</View>
								}
								<View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Displaying {this.state.list_data.length} of {this.state.totalRecords} items</Text>
								</View>
								<View style={common_styles.margin_b_20} />
                <View style={[common_styles.view_align_center, common_styles.margin_5]}>
									<Text style={common_styles.darkGrayColor}>* Percent of expired L1 trade messages, per total L1 trade messages</Text>
								</View>
                <View style={[common_styles.view_align_center, common_styles.margin_5]}>
									<Text style={common_styles.darkGrayColor}>** Percent of Saturation events, per total liability trade messages</Text>
								</View>
                <View style={common_styles.margin_b_20} />
							</Content>
						</Container>
				);
		}
}

export default BrokerDealer;
