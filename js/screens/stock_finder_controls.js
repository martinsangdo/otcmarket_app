/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, ScrollView} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon} from "native-base";
import styles from "./style";    //CSS defined here
import common_styles from "../../css/common";
import BaseScreen from "../base/BaseScreen.js";
import RequestData from '../utils/https/RequestData';
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import CheckBox from '@react-native-community/checkbox';

const market_prefix = 'market_';

class StockFinderControls extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			controls: {},
			is_loaded_controls: false,
			options: {	//what user chose
				markets: [],
				securityTypes: [],
				countryTotals: [],
				ce: false,	//Caveat Emptor
				industryTotals: [],
				priceMin: [],
				priceMax: [],
				pcPct: [],	//price change
				pc: 52,			//price change duration
				volMin: [],	//volume
				volMax: [],
				penny: 'all',	//yes/no, empty means All
				perf: {
					index: 0,
					duration: 52,
					pricePctMin: -40,
					pricePctMax: 40
				},		//performance
				volChgMin: 25,	//25-200 %
				div: false,	//Dividend Payer
				shinMin: 0		//percentage 0-100
			},
			is_show_market: false,
			is_show_securityType: false,
			is_show_countries: false,
			is_show_industries: false,
		};
	}

	componentDidMount() {
		// this.setState({
		// 	controls: this.props.navigation.state.params.controls
		// });
		var me = this;
		RequestData.sentGetRequest(API_URI.STOCK_FINDER.GET_FILTERS.URL, (detail, error) => {
			if (detail){
				var rawDataJson = JSON.parse(detail);
				Utils.xlog('controls', rawDataJson);
				me.setState({controls: rawDataJson, is_loaded_controls:true}, ()=>{
					// me._render_markets();
				});
			} else {
				//error
			}
		});
  }
	//begin searching
	_apply_options(){

	}
	//when user taps on checkbox
	_toogle_options_array(options_key, value){
		var current_options = this.state.options;
		var found_index = Utils.isExistedInArray(current_options[options_key], value);
		if (found_index >= 0){
			//existed, remove that value
			current_options[options_key] = Utils.removeArrayAtIndex(current_options[options_key], found_index);
		} else {
			//not existed, add that value
			current_options[options_key].push(value);
		}
		this.setState({options: current_options}, ()=>{
			// Utils.xlog('changed', this.state.options);
		});
	}
	//when user taps on checkbox
	_toogle_options_value(options_key, value){
		var current_options = this.state.options;
		current_options[options_key] = value;
		this.setState({options: current_options}, ()=>{
			// Utils.xlog('changed', this.state.options);
		});
	}
	//
	_on_clear_market(){

	}
	//
	_on_clear_growth(){

	}
	//
	_show_hide_market(){
		this.setState({is_show_market: !this.state.is_show_market});
	}
	//
	_render_markets(){
		var markets = [];
		if (Utils.isEmpty(this.state.controls['markets'])){
			return;
		}
		var me = this;
		this.state.controls['markets'].map(function(item){
			if (item['mkts'] != null && item['mkts'].length > 0){
				item['mkts'].map(function(subitem){
					if (!Utils.isEmpty(subitem.id)){
						markets.push({
							id: subitem.id, name: subitem.name, num: subitem.num
						});
					}
				});
			} else if (!Utils.isEmpty(item.id)){
				markets.push({
					id: item.id, name: item.name, num: item.num
				});
			}
		});
		if (markets.length > 0){
			var display_options = markets.map(function(item){
				return <View style={common_styles.flex_row} key={item.id}>
									<CheckBox
										boxType={'square'}
										value={Utils.isExistedInArray(me.state.options['markets'], item.id)>=0?true:false}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => me._toogle_options_array('markets', item.id)}
									/>
									<View style={common_styles.justifyCenter}><Text>{item.name} ({item.num})</Text></View>
								</View>;
			});
			return display_options;
		}
	}
	//
	_show_hide_security_type(){
		this.setState({is_show_securityType: !this.state.is_show_securityType});
	}
	//
	_render_security_types(){
		var securityTypes = [];
		if (Utils.isEmpty(this.state.controls['securityTypes'])){
			return;
		}
		var me = this;
		this.state.controls['securityTypes'].map(function(item){
			if (!Utils.isEmpty(item.name)){
				securityTypes.push({
					name: item.name, num: item.num
				});
			}
		});
		if (securityTypes.length > 0){
			var display_options = securityTypes.map(function(item){
				return <View style={common_styles.flex_row} key={item.name}>
									<CheckBox
										boxType={'square'}
										value={Utils.isExistedInArray(me.state.options['securityTypes'], item.name)>=0?true:false}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => me._toogle_options_array('securityTypes', item.name)}
									/>
									<View style={common_styles.justifyCenter}><Text>{item.name} ({item.num})</Text></View>
								</View>;
			});
			return display_options;
		}
	}
	//
	_show_hide_countries(){
		this.setState({is_show_countries: !this.state.is_show_countries});
	}
	//
	_render_countries(){
		var countries = [];
		if (Utils.isEmpty(this.state.controls['countryTotals'])){
			return;
		}
		var me = this;
		this.state.controls['countryTotals'].map(function(item){
			if (!Utils.isEmpty(item.country)){
				countries.push({
					country: item.country, num: item.num
				});
			}
		});
		if (countries.length > 0){
			var display_options = countries.map(function(item){
				return <View style={common_styles.flex_row} key={item.country}>
									<CheckBox
										boxType={'square'}
										value={Utils.isExistedInArray(me.state.options['countryTotals'], item.country)>=0?true:false}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => me._toogle_options_array('countryTotals', item.country)}
									/>
									<View style={common_styles.justifyCenter}><Text>{item.country} ({item.num})</Text></View>
								</View>;
			});
			return display_options;
		}
	}
	//
	_show_hide_industries(){
		this.setState({is_show_industries: !this.state.is_show_industries});
	}
	//
	_render_industries(){
		var industries = [];
		if (Utils.isEmpty(this.state.controls['industryTotals'])){
			return;
		}
		var me = this;
		this.state.controls['industryTotals'].map(function(item){
			if (!Utils.isEmpty(item.sic)){
				industries.push({
					name: item.name, sic: item.sic, num: item.num
				});
			}
		});
		if (industries.length > 0){
			var display_options = industries.map(function(item){
				return <View style={common_styles.flex_row} key={item.sic+''}>
									<CheckBox
										boxType={'square'}
										value={Utils.isExistedInArray(me.state.options['industryTotals'], item.sic)>=0?true:false}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => me._toogle_options_array('industryTotals', item.sic)}
									/>
									<View style={common_styles.justifyCenter}><Text>{item.name} ({item.num})</Text></View>
								</View>;
			});
			return display_options;
		}
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Advanced Settings</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
									<TouchableOpacity onPress={() => this._apply_options()}>
										<Text uppercase={false} style={[common_styles.default_font_color]}>Apply</Text>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
              <Content>
								{/* Market */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5, common_styles.fetch_row]}>
									<Text style={[common_styles.heading_1]}>MARKETS</Text>
									<View style={[common_styles.float_right]}>
										<TouchableOpacity onPress={()=>this._on_clear_market()}>
											<Text>Reset</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>
								{/* Markets */}
								<View style={common_styles.margin_5}><Text>Markets</Text></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_market()}>
									<View style={common_styles.justifyCenter}><Text>{this.state.options['markets'].length==0?'All':this.state.options['markets'].length+' selected'}</Text></View>
									<View>
										{
											!this.state.is_show_market &&
											<Icon name="md-arrow-dropdown" style={common_styles.default_font_color}/>
										}
										{
											this.state.is_show_market &&
											<Icon name="md-arrow-dropup" style={common_styles.default_font_color}/>
										}
									</View>
								</TouchableOpacity>
								{
									this.state.is_show_market &&
									<View style={styles.finder_options_sub_container} >
					          <ScrollView>
											{this.state.is_loaded_controls && this._render_markets()}
					          </ScrollView>
					        </View>
								}
								{/* Security Type */}
								<View style={common_styles.margin_5}><Text>Security Types</Text></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_security_type()}>
									<View style={common_styles.justifyCenter}><Text>{this.state.options['securityTypes'].length==0?'All':this.state.options['securityTypes'].length+' selected'}</Text></View>
									<View>
										{
											!this.state.is_show_securityType &&
											<Icon name="md-arrow-dropdown" style={common_styles.default_font_color}/>
										}
										{
											this.state.is_show_securityType &&
											<Icon name="md-arrow-dropup" style={common_styles.default_font_color}/>
										}
									</View>
								</TouchableOpacity>
								{
									this.state.is_show_securityType &&
									<View style={styles.finder_options_sub_container} >
					          <ScrollView>
											{this.state.is_loaded_controls && this._render_security_types()}
					          </ScrollView>
					        </View>
								}
								{/* Country */}
								<View style={common_styles.margin_5}><Text>Countries</Text></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_countries()}>
									<View style={common_styles.justifyCenter}><Text>{this.state.options['countryTotals'].length==0?'All':this.state.options['countryTotals'].length+' selected'}</Text></View>
									<View>
										{
											!this.state.is_show_countries &&
											<Icon name="md-arrow-dropdown" style={common_styles.default_font_color}/>
										}
										{
											this.state.is_show_countries &&
											<Icon name="md-arrow-dropup" style={common_styles.default_font_color}/>
										}
									</View>
								</TouchableOpacity>
								{
									this.state.is_show_countries &&
									<View style={styles.finder_options_sub_container} >
					          <ScrollView>
											{this.state.is_loaded_controls && this._render_countries()}
					          </ScrollView>
					        </View>
								}
								{/* Industry */}
								<View style={common_styles.margin_5}><Text>Industries</Text></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_industries()}>
									<View style={common_styles.justifyCenter}><Text>{this.state.options['industryTotals'].length==0?'All':this.state.options['industryTotals'].length+' selected'}</Text></View>
									<View>
										{
											!this.state.is_show_industries &&
											<Icon name="md-arrow-dropdown" style={common_styles.default_font_color}/>
										}
										{
											this.state.is_show_industries &&
											<Icon name="md-arrow-dropup" style={common_styles.default_font_color}/>
										}
									</View>
								</TouchableOpacity>
								{
									this.state.is_show_industries &&
									<View style={styles.finder_options_sub_container} >
					          <ScrollView>
											{this.state.is_loaded_controls && this._render_industries()}
					          </ScrollView>
					        </View>
								}
								<View style={[common_styles.fetch_row, common_styles.margin_5]}>
									<View><Text>Caveat Emptor</Text></View>
									<CheckBox
										boxType={'square'}
										value={this.state.options['ce']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('ce', !this.state.options['ce'])}
									/>
								</View>
								{/* Market */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5, common_styles.fetch_row]}>
									<Text style={[common_styles.heading_1]}>GROWTH</Text>
									<View style={[common_styles.float_right]}>
										<TouchableOpacity onPress={()=>this._on_clear_growth()}>
											<Text>Reset</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>
							</Content>
						</Container>
				);
		}
}

export default StockFinderControls;
