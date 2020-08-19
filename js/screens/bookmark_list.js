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

class BookmarkList extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        full_data_list: [],
        display_data_list: [],
        bookmarked_symbols: {}
			};
		}
		//
		componentDidMount() {
      this._load_bookmarked_list();
		}
    //
		componentDidUpdate() {
      var me = this;
		}
    //
    _load_data(){
      var me = this;
      this.setState({loading_indicator_state: true}, ()=>{
        RequestData.sentGetRequest(API_URI.SYMBOL_LIST.URL, (list, error) => {
            if (list){
              var bookmarked_symbols = me.state.bookmarked_symbols;
              var full_data_list = [], display_data_list = [];
              for (var i=0; i<list.length; i++){
                if (bookmarked_symbols[list[i]['s']]){
                  //saved in bookmarks
                  display_data_list.push({
                    symbol: list[i]['s'],
                    name: list[i]['c']
                  });
                }
                full_data_list.push({
                  symbol: list[i]['s'],
                  name: list[i]['c']
                });
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
    _load_bookmarked_list(){
      var me = this;
      store.get(C_Const.STORE_KEY.BOOKMARKED_SYMBOLS)
      .then(saved_symbols => {
        if (saved_symbols!=null && saved_symbols.d!=null){
          var bookmarked_symbols = saved_symbols.d;
					// Utils.xlog('bookmarked_symbols', bookmarked_symbols);
          me.setState({ bookmarked_symbols : bookmarked_symbols}, ()=>{
            Utils.get_data_from_cache(API_URI.SYMBOL_LIST.CACHE_TIME_KEY, API_URI.SYMBOL_LIST.CACHE_TIME_DURATION,
      				API_URI.SYMBOL_LIST.URL, (has_cache_data, cache_data)=>{
      				if (has_cache_data){
      					//parse cached data
                var display_data_list = [];
                for (var i=0; i<cache_data.length; i++){
                  if (bookmarked_symbols[cache_data[i]['symbol']]){
                    display_data_list.push({
                      symbol: cache_data[i]['symbol'],
                      name: cache_data[i]['name']
                    });
                  }
                }
      					me.setState({full_data_list: cache_data, display_data_list: display_data_list});
      				} else {
      					//get from server
                me._load_data();
      				}
      			});
          });;
        }
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
									<MyText style={[common_styles.bold, common_styles.default_font_color]}>Bookmark</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<TouchableOpacity style={common_styles.margin_r_20} onPress={() => this._load_bookmarked_list()}>
										<Icon name="ios-refresh" style={[common_styles.header_icon, common_styles.greenColor]}/>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
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
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default BookmarkList;
