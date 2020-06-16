import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Card,
  CardItem, Picker} from "native-base";

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

class NewsReports extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        tierGroup: 'ALL',
        data: {
          news: {
            current_page: 1,
            list: [],
            can_load_more: true,
            totalRecords: 0
          },
          reports: {
            current_page: 1,
            list: [],
            can_load_more: true,
            totalRecords: 0
          },
          secs: {
            current_page: 1,
            list: [],
            can_load_more: true,
            totalRecords: 0
          }
        }
			};
		}
		//
		componentDidMount() {
      this._load_news();
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
    //
    _load_news(){
      var category = 'news';
      var me = this;
      var url = API_URI.NEWS_REPORTS.NEWS_URI.
          replace(/<tierGroup>/g, this.state.tierGroup).
          replace('<page_index>', this.state.data[category]['current_page']);
      //
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          var records = detail['records'];
          if (records != null){
            var data = me.state.data;
            for (var i=0; i<records.length; i++){
              data[category]['list'].push({
                id: records[i]['id'],
                title: records[i]['title'],
                symbol: records[i]['symbol'],
                releaseDate: Utils.formatDate(records[i]['releaseDate'])
              });
            }
            data[category]['totalRecords'] = detail['totalRecords'];
            if (data[category]['list'].length >= detail['totalRecords']){
              data[category]['can_load_more'] = false;
            }
            Utils.xlog('data', data);
            me.setState({data: data});
          }
        } else if (error){
          //do nothing
        }
      });
    }
    //
		_keyExtractorNews = (item) => item.id+'';
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItemNews = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.id+''}>
					<View style={[common_styles.width_25p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><Text>{item.releaseDate}</Text></View>
					<View style={[common_styles.width_50p]}><Text>{item.title}</Text></View>
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>NEWS & FINANCIAL REPORTS</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                <View style={common_styles.margin_b_20} />
								<View style={[common_styles.margin_5]}><Text style={[common_styles.heading_1]}>NEWS</Text></View>
                <View style={[common_styles.flex_row, common_styles.border_b_tab, common_styles.margin_5]}></View>
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>DATE</Text></View>
                  <View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>TITLE</Text></View>
                </View>
                <View>
									<FlatList
												data={this.state.data['news']['list']}
												renderItem={this._renderItemNews}
												refreshing={false}
												keyExtractor={this._keyExtractorNews}
												initialNumToRender={20}
												extraData={this.state}
											/>
								</View>
  							{this.state.can_load_more && <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
  									<TouchableOpacity onPress={() => this._open_more_data()}>
  										<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
  									</TouchableOpacity>
  								</View>
                }
                <View style={common_styles.margin_b_10} />
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Displaying {this.state.data['news']['list'].length} of {this.state.data['news'].totalRecords} items</Text>
								</View>
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default NewsReports;
