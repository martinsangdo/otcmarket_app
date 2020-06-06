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

const drawerCover = require("../../../img/menu_bg.jpg");
const drawerImage = require("../../../img/logo_splash.jpg");
const datas = [
  {
    name: "Market Update",
    route: "Home",
    icon: 'home'
  },
  {
    name: "Stock Directory",
    route: "Home",
    icon: "ios-search"
  },
  {
    name: "News & Reports",
    route: "Home",
    icon: "md-paper"
  },
  {
    name: "Compliance Statistic",
    route: "Home",
    icon: "ios-stats"
  },
  {
    name: "Corporate Actions",
    route: "Home",
    icon: "md-brush"
  },
  {
    name: "Broker Dealer Data",
    route: "Home",
    icon: "ios-journal"
  },
  {
    name: "Terms of Service",
    route: "Home",
    icon: "ios-quote"
  },
  {
    name: "Contact",
    route: "Home",
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
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
                key={data.name}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </View>
      </Container>
    );
  }
}

export default SideBar;
