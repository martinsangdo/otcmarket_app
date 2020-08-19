import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";
import MyText from '../../component/MyText';

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
        {/* Revenue */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Revenues</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Total Revenue</MyText>
          <MyText>{this.state.data['totalRevenue']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Cost of Revenue</MyText>
          <MyText>{this.state.data['costOfRevenue']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Gross Profit</MyText>
          <MyText style={common_styles.bold}>{this.state.data['grossProfit']}</MyText>
        </View>
        {/* Operating Expenses */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Operating Expenses</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Research & Development</MyText>
          <MyText>{this.state.data['researchAndDevelopment']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Sales, General and Admin</MyText>
          <MyText>{this.state.data['salesGeneralAndAdmin']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Non-Recurring Items</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Other</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Total Expenses</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalExpenses']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Operating Income</MyText>
          <MyText style={common_styles.bold}>{this.state.data['operatingIncome']}</MyText>
        </View>
        {/* Operating Expenses */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Income from Continuing Operations</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Additional Income / Expense Items</MyText>
          <MyText>{this.state.data['additionalIncomeExpenseItems']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Earnings Before Interest and Taxes</MyText>
          <MyText>{this.state.data['earningsBeforeInterestTaxes']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Interest Expense</MyText>
          <MyText>{this.state.data['interestExpense']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Earnings Before Tax</MyText>
          <MyText>{this.state.data['earningsBeforeTax']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Income Tax</MyText>
          <MyText>{this.state.data['incomeTax']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Minority Interest</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Equity Earnings</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Net Income Cont. Operations</MyText>
          <MyText style={common_styles.bold}>{this.state.data['netIncomeOperations']}</MyText>
        </View>
        {/* Non-Recurring Events */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Non-Recurring Events</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Discontinued Operations</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Extraordinary Operations</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Effect of Accounting Changes</MyText>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Net Income</MyText>
          <MyText style={common_styles.bold}>{this.state.data['netIncome']}</MyText>
        </View>
        {/* Key Financial Ratios */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Key Financial Ratios</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Earnings Per Share</MyText>
          <MyText>{this.state.data['earningsperShare']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Price/Earnings</MyText>
          <MyText>{this.state.data['priceEarnings']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Gross Margin</MyText>
          <MyText>{this.state.data['grossMargin']}</MyText>
        </View>
        <View style={[styles.financial_item]}>
          <MyText>Operating Margin</MyText>
          <MyText>{this.state.data['operatingMargin']}</MyText>
        </View>
      </View>
    );
  }
}
