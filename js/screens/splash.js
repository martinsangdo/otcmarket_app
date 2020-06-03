/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, Alert} from "react-native";

import {Container} from "native-base";

import BaseScreen from "../base/BaseScreen.js";
import common_styles from "../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../utils/functions";
import {C_Const} from '../utils/constant';
import {API_URI} from '../utils/api_uri';
import RequestData from '../utils/https/RequestData';

const launchscreenLogo = require("../../img/logo_splash.jpg");

class Splash extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		var me = this;
		setTimeout(()=>{
			me._navigateTo('Drawer');
		}, 2000);
  }
	 //==========
		render() {
				const {navigate} = this.props.navigation;

				return (
						<Container>
								<View style={[styles.splash_container]}>
										<Image source={launchscreenLogo} style={styles.splash_logo}/>
								</View>
						</Container>
				);
		}
}

export default Splash;
