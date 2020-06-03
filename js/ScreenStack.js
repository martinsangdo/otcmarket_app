import React from "react";
import { Root } from "native-base";
// import { StackNavigator, DrawerNavigator } from "react-navigation";
import {  createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import {  createStackNavigator } from "react-navigation-stack";

import SideBar from "./screens/sidebar";

import Home from "./screens/home";
import Splash from "./screens/splash";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home }
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
