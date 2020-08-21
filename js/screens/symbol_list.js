import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox, TextInput} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Form, Item, Input} from "native-base";

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

class SymbolList extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        full_data_list:[],    //all symbols
        display_data_list: [],
        keyword: '',
        no_result_found: false
			};
		}
		//
		componentDidMount() {
      var me = this;
			Utils.get_data_from_cache(API_URI.SYMBOL_LIST.CACHE_TIME_KEY, API_URI.SYMBOL_LIST.CACHE_TIME_DURATION,
				API_URI.SYMBOL_LIST.URL, (has_cache_data, cache_data)=>{
				if (has_cache_data){
					//parse cached data
          var display_data_list = [];
          for (var i=0; i<API_URI.SYMBOL_LIST.MAX_ITEM_LEN; i++){
            display_data_list.push({
              symbol: cache_data[i]['symbol'],
              name: cache_data[i]['name']
            });
          }
					me.setState({full_data_list: cache_data, display_data_list: display_data_list});
				} else {
          // Utils.dlog('load all symbol list from server');
					//get from server
          me._load_data();
				}
			});
		}
    //
    _load_data(){
      var me = this;
      this.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(API_URI.SYMBOL_LIST.URL, (list, error) => {
            if (list){
              var full_data_list = [], display_data_list = [];
              for (var i=0; i<list.length; i++){
                full_data_list.push({
                  symbol: list[i]['s'],
                  name: list[i]['c']
                });
                if (i<API_URI.SYMBOL_LIST.MAX_ITEM_LEN){
                  display_data_list.push({
                    symbol: list[i]['s'],
                    name: list[i]['c']
                  });
                }
              }
              me.setState({full_data_list: full_data_list, display_data_list: display_data_list});
              //save cache
              store.update(API_URI.SYMBOL_LIST.URL, {d:full_data_list});
              store.update(API_URI.SYMBOL_LIST.CACHE_TIME_KEY, {t: Utils.get_current_timestamp()});
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
    //used to show list of stocks (Home, current_market)
		_renderItem = ({item}) => (
      <View style={[common_styles.border_b_gray]}>
				<View style={[styles.list_item, common_styles.fetch_row]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_25p_first]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailQuote', {symbol: item.symbol})}
            >
  						<MyText style={common_styles.default_font_color}>{item.symbol}</MyText>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_75p]}><MyText>{item.name}</MyText></View>
        </View>
      </View>
		);
    //search symbol by name or symbol code
    _search_symbol(){
      var keyword = Utils.trim(this.state.keyword);
      if (Utils.isEmpty(keyword) || keyword.length == 1){
        return;
      }
      keyword = keyword.toLowerCase();
      var full_data_list = this.state.full_data_list;
      var len = full_data_list.length;
      var result_list = [];
      for (var i=0; i<len; i++){
        if (result_list.length == 50){  //show max 50 results
          break;
        }
        if (full_data_list[i]['symbol'].toLowerCase().indexOf(keyword) > -1 || full_data_list[i]['name'].toLowerCase().indexOf(keyword) > -1){
          //found it
          result_list.push(full_data_list[i]);
        }
      }
      this.setState({no_result_found: result_list.length == 0, display_data_list: result_list});
    }
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
                  <TouchableOpacity onPress={() => this._on_go_back()}>
                    <View style={styles.left_row}>
                      <View style={[common_styles.float_center]}>
                        <Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
                      </View>
                      <View style={[common_styles.margin_l_10, common_styles.float_center]}>
                        <MyText uppercase={false} style={[common_styles.default_font_color]}>Back</MyText>
                      </View>
                    </View>
                  </TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>Stock Finder</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                <View style={common_styles.margin_b_20} />
                <Form style={[common_styles.flex_row, common_styles.space_around]}>
									<Item style={styles.symbol_finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Type to search" onChange={(event) => this.setState({keyword : event.nativeEvent.text})} value={this.state.keyword}/>
									</Item>
                  <TouchableOpacity style={[common_styles.default_button]} onPress={() => this._search_symbol()}>
										<MyText style={common_styles.whiteColor}>Search</MyText>
									</TouchableOpacity>
								</Form>
                {this.state.no_result_found &&
                  <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
  									<MyText style={common_styles.darkGrayColor}>No results found</MyText>
  								</View>
                }
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</MyText></View>
                  <View style={[common_styles.width_75p]}><MyText style={[common_styles.darkGrayColor, common_styles.bold]}>NAME</MyText></View>
                </View>
                <View>
									<FlatList
												data={this.state.display_data_list}
												renderItem={this._renderItem}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={25}
												extraData={this.state}
											/>
								</View>
                <View style={common_styles.margin_b_10} />
                <View style={common_styles.view_align_center}>
									<MyText style={common_styles.darkGrayColor}>Displaying {this.state.display_data_list.length} of {Utils.format_currency_thousand(this.state.full_data_list.length)} items</MyText>
								</View>
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default SymbolList;
