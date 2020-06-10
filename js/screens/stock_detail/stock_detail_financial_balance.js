import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";

export default class FinancialBalance extends Component {
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
    if (this.props['data']['periodEndDate'] != this.state.data['periodEndDate']){
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
        {/* Assets */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Assets</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <Text style={common_styles.bold}>Current Assets</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Cash and Cash Equivalents</Text>
          <Text>{this.state.data['cashAndCashEquivalents']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Short Term Investments</Text>
          <Text>{this.state.data['shortTermInvestments']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Net Receivables</Text>
          <Text>{this.state.data['netReceivables']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Inventory</Text>
          <Text>{this.state.data['inventory']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Other Current Assets</Text>
          <Text>{this.state.data['otherCurrentAssets']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last, common_styles.margin_l_20]}>
          <Text style={common_styles.bold}>Total Current Assets</Text>
          <Text style={common_styles.bold}>{this.state.data['totalCurrentAssets']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <Text style={common_styles.bold}>Long Term Assets</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Long Term Investments</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Property Plant and Equipment</Text>
          <Text>{this.state.data['propertyPlantAndEquipment']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Goodwill</Text>
          <Text>{this.state.data['goodwill']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Intangible Assets</Text>
          <Text>{this.state.data['intangibleAssets']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Other Assets</Text>
          <Text>{this.state.data['otherAssets']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Deferred Long Term Asset Charges</Text>
          <Text>{this.state.data['deferredLongTermAssetsCharges']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Total Assets</Text>
          <Text style={common_styles.bold}>{this.state.data['totalAssets']}</Text>
        </View>
        {/* Liabilities */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Liabilities</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <Text style={common_styles.bold}>Current Liabilities</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Accounts Payable</Text>
          <Text>{this.state.data['accountPayable']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text style={common_styles.font_15}>Short Term and Current Long Term Debt</Text>
          <Text>{this.state.data['shortTermAndCurrentLongTermDebt']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Other Liabilities</Text>
          <Text>{this.state.data['otherLiabilities']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last, common_styles.margin_l_20]}>
          <Text style={common_styles.bold}>Total Current Liabilities</Text>
          <Text style={common_styles.bold}>{this.state.data['totalCurrentLiabilities']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <Text style={common_styles.bold}>Long Term Liabilities</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Long Term Debt</Text>
          <Text>{this.state.data['longTermDebt']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Other Liabilities</Text>
          <Text>{this.state.data['otherLiabilitiesWithContingencies']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text style={common_styles.font_15}>Deferred Long Term Liability Charges</Text>
          <Text>{this.state.data['deferredLongTermLiabilityCharges']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Minority Interest</Text>
          <Text>{this.state.data['minorityInterest']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Total Liabilities</Text>
          <Text style={common_styles.bold}>{this.state.data['totalLiabilities']}</Text>
        </View>
        {/* Stockholders' Equity */}
        <View style={[styles.financial_header]}>
          <Text style={[common_styles.default_font_color, common_styles.bold]}>Stockholders' Equity</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Preferred Stock</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Common Stock</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Retained Earnings</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Treasury Stock</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Capital Surplus</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text>Other Stockholder Equity</Text>
          <Text>{this.state.data['']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Total Stockholder Equity</Text>
          <Text style={common_styles.bold}>{this.state.data['totalStockholderEquity']}</Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={[common_styles.font_15]}>Total Liabilities and Stockholders' Equity</Text>
          <Text style={common_styles.bold}>{this.state.data['totalLiablitiesAndStockholderEquity']}</Text>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <Text></Text>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <Text style={common_styles.bold}>Net Tangible Assets</Text>
          <Text style={common_styles.bold}>{this.state.data['netTangibleAssets']}</Text>
        </View>
      </View>
    );
  }
}
