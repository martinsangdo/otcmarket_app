import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../base/BaseScreen.js";
import common_styles from "../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import {C_Const} from '../utils/constant';
import RequestData from '../utils/https/RequestData';
import store from 'react-native-simple-store';
import Spinner from 'react-native-loading-spinner-overlay';

class ComplianceStatistic extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        data: {
          promotions: [],
          promotionsCaveatEmptor: [],
          promotionsNameChanges: [],
          promotionShell: [],
          promotionsSuspensionRevocation: [],
          reverseSplits: []
        }
			};
		}
		//
		componentDidMount() {
      this._load_data();
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
    //
    _load_data(){
      var me = this;
      me.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(API_URI.PROMO_DATA, (detail, error) => {
          if (detail){
            var data = me.state.data;
            //stock promotions
            if (detail['promotions'] != null && detail['promotions'].length > 0){
              var items = [];
              for (var i=0; i<detail['promotions'].length; i++){
                items.push({
                  symbol: detail['promotions'][i]['symbol'],
                  latestPromoDate: Utils.formatDate(detail['promotions'][i]['latestPromoDate']),
                  promoDuration: Utils.getNullableString(detail['promotions'][i]['promoDuration']),
                  currentClosingPrice: Utils.isEmpty(detail['promotions'][i]['currentClosingPrice'])?'-':detail['promotions'][i]['currentClosingPrice'],
                  startDatePrice: Utils.isEmpty(detail['promotions'][i]['startDatePrice'])?'-':detail['promotions'][i]['startDatePrice']
                });
              }
              data['promotions'] = items;
            }
            //Shell status
            if (detail['promotionsShell'] != null && detail['promotionsShell'].length > 0){
              var items = [];
              for (var i=0; i<detail['promotionsShell'].length; i++){
                items.push({
                  symbol: detail['promotionsShell'][i]['symbol'],
                  shellChangeDate: Utils.formatDate(detail['promotionsShell'][i]['shellChangeDate']),
                  oldValue: detail['promotionsShell'][i]['oldValue'],
                  newValue: detail['promotionsShell'][i]['newValue'],
                  currentClosingPrice: Utils.isEmpty(detail['promotionsShell'][i]['currentClosingPrice'])?'-':detail['promotionsShell'][i]['currentClosingPrice'],
                  marketCap: Utils.isEmpty(detail['promotionsShell'][i]['marketCap'])?'-':Utils.shorten_big_num(detail['promotionsShell'][i]['marketCap'])
                });
              }
              data['promotionsShell'] = items;
            }
            //
            me.setState({data: data});
          } else if (error){
            //do nothing
          }
          me.setState({loading_indicator_state: false});
        });
      });
    }
    //
		_keyExtractor = (item) => item.symbol+Math.random()+'';
		//render the list. MUST use "item" as param
		_renderItemPromotion = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_25p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.latestPromoDate}</Text></View>
          <View style={[common_styles.width_10p]}><Text style={common_styles.float_right}>{item.promoDuration}</Text></View>
          <View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.startDatePrice}</Text></View>
          <View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.currentClosingPrice}</Text></View>
				</View>
		);
    //
    //render the list. MUST use "item" as param
		_renderItemPromotionShell = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><Text style={common_styles.float_right}>{item.shellChangeDate}</Text></View>
          <View style={[common_styles.width_10p]}><Text style={common_styles.float_right}>{item.oldValue}</Text></View>
          <View style={[common_styles.width_10p]}><Text style={common_styles.float_right}>{item.newValue}</Text></View>
          <View style={[common_styles.width_15p]}><Text style={common_styles.float_right}>{item.currentClosingPrice}</Text></View>
          <View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.marketCap}</Text></View>
				</View>
		);
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>COMPLIANCE & STATISTICS</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                {/* Stock Promotions */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>STOCK PROMOTIONS</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>DATE</Text></View>
                  <View style={common_styles.width_10p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>DUR</Text></View>
                  <View style={[common_styles.width_20p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>STRPRC</Text></View>
                  <View style={[common_styles.width_20p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLOPRC</Text></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['promotions']}
												renderItem={this._renderItemPromotion}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
												extraData={this.state}
											/>
								</View>
                {/* Shell status change */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>SHELL STATUS CHANGES</Text></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>DATE</Text></View>
                  <View style={common_styles.width_10p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>OLD VAL</Text></View>
                  <View style={[common_styles.width_10p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>NEW VAL</Text></View>
                  <View style={[common_styles.width_15p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLOSE PRICE</Text></View>
                  <View style={[common_styles.width_20p]}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CAP (M)</Text></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['promotionsShell']}
												renderItem={this._renderItemPromotionShell}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
												extraData={this.state}
											/>
								</View>

								<View style={common_styles.margin_b_20} />
							</Content>
						</Container>
				);
		}
}

export default ComplianceStatistic;
