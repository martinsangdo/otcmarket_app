/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, ScrollView, TextInput} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon, Form, Item, Input, Picker} from "native-base";
import styles from "./style";    //CSS defined here
import common_styles from "../../css/common";
import BaseScreen from "../base/BaseScreen.js";
import RequestData from '../utils/https/RequestData';
import {API_URI} from '../utils/api_uri';
import Utils from "../utils/functions";
import CheckBox from '@react-native-community/checkbox';
import MyText from '../component/MyText';
import Dialog from "./dialog/Dialog";

const market_prefix = 'market_';
const PickerItem = Picker.Item;

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
				priceMin: '',
				priceMax: '',
				pcPct: '',	//price change
				pc: '52',			//price change duration
				volMin: '',	//volume
				volMax: '',
				penny: 'all',	//yes/no, empty means All
				perf_index: '0',
				perf_duration: '2',
				perf_pricePctMin: '-40',
				perf_pricePctMax: '40',
				volChgMin: '25',	//25-200 %
				volChgMax: '200',	//25-200 %
				div: false,	//Dividend Payer
				shinMin: '0',		//percentage 0-100
				shinMax: '100'
			},
			is_show_market: false,
			is_show_securityType: false,
			is_show_countries: false,
			is_show_industries: false
		};
	}

	componentDidMount() {
		this.setState({
			controls: this.props.navigation.state.params.controls,
			is_loaded_controls:true
		});
  }
	//begin searching
	_apply_options(){
		var params = [];
		var me = this;
		var options = this.state.options;
		Object.keys(options).map(function(key) {
			switch (key) {
				case 'markets':
					if (options[key].length > 0){
						params.push('market='+options[key].join(','));
					}
				break;
				case 'securityTypes':
					if (options[key].length > 0){
						params.push('securityType='+options[key].join(','));
					}
				break;
				case 'countryTotals':
					if (options[key].length > 0){
						params.push('country='+options[key].join(','));
					}
				break;
				case 'industryTotals':
					if (options[key].length > 0){
						params.push('industry='+options[key].join(','));
					}
				break;
				case 'ce':
					if (options[key] != false){
						params.push('ce='+options[key]);
					}
				break;
				case 'penny':
					if (options[key] != 'all'){
						params.push('penny='+options[key]);
					}
				break;
				case 'div':
					if (options[key] != false){
						params.push('div='+options[key]);
					}
				break;
				case 'pc':
					if (options[key] != '52'){
						params.push('pc='+options[key]);
					}
				break;
				case 'perf_index':
				case 'perf_duration':
				case 'perf_pricePctMin':
				case 'perf_pricePctMax':
					//skip it
				break;
				case 'volChgMin':
					if (options[key] != '25'){
						params.push('volChgMin='+options[key]);
					}
				break;
				case 'volChgMax':
					if (options[key] != '200'){
						params.push('volChgMax='+options[key]);
					}
				break;
				case 'shinMin':
					if (options[key] != '0'){
						params.push('shinMin='+options[key]);
					}
				break;
				case 'shinMax':
					if (options[key] != '100'){
						params.push('shinMax='+options[key]);
					}
				break;
				default:
					if (options[key] != ''){
						params.push(key+'='+options[key]);
					}
			}
		});
		if (options['perf_index'] != '0' || options['perf_duration'] != '2' ||
				options['perf_pricePctMin'] != '-40' || options['perf_pricePctMax'] != '40'){
					params.push('perf='+options['perf_index']+'/'+options['perf_duration']+'/'+options['perf_pricePctMin']+'/'+options['perf_pricePctMax']);
				}
		this.props.navigation.state.params._on_search_advance(params.join('&'));
		this._on_go_back();
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
		this.setState({options: {...this.state.options,
			markets: [],
			securityTypes: [],
			countryTotals: [],
			ce: false,	//Caveat Emptor
			industryTotals: []
		}});
	}
	//
	_on_clear_growth(){
		this.setState({options: {...this.state.options,
			priceMin: '',
			priceMax: '',
			pcPct: '',	//price change
			pc: '52',			//price change duration
			volMin: '',	//volume
			volMax: '',
			penny: 'all'	//yes/no, empty means All
		}});
	}
	//
	_on_clear_performance(){
		this.setState({options: {...this.state.options,
			perf_index: '0',
			perf_duration: '52',
			perf_pricePctMin: '-40',
			perf_pricePctMax: '40',
			volChgMin: '25',	//25-200 %
			volChgMax: '200',	//25-200 %
			div: false,	//Dividend Payer
			shinMin: '0',		//percentage 0-100
			shinMax: '100'
		}});
	}
	//
	_show_hide_market(is_show){
		this.setState({is_show_market: is_show});
	}
	//show children
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
									<View style={common_styles.justifyCenter}><MyText>{item.name} ({item.num})</MyText></View>
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
									<View style={common_styles.justifyCenter}><MyText>{item.name} ({item.num})</MyText></View>
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
									<View style={common_styles.justifyCenter}><MyText>{item.country} ({item.num})</MyText></View>
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
									<View style={common_styles.justifyCenter}><MyText>{item.name} ({item.num})</MyText></View>
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
								<Left style={[common_styles.headerLeft, {flex:0.4}]}>
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
									<MyText style={[common_styles.bold, common_styles.default_font_color, common_styles.font_15]}>Advanced Settings</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.3}]}>
									<TouchableOpacity onPress={() => this._apply_options()}>
										<MyText uppercase={false} style={[common_styles.default_font_color]}>Apply</MyText>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
              <Content>
								{/* Market */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5, common_styles.fetch_row]}>
									<MyText style={[common_styles.heading_1]}>MARKETS</MyText>
									<View style={[common_styles.float_right]}>
										<TouchableOpacity onPress={()=>this._on_clear_market()}>
											<MyText>Reset</MyText>
										</TouchableOpacity>
									</View>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>
								{/* Markets */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Markets</MyText></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_market(true)}>
									<View style={common_styles.justifyCenter}><MyText>{this.state.options['markets'].length==0?'All':this.state.options['markets'].length+' selected'}</MyText></View>
									<View>
										{
											!this.state.is_show_market &&
											<Icon name="md-caret-down-sharp"/>
										}
										{
											this.state.is_show_market &&
											<Icon name="md-caret-up-sharp"/>
										}
									</View>
								</TouchableOpacity>
								{/* Security Type */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Security Types</MyText></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_security_type()}>
									<View style={common_styles.justifyCenter}><MyText>{this.state.options['securityTypes'].length==0?'All':this.state.options['securityTypes'].length+' selected'}</MyText></View>
									<View>
										{
											!this.state.is_show_securityType &&
											<Icon name="md-caret-down-sharp"/>
										}
										{
											this.state.is_show_securityType &&
											<Icon name="md-caret-up-sharp"/>
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
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Countries</MyText></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_countries()}>
									<View style={common_styles.justifyCenter}><MyText>{this.state.options['countryTotals'].length==0?'All':this.state.options['countryTotals'].length+' selected'}</MyText></View>
									<View>
										{
											!this.state.is_show_countries &&
											<Icon name="md-caret-down-sharp"/>
										}
										{
											this.state.is_show_countries &&
											<Icon name="md-caret-up-sharp"/>
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
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Industries</MyText></View>
								<TouchableOpacity style={[common_styles.margin_5, common_styles.padding_5, common_styles.fetch_row, common_styles.lightGrayBg]} onPress={()=>this._show_hide_industries()}>
									<View style={common_styles.justifyCenter}><MyText>{this.state.options['industryTotals'].length==0?'All':this.state.options['industryTotals'].length+' selected'}</MyText></View>
									<View>
										{
											!this.state.is_show_industries &&
											<Icon name="md-caret-down-sharp"/>
										}
										{
											this.state.is_show_industries &&
											<Icon name="md-caret-up-sharp"/>
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
									<View style={common_styles.justifyCenter}><MyText style={common_styles.bold}>Caveat Emptor</MyText></View>
									<CheckBox
										boxType={'square'}
										value={this.state.options['ce']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('ce', !this.state.options['ce'])}
									/>
								</View>
								{/* GROWTH */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5, common_styles.fetch_row]}>
									<MyText style={[common_styles.heading_1]}>GROWTH</MyText>
									<View style={[common_styles.float_right]}>
										<TouchableOpacity onPress={()=>this._on_clear_growth()}>
											<MyText>Reset</MyText>
										</TouchableOpacity>
									</View>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>
								{/* Price */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Price</MyText></View>
								<Form style={[common_styles.flex_row, common_styles.space_around]}>
									<Item style={styles.finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Min US$" keyboardType={'decimal-pad'} onChange={(event) => this.setState({options: {...this.state.options, priceMin : event.nativeEvent.text}})} value={this.state.options.priceMin}/>
									</Item>
									<Item style={styles.finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Max US$" keyboardType={'decimal-pad'} onChange={(event) => this.setState({options: {...this.state.options, priceMax : event.nativeEvent.text}})} value={this.state.options.priceMax}/>
									</Item>
								</Form>
								{/* Volume */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Volume</MyText></View>
								<Form style={[common_styles.flex_row, common_styles.space_around]}>
									<Item style={styles.finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Min" keyboardType={'decimal-pad'} onChange={(event) => this.setState({options: {...this.state.options, volMin : event.nativeEvent.text}})} value={this.state.options.volMin}/>
									</Item>
									<Item style={styles.finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Max" keyboardType={'decimal-pad'} onChange={(event) => this.setState({options: {...this.state.options, volMax : event.nativeEvent.text}})} value={this.state.options.volMax}/>
									</Item>
								</Form>
								{/* Price change */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Price change</MyText></View>
								<Form style={[common_styles.flex_row, common_styles.space_around]}>
									<Item style={styles.finder_textbox_container} regular>
										<TextInput style={{padding:2}} placeholder="Min %" keyboardType={'decimal-pad'} onChange={(event) => this.setState({options: {...this.state.options, pcPct : event.nativeEvent.text}})} value={this.state.options.pcPct}/>
									</Item>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_50p]}>
										<Picker
	                    mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
	                    selectedValue={this.state.options.pc}
	                    onValueChange={(newval)=>{this._toogle_options_value('pc', newval)}}
	                  >
	                    <PickerItem label="Last 1 day" value="1" />
	                    <PickerItem label="Last 5 days" value="5" />
	                    <PickerItem label="Last 4 weeks" value="4" />
											<PickerItem label="Last 13 weeks" value="13" />
											<PickerItem label="Last 52 weeks" value="52" />
	                  </Picker>
									</View>
								</Form>
								{/* Penny Stock Exempt */}
								<View style={[common_styles.fetch_row, common_styles.margin_5, common_styles.margin_r_20]}>
									<View style={common_styles.justifyCenter}><MyText style={common_styles.bold}>Penny Stock Exempt</MyText></View>
									<View style={[common_styles.grayBg, common_styles.width_50p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.penny}
											onValueChange={(newval)=>{this._toogle_options_value('penny', newval)}}
										>
											<PickerItem label="All" value="all" />
											<PickerItem label="Yes" value="yes" />
											<PickerItem label="No" value="no" />
										</Picker>
									</View>
								</View>
								{/* Performance */}
								<View style={common_styles.margin_b_10} />
								<View style={[common_styles.margin_5, common_styles.fetch_row]}>
									<MyText style={[common_styles.heading_1]}>PERFORMANCE</MyText>
									<View style={[common_styles.float_right]}>
										<TouchableOpacity onPress={()=>this._on_clear_performance()}>
											<MyText>Reset</MyText>
										</TouchableOpacity>
									</View>
								</View>
								<View style={[common_styles.border_b_tab, common_styles.margin_5]}></View>
								{/* Penny Stock Exempt */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Price Performance</MyText></View>
								<View style={[common_styles.fetch_row, common_styles.margin_5, common_styles.margin_r_20]}>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_45p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.perf_index}
											onValueChange={(newval)=>{this._toogle_options_value('perf_index', newval)}}
										>
											<PickerItem label="OTCQX Composite" value="0" />
											<PickerItem label="OTCQX Billion +" value="1" />
											<PickerItem label="OTCQX Banks" value="2" />
											<PickerItem label="OTCQX Intl" value="3" />
											<PickerItem label="OTCQX U.S." value="4" />
											<PickerItem label="OTCQB Venture" value="5" />
											<PickerItem label="OTCM QX ADR 30" value="6" />
											<PickerItem label="OTCM ADR" value="7" />
											<PickerItem label="S&P 500" value="8" />
											<PickerItem label="OTCQX Dividend" value="9" />
											<PickerItem label="OTCQX Canada" value="10" />
										</Picker>
									</View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_45p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.perf_duration}
											onValueChange={(newval)=>{this._toogle_options_value('perf_duration', newval)}}
											>
											<PickerItem label="Last 4 weeks" value="0" />
											<PickerItem label="Last 13 weeks" value="1" />
											<PickerItem label="Last 52 weeks" value="2" />
										</Picker>
									</View>
								</View>
								{/* Price % change */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Price % Change</MyText></View>
								<View style={[common_styles.fetch_row, common_styles.margin_5, common_styles.margin_r_20]}>
									<View style={common_styles.justifyCenter}><MyText>From: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.perf_pricePctMin}
											onValueChange={(newval)=>{this._toogle_options_value('perf_pricePctMin', newval)}}
										>
										<PickerItem label="0%" value="0" />
										<PickerItem label="-5%" value="-5" />
										<PickerItem label="-10%" value="-10" />
										<PickerItem label="-15%" value="-15" />
										<PickerItem label="-20%" value="-20" />
										<PickerItem label="-25%" value="-25" />
										<PickerItem label="-30%" value="-30" />
										<PickerItem label="-35%" value="-35" />
										<PickerItem label="< -40%" value="-40" />
										</Picker>
									</View>
									<View style={common_styles.justifyCenter}><MyText>To: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.perf_pricePctMax}
											onValueChange={(newval)=>{this._toogle_options_value('perf_pricePctMax', newval)}}
											>
											<PickerItem label="> 40%" value="40" />
											<PickerItem label="35%" value="35" />
											<PickerItem label="30%" value="30" />
											<PickerItem label="25%" value="25" />
											<PickerItem label="20%" value="20" />
											<PickerItem label="15%" value="15" />
											<PickerItem label="10%" value="10" />
											<PickerItem label="5%" value="5" />
										</Picker>
									</View>
								</View>
								{/* 10 days vs 90  */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>10 Days vs 90 Days Avg. volume</MyText></View>
								<View style={[common_styles.fetch_row, common_styles.margin_5, common_styles.margin_r_20]}>
									<View style={common_styles.justifyCenter}><MyText>From: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.volChgMin}
											onValueChange={(newval)=>{this._toogle_options_value('volChgMin', newval)}}
										>
										<PickerItem label="25%" value="25" />
										<PickerItem label="35%" value="35" />
										<PickerItem label="45%" value="45" />
										<PickerItem label="55%" value="55" />
										<PickerItem label="65%" value="65" />
										<PickerItem label="75%" value="75" />
										<PickerItem label="85%" value="85" />
										<PickerItem label="95%" value="95" />
										</Picker>
									</View>
									<View style={common_styles.justifyCenter}><MyText>To: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.volChgMax}
											onValueChange={(newval)=>{this._toogle_options_value('volChgMax', newval)}}
											>
											<PickerItem label="100%" value="100" />
											<PickerItem label="110%" value="110" />
											<PickerItem label="120%" value="120" />
											<PickerItem label="130%" value="130" />
											<PickerItem label="140%" value="140" />
											<PickerItem label="150%" value="150" />
											<PickerItem label="160%" value="160" />
											<PickerItem label="170%" value="170" />
											<PickerItem label="180%" value="180" />
											<PickerItem label="190%" value="190" />
											<PickerItem label="> 200%" value="200" />
										</Picker>
									</View>
								</View>
								<View style={[common_styles.fetch_row, common_styles.margin_5]}>
									<View style={common_styles.justifyCenter}><MyText style={common_styles.bold}>Dividend Payer</MyText></View>
									<CheckBox
										boxType={'square'}
										value={this.state.options['div']}
										style={styles.chkbox}
										onAnimationType={'bounce'}
										onValueChange={() => this._toogle_options_value('div', !this.state.options['div'])}
									/>
								</View>
								{/* Short Interest as Percent  */}
								<View style={common_styles.margin_5}><MyText style={common_styles.bold}>Short Interest as Percent of Shares Outstanding</MyText></View>
								<View style={[common_styles.fetch_row, common_styles.margin_5, common_styles.margin_r_20]}>
									<View style={common_styles.justifyCenter}><MyText>From: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.shinMin}
											onValueChange={(newval)=>{this._toogle_options_value('shinMin', newval)}}
										>
										<PickerItem label="0%" value="0" />
										<PickerItem label="10%" value="10" />
										<PickerItem label="20%" value="20" />
										<PickerItem label="30%" value="30" />
										<PickerItem label="40%" value="40" />
										<PickerItem label="50%" value="50" />
										</Picker>
									</View>
									<View style={common_styles.justifyCenter}><MyText>To: </MyText></View>
									<View style={[common_styles.grayBg, common_styles.margin_5, common_styles.width_30p]}>
										<Picker
											mode="dropdown"
	                    iosIcon={<Icon name="md-caret-down-sharp"/>}
											selectedValue={this.state.options.shinMax}
											onValueChange={(newval)=>{this._toogle_options_value('shinMax', newval)}}
											>
											<PickerItem label="60%" value="60" />
											<PickerItem label="70%" value="70" />
											<PickerItem label="80%" value="80" />
											<PickerItem label="90%" value="90" />
											<PickerItem label="100%" value="100" />
										</Picker>
									</View>
								</View>
								<View style={[common_styles.view_align_center, common_styles.margin_t_10]}>
									<TouchableOpacity style={[common_styles.default_button]} onPress={() => this._apply_options()}>
										<MyText style={common_styles.whiteColor}>Apply</MyText>
									</TouchableOpacity>
								</View>
								<View style={common_styles.margin_b_20} />
							</Content>
							{/***** dialog to choose Markets *****/}
								<Dialog
							    visible={this.state.is_show_market}
									dialogStyle={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff'}}>
							    <View>
											<ScrollView style={{height:170}}>
												{this.state.is_loaded_controls && this._render_markets()}
											</ScrollView>
										<MyText style={[common_styles.darkGrayColor, common_styles.font_12]}>Scroll to choose</MyText>
										<TouchableOpacity style={[common_styles.default_button]} onPress={() => this._show_hide_market(false)}>
											<MyText style={common_styles.whiteColor}>Close</MyText>
										</TouchableOpacity>
							    </View>
							</Dialog>
						</Container>
				);
		}
}

export default StockFinderControls;
