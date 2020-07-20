import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList, YellowBox} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon, Picker} from "native-base";

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

class ShortInterest extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
				current_date: '',
				dates: [],
				current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true
			};
		}
		//
		componentDidMount() {
			this._load_dates();
		}
		//
		_load_dates(){
			var me = this;
			RequestData.sentGetRequest(API_URI.SHORT_SALE.DATES, (detail, error) => {
				if (detail){
					me.setState({dates: detail, current_date: detail[0]['id']}, me._load_data);
				} else {

				}
			});
		}
    //
    _load_data(){
      var me = this;
			setTimeout(()=>{
	      me.setState({loading_indicator_state: true}, ()=>{
					var url = API_URI.SHORT_SALE.LIST.replace(/<date>/g, this.state.current_date).
								replace(/<page_index>/g, this.state.current_page);
	        RequestData.sentGetRequest(url, (detail, error) => {
	          if (detail){
	            var data = me.state.list_data;
							for (var i=0; i<detail['records'].length; i++){
								data.push({	//append
									symbol: detail['records'][i]['symbol'],
									securityName: detail['records'][i]['securityName'],
									shortInterest: Utils.format_currency_thousand(detail['records'][i]['shortInterest'])
								});
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
		_keyExtractor = (item) => item.symbol+Math.random()+'';
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.symbol+Math.random()+''}>
					<View style={[common_styles.width_20p, common_styles.flex_row]}>
            <TouchableOpacity
              onPress={() => this._navigateCanBackTo('StockDetailQuote', {symbol: item.symbol})}
            >
  						<Text style={common_styles.default_font_color}>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[common_styles.width_60p]}><Text>{item.securityName}</Text></View>
          <View style={[common_styles.width_20p]}><Text style={common_styles.float_right}>{item.shortInterest}</Text></View>
				</View>
		);
		//
		onChangeDate(date){
			this.setState({current_date: date, current_page: 1,
			list_data: [],
			totalRecords: 0}, ()=>{
				this._load_data();
			})
		}
		//
		_render_dates(){
			var display_options = this.state.dates.map(function(item){
				return <Item label={item.caption} value={item.id} key={Math.random()}/>;
			});
			return display_options;
		}
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Short Interest Data</Text>
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
  									iosHeader="Select Date"
  									iosIcon={<Icon name="ios-arrow-down" />}
  									style={{ width: undefined, backgroundColor: '#ddd', margin:5 }}
  									selectedValue={this.state.current_date}
  									onValueChange={(newval)=>{this.onChangeDate(newval)}}
  								>
  									{this._render_dates()}
  								</Picker>
								</View>
								<View style={[common_styles.view_align_center, common_styles.padding_5]}>
									<Text style={common_styles.darkGrayColor}>Short position data for OTC equity securities must be reported by FINRA Member firms (FINRA Rule 4560) twice monthly. The table below groups securities by the settlement date of short interest reporting. Historical details at the symbol level may be found by selecting the symbol link.</Text>
								</View>
                {/* SHORT INTEREST BY SYMBOL */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_20p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SYMBOL</Text></View>
                  <View style={common_styles.width_60p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>SECURITY NAME</Text></View>
                  <View style={common_styles.width_20p}><Text style={[common_styles.darkGrayColor, common_styles.float_right, common_styles.bold]}>SHORT INTEREST</Text></View>
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
											<Text style={common_styles.darkGrayColor}>LOAD MORE >></Text>
										</TouchableOpacity>
									</View>
								}
								<View style={common_styles.view_align_center}>
									<Text style={common_styles.darkGrayColor}>Displaying {this.state.list_data.length} of {this.state.totalRecords} items</Text>
								</View>
								<View style={common_styles.margin_b_20} />
							</Content>
						</Container>
				);
		}
}

export default ShortInterest;
