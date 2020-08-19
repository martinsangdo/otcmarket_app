/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity} from "react-native";

import {Container, Content, Header, Title, Body, Left, Right, Text, Icon} from "native-base";
import Pdf from 'react-native-pdf';
import styles from "./style";    //CSS defined here
import common_styles from "../../css/common";
import BaseScreen from "../base/BaseScreen.js";
import MyText from '../component/MyText';

class PDFViewer extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			url: ''
		};
	}

	componentDidMount() {
		this.setState({
			url: this.props.navigation.state.params.url
		});
  }
	componentDidUpdate(prevProps){
		var prevPropParams = prevProps.navigation;
		var newPropParams = this.props.navigation.state.params;
		//check if any param is updated, load data again
		if (prevPropParams.getParam('url') != newPropParams['url']){
			this.setState({
				url: newPropParams['url']
			});
		}
	}
	//
	_check_login(){
		this._navigateCanBackTo('Contact');
	}
	 //==========
		render() {
			const source = {uri:this.state.url, cache:false};

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
												<MyText uppercase={false} style={[common_styles.default_font_color]}>Back</MyText>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<MyText style={[common_styles.bold, common_styles.default_font_color]}>Viewer</MyText>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.5}]}>
									<TouchableOpacity onPress={() => this._check_login()}>
										<View style={styles.left_row}>
											<View style={[common_styles.float_center]}>
												<Icon name="md-download" style={common_styles.default_font_color}/>
											</View>
										</View>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
              <Content>
								<View style={styles.pdf_container}>
										<Pdf
												source={source}
												onLoadComplete={(numberOfPages,filePath)=>{
														// console.log(`number of pages: ${numberOfPages}`);
												}}
												onPageChanged={(page,numberOfPages)=>{
														// console.log(`current page: ${page}`);
												}}
												onError={(error)=>{
														// console.log(error);
												}}
												onPressLink={(uri)=>{
														// console.log(`Link presse: ${uri}`)
												}}
												style={styles.pdf_view}/>
								</View>
							</Content>
						</Container>
				);
		}
}

export default PDFViewer;
