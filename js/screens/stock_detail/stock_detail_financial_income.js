import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";

export default class FinancialIncome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }
  //
  componentDidMount() {
    if (this.props['data'] != undefined){
      this.setState({
        data: this.props['data']
      }, ()=>{
        // console.log('data income', this.state.data);
      });
    }
  }
  //////////
  render() {
    return (
      <View style={common_styles.margin_10}>
        {/* Revenue */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Revenues</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Total Revenue</Text>
          <Text>{this.state.data['totalRevenue']}</Text>
        </View>
      </View>
    );
  }
}
