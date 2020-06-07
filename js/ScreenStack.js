import React from "react";
import { Root } from "native-base";
// import { StackNavigator, DrawerNavigator } from "react-navigation";
import {  createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import {  createStackNavigator } from "react-navigation-stack";

import SideBar from "./screens/sidebar";

import Home from "./screens/home";
import CurrentMarket from "./screens/current_market";
import StockDetailQuote from "./screens/stock_detail/stock_detail_quote";
import StockDetailProfile from "./screens/stock_detail/stock_detail_profile";

import Splash from "./screens/splash";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    CurrentMarket: { screen: CurrentMarket },
    StockDetailQuote: { screen: StockDetailQuote },
    StockDetailProfile: { screen: StockDetailProfile }

  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#81af68"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
    Splash: { screen: Splash }
  },
  {
    initialRouteName: "Splash",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <AppContainer />
  </Root>;
