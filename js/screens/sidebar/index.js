import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge, View
} from "native-base";
import styles from "./style";
import MyText from '../../component/MyText';

const drawerCover = require("../../../img/menu_bg.jpg");
const drawerImage = require("../../../img/logo_splash.jpg");
const datas = [
  {
    name: "Market Update",
    route: "Home",
    icon: 'home'
  },
  {
    name: "Bookmarked symbols",
    route: "BookmarkList",
    icon: "star"
  },
  {
    name: "Stock Finder",
    route: "StockFinder",
    icon: "ios-search"
  },
  {
    name: "News & Reports",
    route: "NewsReports",
    icon: "md-receipt"
  },
  {
    name: "Compliance Statistic",
    route: "ComplianceStatistic",
    icon: "md-stats-chart"
  },
  {
    name: "Short Interest Data",
    route: "ShortInterest",
    icon: "ios-book"
  },
  {
    name: "Broker Dealer Data",
    route: "BrokerDealer",
    icon: "ios-journal"
  },
  {
    name: "Qualified Foreign Exchange",
    route: "ForeignExchange",
    icon: "ios-medal"
  },
  {
    name: "Corporate Actions",
    route: "CorporateActions",
    icon: "md-pulse"
  },
  // {
  //   name: "Fees",
  //   route: "Home",
  //   icon: "md-card"
  // },
  {
    name: "Contact",  //Terms of Service
    route: "Contact",
    icon: "md-mail"
  }
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <View
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          <Image square style={styles.drawerImage} source={drawerImage} />

          <List
            dataArray={datas}
            keyExtractor={item => item.name}
            renderRow={data =>
              <ListItem
                style={{height: 44, paddingTop: 3}}
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
                key={data.name}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 22, width: 30 }}
                  />
                  <MyText style={styles.text}>
                    {data.name}
                  </MyText>
                </Left>
              </ListItem>}
          />
        </View>
      </Container>
    );
  }
}

export default SideBar;
