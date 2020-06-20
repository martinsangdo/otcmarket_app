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

class ForeignExchange extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
        loading_indicator_state: false,
				current_page: 1,
				list_data: [],
				totalRecords: 0,
				can_load_more: true
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
				var url = API_URI.FOREIGN_EXCHANGE.replace(/<page_index>/g, this.state.current_page);
        RequestData.sentGetRequest(url, (detail, error) => {
          if (detail){
            var data = me.state.list_data;
						for (var i=0; i<detail['qualifiedForeignExchanges'].length; i++){
							data.push({	//append
								country: detail['qualifiedForeignExchanges'][i]['country'],
								name: detail['qualifiedForeignExchanges'][i]['name'],
								tier: Utils.getNullableString(detail['qualifiedForeignExchanges'][i]['tier'])=='No Tier'?'':Utils.getNullableString(detail['qualifiedForeignExchanges'][i]['tier'])
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
    }
    //
		_keyExtractor = (item) => item.country+Math.random()+'';
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, common_styles.border_b_gray, common_styles.padding_b_5]} key={item.country+Math.random()+''}>
					<View style={[common_styles.width_25p]}><Text>{item.country}</Text></View>
					<View style={[common_styles.width_50p]}><Text style={common_styles.font_12}>{item.name}</Text></View>
          <View style={[common_styles.width_25p]}><Text>{item.tier}</Text></View>
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Qualified Foreign Exchange</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
								<View style={[common_styles.view_align_center, common_styles.padding_5]}>
									<Text style={common_styles.darkGrayColor}>Companies listed on a Qualified Foreign Exchange can leverage OTCQX or OTCQB to access an efficient and cost-effective secondary market in the U.S.</Text>
								</View>
                {/*  */}
                <View style={common_styles.margin_b_20} />
                <View style={[common_styles.fetch_row, common_styles.padding_5]}>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>COUNTRY</Text></View>
                  <View style={common_styles.width_50p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>STOCK EXCHANGE</Text></View>
                  <View style={common_styles.width_25p}><Text style={[common_styles.darkGrayColor, common_styles.bold]}>EXCHANGE TIER</Text></View>
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

export default ForeignExchange;
