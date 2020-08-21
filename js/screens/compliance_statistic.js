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
import MyText from '../component/MyText';

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
		}
    //
    _load_data(){
      var me = this;
      me.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(API_URI.PROMO_DATA, (detail, error) => {
          if (detail){
            var data = me.state.data;
            //stock promotions
            var current_category = 'promotions';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['symbol'],
                  latestPromoDate: Utils.formatDate(detail[current_category][i]['latestPromoDate']),
                  promoDuration: Utils.getNullableString(detail[current_category][i]['promoDuration']),
                  currentClosingPrice: Utils.isEmpty(detail[current_category][i]['currentClosingPrice'])?'-':Utils.number_to_float(detail[current_category][i]['currentClosingPrice']),
                  startDatePrice: Utils.isEmpty(detail[current_category][i]['startDatePrice'])?'-':detail[current_category][i]['startDatePrice']
                });
              }
              data[current_category] = items;
            }
            //Shell status
            current_category = 'promotionsShell';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['symbol'],
                  shellChangeDate: Utils.formatDate(detail[current_category][i]['shellChangeDate']),
                  oldValue: detail[current_category][i]['oldValue'],
                  newValue: detail[current_category][i]['newValue'],
                  currentClosingPrice: Utils.isEmpty(detail[current_category][i]['currentClosingPrice'])?'-':Utils.number_to_float(detail[current_category][i]['currentClosingPrice']),
                  marketCap: Utils.isEmpty(detail[current_category][i]['marketCap'])?'-':Utils.shorten_big_num(detail[current_category][i]['marketCap'])
                });
              }
              data[current_category] = items;
            }
            //revert splits
            current_category = 'reverseSplits';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['newSymbol'],
                  oldSymbol: detail[current_category][i]['oldSymbol'],
                  splitEffectiveDate: Utils.formatDate(detail[current_category][i]['splitEffectiveDate']),
                  splitRatio: detail[current_category][i]['splitRatio'],
                  closePricePreSplit: Utils.isEmpty(detail[current_category][i]['closePricePreSplit'])?'-':Utils.number_to_float(detail[current_category][i]['closePricePreSplit'])
                });
              }
              data[current_category] = items;
            }
            //company name change
            current_category = 'promotionsNameChanges';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['newSymbol'],
                  oldSymbol: detail[current_category][i]['oldSymbol'],
                  effectiveDate: Utils.formatDate(detail[current_category][i]['effectiveDate']),
                  oldCompanyName: detail[current_category][i]['oldCompanyName'],
                  newCompanyName: detail[current_category][i]['newCompanyName']
                });
              }
              data[current_category] = items;
            }
            //Caveat emptor
            current_category = 'promotionsCaveatEmptor';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['symbol'],
                  change: detail[current_category][i]['newValue']=='Y'?'Added':'Removed',
                  changeDate: Utils.formatDate(detail[current_category][i]['changeDate']),
                  closingPrice: Utils.number_to_float(detail[current_category][i]['closingPrice']),
                  marketCap: Utils.isEmpty(detail[current_category][i]['marketCap'])?'-':Utils.shorten_big_num(detail[current_category][i]['marketCap'])
                });
              }
              data[current_category] = items;
            }
            //Suspensions
            current_category = 'promotionsSuspensionRevocation';
            if (detail[current_category] != null && detail[current_category].length > 0){
              var items = [];
              for (var i=0; i<detail[current_category].length; i++){
                items.push({
                  symbol: detail[current_category][i]['symbol'],
                  effectiveDate: Utils.formatDate(detail[current_category][i]['effectiveDate']),
                  closingPrice: Utils.number_to_float(detail[current_category][i]['closingPrice']),
                  currentStatus: detail[current_category][i]['currentStatus'],
                  marketCap: Utils.isEmpty(detail[current_category][i]['marketCap'])?'-':Utils.shorten_big_num(detail[current_category][i]['marketCap'])
                });
              }
              data[current_category] = items;
            }
            //save it
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
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><MyText>{item.latestPromoDate}</MyText></View>
          <View style={[common_styles.width_10p]}><MyText style={common_styles.float_right}>{item.promoDuration}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.startDatePrice}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.currentClosingPrice}</MyText></View>
				</View>
		);
    //
		_renderItemPromotionShell = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><MyText>{item.shellChangeDate}</MyText></View>
          <View style={[common_styles.width_10p]}><MyText style={common_styles.float_right}>{item.oldValue}</MyText></View>
          <View style={[common_styles.width_10p]}><MyText style={common_styles.float_right}>{item.newValue}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.currentClosingPrice}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.marketCap}</MyText></View>
				</View>
		);
    //
		_renderItemPromotionRevertSplits = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><MyText>{item.splitEffectiveDate}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.oldSymbol}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.splitRatio}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.closePricePreSplit}</MyText></View>
				</View>
		);
    //
		_renderItemPromotionCompName = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><MyText>{item.effectiveDate}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText>{item.oldSymbol}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.font_12}>{item.oldCompanyName}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.font_12}>{item.newCompanyName}</MyText></View>
				</View>
		);
    //Caveat emptor
		_renderItemPromotionCaveatEmptor = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><MyText>{item.changeDate}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.change}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.closingPrice}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.marketCap}</MyText></View>
				</View>
		);
    //Suspensions
		_renderItemPromotionSuspensions = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
          <View style={[common_styles.width_25p]}><MyText>{item.effectiveDate}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText>{item.currentStatus}</MyText></View>
          <View style={[common_styles.width_15p]}><MyText style={common_styles.float_right}>{item.closingPrice}</MyText></View>
          <View style={[common_styles.width_20p]}><MyText style={common_styles.float_right}>{item.marketCap}</MyText></View>
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
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>Compliance & Statistics</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                {/* Stock Promotions */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>STOCK PROMOTIONS</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_10p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>DUR</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>STRPRC</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLOPRC</MyText></View>
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
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>SHELL STATUS CHANGES</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_10p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>OLD VAL</MyText></View>
                  <View style={[common_styles.width_10p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>NEW VAL</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLOSE PRICE</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CAP</MyText></View>
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
                {/* reverseSplits */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>REVERSE SPLITS</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_15p}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>OLD SYM</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>RATIO</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLOSE PS</MyText></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['reverseSplits']}
												renderItem={this._renderItemPromotionRevertSplits}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
												extraData={this.state}
											/>
								</View>
                {/* Company name changes */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>COMPANY NAME CHANGES</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_15p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>OLD SYM</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>OLD NAME</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>NEW NAME</MyText></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['promotionsNameChanges']}
												renderItem={this._renderItemPromotionCompName}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
												extraData={this.state}
											/>
								</View>
                {/* Caveat Emptor */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>CAVEAT EMPTOR</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>CHANGE</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLO PRC</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CAP</MyText></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['promotionsCaveatEmptor']}
												renderItem={this._renderItemPromotionCaveatEmptor}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={10}
												extraData={this.state}
											/>
								</View>
                {/* Suspensions */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.margin_5]}><MyText style={[common_styles.heading_1]}>SUSPENSIONS / REVOCATIONS</MyText></View>
								<View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</MyText></View>
                  <View style={common_styles.width_20p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>CURSTAT</MyText></View>
                  <View style={[common_styles.width_15p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CLO PRC</MyText></View>
                  <View style={[common_styles.width_20p]}><MyText style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>CAP</MyText></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['promotionsSuspensionRevocation']}
												renderItem={this._renderItemPromotionSuspensions}
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
