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
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Revenues</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Total Revenue</Text>
          <Text>{this.state.data['totalRevenue']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Cost of Revenue</Text>
          <Text>{this.state.data['costOfRevenue']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Gross Profit</Text>
          <Text style={common_styles.bold}>{this.state.data['grossProfit']}</Text>
        </View>
        {/* Operating Expenses */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Operating Expenses</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Research & Development</Text>
          <Text>{this.state.data['researchAndDevelopment']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Sales, General and Admin</Text>
          <Text>{this.state.data['salesGeneralAndAdmin']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Non-Recurring Items</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Other</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Total Expenses</Text>
          <Text style={common_styles.bold}>{this.state.data['totalExpenses']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Operating Income</Text>
          <Text style={common_styles.bold}>{this.state.data['operatingIncome']}</Text>
        </View>
        {/* Operating Expenses */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Income from Continuing Operations</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Additional Income / Expense Items</Text>
          <Text>{this.state.data['additionalIncomeExpenseItems']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Earnings Before Interest and Taxes</Text>
          <Text>{this.state.data['earningsBeforeInterestTaxes']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Interest Expense</Text>
          <Text>{this.state.data['interestExpense']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Earnings Before Tax</Text>
          <Text>{this.state.data['earningsBeforeTax']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Income Tax</Text>
          <Text>{this.state.data['incomeTax']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Minority Interest</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Equity Earnings</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Net Income Cont. Operations</Text>
          <Text style={common_styles.bold}>{this.state.data['netIncomeOperations']}</Text>
        </View>
        {/* Non-Recurring Events */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Non-Recurring Events</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Discontinued Operations</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Extraordinary Operations</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Effect of Accounting Changes</Text>
          <Text></Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Net Income</Text>
          <Text style={common_styles.bold}>{this.state.data['netIncome']}</Text>
        </View>
        {/* Key Financial Ratios */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Key Financial Ratios</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Earnings Per Share</Text>
          <Text>{this.state.data['earningsperShare']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Price/Earnings</Text>
          <Text>{this.state.data['priceEarnings']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Gross Margin</Text>
          <Text>{this.state.data['grossMargin']}</Text>
        </View>
        <View style={[styles.financial_item]}>
          <Text>Operating Margin</Text>
          <Text>{this.state.data['operatingMargin']}</Text>
        </View>
      </View>
    );
  }
}
