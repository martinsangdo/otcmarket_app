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
import StockDetailSecurity from "./screens/stock_detail/stock_detail_security";
import StockDetailNews from "./screens/stock_detail/stock_detail_news";
import StockDetailFinancial from "./screens/stock_detail/stock_detail_financial";
import StockDetailDisclosure from "./screens/stock_detail/stock_detail_disclosure";
import PDFViewer from "./screens/pdf_viewer";
import StockFinder from "./screens/stock_finder";
import StockFinderControls from "./screens/stock_finder_controls";

import Splash from "./screens/splash";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    CurrentMarket: { screen: CurrentMarket },
    StockFinder: {screen: StockFinder},
    StockFinderControls: {screen: StockFinderControls}
  },
  {
    initialRouteName: "StockFinderControls",
    contentOptions: {
      activeTintColor: "#81af68"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
    Splash: { screen: Splash },
    Home: { screen: Home },
    CurrentMarket: { screen: CurrentMarket },
    StockDetailQuote: { screen: StockDetailQuote },
    StockDetailProfile: { screen: StockDetailProfile },
    StockDetailSecurity: { screen: StockDetailSecurity },
    StockDetailNews: { screen: StockDetailNews },
    StockDetailFinancial: { screen: StockDetailFinancial },
    StockDetailDisclosure: { screen: StockDetailDisclosure },
    PDFViewer: { screen: PDFViewer },
    StockFinderControls: { screen: StockFinderControls }
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
