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
import Toast from 'react-native-simple-toast';
import {setting} from '../utils/config.js';

const Item = Picker.Item;

class NewsReports extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
        tierGroup: 'ALL',
        current_category: 'news',   //news, reports, secs
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
      this._load_data('news');
      this._load_data('reports');
      this._load_data('secs');
		}
    //
    _load_data(category){
      var me = this;
      me.setState({loading_indicator_state: true}, ()=>{
        var url = '';
        switch (category) {
          case 'news':
            url = API_URI.NEWS_REPORTS.NEWS_URI;
            break;
          case 'reports':
            url = API_URI.NEWS_REPORTS.FINANCIAL_URI;
            break;
          case 'secs':
            url = API_URI.NEWS_REPORTS.SEC_URI;
            break;
        }
        url = url.replace(/<tierGroup>/g, this.state.tierGroup).
            replace('<page_index>', this.state.data[category]['current_page']);
        //
        RequestData.sentGetRequest(url, (detail, error) => {
          if (detail){
            var records = detail['records'];
            if (records != null){
              var data = me.state.data;
              var item;
              for (var i=0; i<records.length; i++){
                item = {
                  id: records[i]['id'],
                  title: category=='secs'?records[i]['formType']:records[i]['title'],
                  symbol: records[i]['symbol'],
                  tierCode: records[i]['tierCode'],
                  releaseDate: category=='secs'?Utils.formatDate(records[i]['receivedDate']):Utils.formatDate(records[i]['releaseDate'])
                };
                if (category=='secs'){
                  item['guid'] = records[i]['guid'];
                }
                data[category]['list'].push(item);   //append
              }
              data[category]['totalRecords'] = detail['totalRecords'];
              if (data[category]['list'].length >= detail['totalRecords']){
                data[category]['can_load_more'] = false;
              }
              me.setState({data: data});
            }
          } else if (error){
            //do nothing
          }
          me.setState({loading_indicator_state: false});
        });
      });
    }
    //
    _open_news_detail(news_id, guid){
      var me = this;
      if (this.state.current_category == 'secs'){
        //break guid, get middle id only
        var arr_guid = guid.split('-');
        var str_core_guid = '';
        if (arr_guid.length == 1){
          str_core_guid = guid[0];
        } else if (arr_guid.length == 3){
          str_core_guid = arr_guid[1];  //middle
        } else if (arr_guid.length > 3){
          //more than 3 segments
          var first_index = guid.indexOf('-');
          var last_index = guid.lasIndexOf('-');
          str_core_guid = guid.substring(first_index, last_index);
        }
        //
        var url_content = API_URI.SEC_FILLING_DETAIL.replace(/<id>/g, news_id).replace(/<guid>/g, str_core_guid);
        me._navigateCanBackTo('WebViewer', {url:url_content, pure_link: true});
      } else {
        var url = API_URI.STOCK_DETAIL.NEWS_DETAIL + news_id;
        //
        RequestData.sentGetRequest(url, (detail, error) => {
          if (detail){
            if (!Utils.isEmpty(detail['documentList']) && !Utils.isEmpty(detail['documentList'][0]) && !Utils.isEmpty(detail['documentList'][0]['url'])){
              me._open_pdf_viewer(setting.BACKEND_SERVER_URI + detail['documentList'][0]['url']);
            } else {
              var url_content = API_URI.STOCK_DETAIL.NEWS_CONTENT.replace(/<id>/g, news_id);
              me._navigateCanBackTo('WebViewer', {url:url_content});
            }
          } else if (error){
            Toast.show('No resource is available for this item!');
          }
        });
      }
    }
    //
		_keyExtractor = (item) => item.id+Math.random()+'';
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.id+Math.random()+''}>
					<View style={[common_styles.width_25p, common_styles.flex_row]}>
            <View style={[common_styles.margin_r_5]}>
              <Image source={this._get_symbol_icon(item.tierCode)} style={[styles.stock_ico]}/>
            </View>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_25p]}><Text>{item.releaseDate}</Text></View>
          <View style={[common_styles.width_50p]}>
            <TouchableOpacity
              onPress={() => this._open_news_detail(item.id, item.guid)}
            >
              <Text style={common_styles.underline}>{item.title}</Text>
            </TouchableOpacity>
          </View>
				</View>
		);
    //
    _open_more_data(){
      var data = this.state.data;
      data[this.state.current_category]['current_page'] += 1;
      this.setState({data: data}, ()=>{
        this._load_data(this.state.current_category);
      });
    }
    //
    _change_category(category){
      this.setState({current_category: category});
    }
    //
		onChangeMarket(newMarket) {
      if (newMarket != this.state.tierGroup){
        this.setState({tierGroup: newMarket, loading_indicator_state: true,
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
        }, ()=>{
          this._load_data('news');
          this._load_data('reports');
          this._load_data('secs');
  			});
      }
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>NEWS & FINANCIAL REPORTS</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} color={C_Const.SPINNER_COLOR} />
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.border_b_tab, common_styles.margin_5]}>
									<TouchableOpacity onPress={() => this._change_category('news')}>
				          	<View style={[common_styles.padding_5, this.state.current_category=='news'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.current_category=='news'&&common_styles.bold]}>NEWS</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_category('reports')}>
										<View style={[common_styles.padding_5, this.state.current_category=='reports'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.current_category=='reports'&&common_styles.bold]}>FINANCIAL REPORTS</Text></View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._change_category('secs')}>
										<View style={[common_styles.padding_5, this.state.current_category=='secs'&&common_styles.border_b_active]}><Text style={[common_styles.blackColor, this.state.current_category=='secs'&&common_styles.bold]}>SEC FILLINGS</Text></View>
									</TouchableOpacity>
				        </View>
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
  								</Picker>
								</View>
                <View style={common_styles.margin_b_20} />
                <View>
									<FlatList
												data={this.state.data[this.state.current_category]['list']}
												renderItem={this._renderItem}
												refreshing={false}
												keyExtractor={this._keyExtractor}
												initialNumToRender={20}
												extraData={this.state}
											/>
								</View>
  							{this.state.data[this.state.current_category]['can_load_more'] && <View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
  									<TouchableOpacity onPress={() => this._open_more_data()}>
  										<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
  									</TouchableOpacity>
  								</View>
                }
                <View style={common_styles.margin_b_10} />
                <View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Displaying {this.state.data[this.state.current_category]['list'].length} of {this.state.data[this.state.current_category].totalRecords} items</Text>
								</View>
								<View style={common_styles.margin_b_30} />
							</Content>
						</Container>
				);
		}
}

export default NewsReports;
