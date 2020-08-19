import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";
import MyText from '../../component/MyText';

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
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Operating Activities</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Net Income</MyText>
          <MyText style={common_styles.bold}>{this.state.data['netIncome']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Depreciation</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Adjustments to Net Income</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Changes in Liabilities</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Changes in Accounts Receivables</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Changes in Inventories</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText style={common_styles.font_13}>Changes in Other Operating Activities</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.font_13}>Total Cash Flow From Operating Activities</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalCashFlowFromOperatingActivities']}</MyText>
        </View>
        {/* Investing Activities */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Investing Activities</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Capital Expenditures</MyText>
          <MyText>{this.state.data['capitalExpenditures']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Investments</MyText>
          <MyText>{this.state.data['investments']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText style={common_styles.font_13}>Other Cash Flows From Investing Activities</MyText>
          <MyText>{this.state.data['otherCashFlowFromInvestingActivities']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.font_13}>Total Cash Flow From Investing Activities</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalCashFlowFromInvestingActivities']}</MyText>
        </View>
        {/* Financing Activities */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Financing Activities</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Dividends Paid</MyText>
          <MyText>{this.state.data['dividendsPaid']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Sale/Purchase of Stock</MyText>
          <MyText>{this.state.data['salePurchaseOfStock']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Net Borrowings</MyText>
          <MyText>{this.state.data['netBorrowings']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText style={common_styles.font_13}>Other Cash Flows From Financing Activities</MyText>
          <MyText>{this.state.data['otherCashFlowsFromFinancingActivities']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.font_13}>Total Cash Flow From Financing Activities</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalCashFlowsFromFinancingActivities']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Effect of Exchange Rate Changes</MyText>
          <MyText>{this.state.data['effectOfExchangeRateChanges']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText></MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Change in Cash and Cash Equivalents</MyText>
          <MyText style={common_styles.bold}>{this.state.data['changeInCashAndEquities']}</MyText>
        </View>
      </View>
    );
  }
}
