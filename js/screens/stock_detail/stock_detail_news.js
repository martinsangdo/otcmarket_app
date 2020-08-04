import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox, Dimensions} from "react-native";

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
import Toast from 'react-native-simple-toast';

const Item = Picker.Item;
const deviceWidth = Dimensions.get("window").width;

class StockDetailNews extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        current_detail_part: 'news',
        symbol:'',  //current stock
        list_data: [],
        current_page: 1,
        can_load_more: true,
        totalRecords: 0,
        bookmarked_symbols:{}
			};
		}
		//
		componentDidMount() {
      this.setState({
        symbol:this.props.navigation.state.params.symbol
      }, ()=>{
        this._load_bookmarked_state();
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
          current_detail_part: 'news',
          dividend_data: [],
          news_data: [],
          current_page: 1,
          can_load_more: true,
          totalRecords: 0,
          bookmarked_symbols:{}
        }, ()=>{
          this._load_bookmarked_state();
          this._load_data();
        });
      }
		}
    //
    _load_bookmarked_state(){
      var me = this;
			store.get(C_Const.STORE_KEY.BOOKMARKED_SYMBOLS)
			.then(saved_symbols => {
				// Utils.xlog('saved_symbols', saved_symbols.d);
				if (saved_symbols!=null && saved_symbols.d!=null){
					me.setState({bookmarked_symbols: saved_symbols.d});
				}
			});
    }
    //
    _load_data(){
      var me = this;
      var url = API_URI.STOCK_DETAIL.NEWS.replace(/<symbol>/g, this.state.symbol) + this.state.current_page;
      //
      setTimeout(()=>{
        this.setState({loading_indicator_state: true}, ()=>{
          RequestData.sentGetRequest(url, (detail, error) => {
            if (detail){
              var records = detail['records'];
              if (records != null){
                var list_data = me.state.list_data;
                for (var i=0; i<records.length; i++){
                  list_data.push({
                    id: records[i]['id'] + '',
                    title: records[i]['title'],
                    newsTypeDescript: records[i]['newsTypeDescript'],
                    displayDateTime: records[i]['displayDateTime']
                  });
                }
              }
              // Utils.dlog(list_data);
              me.setState({list_data: list_data, totalRecords: detail['totalRecords']}, ()=>{
                if (me.state.list_data.length >= detail['totalRecords']){
                  me.setState({can_load_more: false});
                }
              });
            } else if (error){
              //do nothing
            }
            me.setState({loading_indicator_state: false});
          });
        });
      }, C_Const.DELAY_LOAD_SPINNER);
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
		_keyExtractorNews = (item) => item.id;
		//render the list. MUST use "item" as param
		_renderItemNews = ({item}) => (
      <View style={[styles.list_item]} key={item.id}>
					<View>
            <TouchableOpacity onPress={()=>this._download_detail(item.id)}>
              <Text style={[common_styles.bold]}>{item.title}</Text>
            </TouchableOpacity>
          </View>
          <View><Text style={common_styles.font_15}>{item.newsTypeDescript} | {item.displayDateTime}</Text></View>
          <View style={[common_styles.margin_b_5, common_styles.margin_t_10, common_styles.border_b_gray]} />
			</View>
		);
    //
    _open_more_page(){
      if (this.state.loading_indicator_state || !this.state.can_load_more){
				return;
			}
      this.setState({current_page: this.state.current_page+1}, ()=>{
        this._load_data();
      });
    }
    //
    _download_detail(news_id){
      var me = this;
      var url = API_URI.STOCK_DETAIL.NEWS_DETAIL + news_id;
      //
      RequestData.sentGetRequest(url, (detail, error) => {
        if (detail){
          if (!Utils.isEmpty(detail['documentList']) && !Utils.isEmpty(detail['documentList'][0]) && !Utils.isEmpty(detail['documentList'][0]['url'])){
            this._open_pdf_viewer(setting.BACKEND_SERVER_URI + detail['documentList'][0]['url']);
          } else {
            var url_content = API_URI.STOCK_DETAIL.NEWS_CONTENT.replace(/<id>/g, news_id);
            this._navigateCanBackTo('WebViewer', {url:url_content});
          }
        } else if (error){
          Toast.show('No resource is available for this item!');
        }
      });
    }
    //turn on/off bookmark of this symbol
    _toggle_bookmark(){
      var bookmarked_symbols = Utils.cloneObj(this.state.bookmarked_symbols);
			bookmarked_symbols[this.state.symbol] = !bookmarked_symbols[this.state.symbol];
			//save back to store
			store.update(C_Const.STORE_KEY.BOOKMARKED_SYMBOLS, {d:bookmarked_symbols});
			this.setState({bookmarked_symbols: bookmarked_symbols});
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
                  <TouchableOpacity onPress={() => this._toggle_bookmark()}>
                    {this.state.bookmarked_symbols[this.state.symbol] &&
                      <Icon name="star" style={[common_styles.header_icon, common_styles.margin_b_10, common_styles.greenColor]}/>
                    }
                    {!this.state.bookmarked_symbols[this.state.symbol] &&
                      <Icon name="star-outline" style={[common_styles.header_icon, common_styles.margin_b_10]}/>
                    }
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
                <View style={[common_styles.margin_10]}><Text style={[common_styles.heading_1]}>NEWS DOCUMENTS</Text></View>
                <View style={[common_styles.margin_l_10, common_styles.margin_r_10, common_styles.border_b_tab]} />
                <View><Text style={[common_styles.font_15, common_styles.margin_10, common_styles.darkGrayColor]}>Tap title to view</Text></View>

								<View>
									<FlatList
												data={this.state.list_data}
												renderItem={this._renderItemNews}
												keyExtractor={this._keyExtractorNews}
                        style={{width:deviceWidth, padding:10}}
											/>
								</View>
                {
                  this.state.can_load_more &&
                    <View style={common_styles.view_align_center}>
    									<TouchableOpacity onPress={() => this._open_more_page()}>
    										<Text style={common_styles.darkGrayColor}>VIEW MORE >></Text>
    									</TouchableOpacity>
    								</View>
                }
                <View style={common_styles.margin_b_20} />
              </Content>
						</Container>
				);
		}
}

export default StockDetailNews;
