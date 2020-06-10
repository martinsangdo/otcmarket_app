import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";

export default class FinancialCashFlow extends Component {
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
  //
  componentDidUpdate(){
    if (this.props['data'] !== undefined && this.props['data']['periodEndDate'] != this.state.data['periodEndDate']){
      this.setState({
        data: this.props['data']
      }, ()=>{
        // console.log('data income 2', this.state.data);
      });
    }
  }
  //////////
  render() {
    return (
      <View style={[common_styles.margin_l_10, common_styles.margin_r_10]}>
        {/* Operating Activities */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Operating Activities</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Net Income</Text>
          <Text style={common_styles.bold}>{this.state.data['netIncome']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Depreciation</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Adjustments to Net Income</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Changes in Liabilities</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Changes in Accounts Receivables</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Changes in Inventories</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text style={common_styles.font_13}>Changes in Other Operating Activities</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.font_13}>Total Cash Flow From Operating Activities</Text>
          <Text style={common_styles.bold}>{this.state.data['totalCashFlowFromOperatingActivities']}</Text>
        </View>
        {/* Investing Activities */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Investing Activities</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Capital Expenditures</Text>
          <Text>{this.state.data['capitalExpenditures']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Investments</Text>
          <Text>{this.state.data['investments']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text style={common_styles.font_13}>Other Cash Flows From Investing Activities</Text>
          <Text>{this.state.data['otherCashFlowFromInvestingActivities']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.font_13}>Total Cash Flow From Investing Activities</Text>
          <Text style={common_styles.bold}>{this.state.data['totalCashFlowFromInvestingActivities']}</Text>
        </View>
        {/* Financing Activities */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Financing Activities</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Dividends Paid</Text>
          <Text>{this.state.data['dividendsPaid']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Sale/Purchase of Stock</Text>
          <Text>{this.state.data['salePurchaseOfStock']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Net Borrowings</Text>
          <Text>{this.state.data['netBorrowings']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text style={common_styles.font_13}>Other Cash Flows From Financing Activities</Text>
          <Text>{this.state.data['otherCashFlowsFromFinancingActivities']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.font_13}>Total Cash Flow From Financing Activities</Text>
          <Text style={common_styles.bold}>{this.state.data['totalCashFlowsFromFinancingActivities']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Effect of Exchange Rate Changes</Text>
          <Text>{this.state.data['effectOfExchangeRateChanges']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text></Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Change in Cash and Cash Equivalents</Text>
          <Text style={common_styles.bold}>{this.state.data['changeInCashAndEquities']}</Text>
        </View>
      </View>
    );
  }
}
