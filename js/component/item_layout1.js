import React, { Component } from 'react';
import {Image, View, TouchableOpacity} from "react-native";
import Utils from "../utils/functions";
import {Text} from "native-base";

import common_styles from "../../css/common";
import styles from "../screens/style";    //CSS defined here

class ItemLayout1 extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {
      const {
            item,
            open_detail,
            categories
        } = this.props;

        return (
          <TouchableOpacity onPress={() => open_detail(item.index)}>
          <View style={styles.item_row}>
            <View>
              <Image style={styles.thumb} source={{uri: Utils.isEmpty(item.img_src)?null:item.img_src}}/>
            </View>
            <View style={styles.text_label}>
              <Text numberOfLines={3}>{item.title}</Text>
              <Text style={styles.time_label}>{Utils.formatDate(item.date)}</Text>
              <Text style={[common_styles.float_left, common_styles.orangeColor, {textTransform: 'uppercase'}]}>{categories[item.category_id].name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
}

export default ItemLayout1;
