import React, { Component } from "react";
import { View, Text } from "native-base";
import common_styles from "../../../css/common";
import styles from "../style";
import MyText from '../../component/MyText';

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
        {/* Assets */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Assets</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <MyText style={common_styles.bold}>Current Assets</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Cash and Cash Equivalents</MyText>
          <MyText>{this.state.data['cashAndCashEquivalents']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Short Term Investments</MyText>
          <MyText>{this.state.data['shortTermInvestments']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Net Receivables</MyText>
          <MyText>{this.state.data['netReceivables']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Inventory</MyText>
          <MyText>{this.state.data['inventory']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Other Current Assets</MyText>
          <MyText>{this.state.data['otherCurrentAssets']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last, common_styles.margin_l_20]}>
          <MyText style={common_styles.bold}>Total Current Assets</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalCurrentAssets']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <MyText style={common_styles.bold}>Long Term Assets</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Long Term Investments</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Property Plant and Equipment</MyText>
          <MyText>{this.state.data['propertyPlantAndEquipment']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Goodwill</MyText>
          <MyText>{this.state.data['goodwill']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Intangible Assets</MyText>
          <MyText>{this.state.data['intangibleAssets']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Other Assets</MyText>
          <MyText>{this.state.data['otherAssets']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Deferred Long Term Asset Charges</MyText>
          <MyText>{this.state.data['deferredLongTermAssetsCharges']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Total Assets</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalAssets']}</MyText>
        </View>
        {/* Liabilities */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Liabilities</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <MyText style={common_styles.bold}>Current Liabilities</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Accounts Payable</MyText>
          <MyText>{this.state.data['accountPayable']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText style={common_styles.font_15}>Short Term and Current Long Term Debt</MyText>
          <MyText>{this.state.data['shortTermAndCurrentLongTermDebt']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Other Liabilities</MyText>
          <MyText>{this.state.data['otherLiabilities']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last, common_styles.margin_l_20]}>
          <MyText style={common_styles.bold}>Total Current Liabilities</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalCurrentLiabilities']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_master_item]}>
          <MyText style={common_styles.bold}>Long Term Liabilities</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Long Term Debt</MyText>
          <MyText>{this.state.data['longTermDebt']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Other Liabilities</MyText>
          <MyText>{this.state.data['otherLiabilitiesWithContingencies']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText style={common_styles.font_15}>Deferred Long Term Liability Charges</MyText>
          <MyText>{this.state.data['deferredLongTermLiabilityCharges']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Minority Interest</MyText>
          <MyText>{this.state.data['minorityInterest']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Total Liabilities</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalLiabilities']}</MyText>
        </View>
        {/* Stockholders' Equity */}
        <View style={[styles.financial_header]}>
          <MyText style={[common_styles.default_font_color, common_styles.bold]}>Stockholders' Equity</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Preferred Stock</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Common Stock</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Retained Earnings</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Treasury Stock</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Capital Surplus</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText>Other Stockholder Equity</MyText>
          <MyText>{this.state.data['']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Total Stockholder Equity</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalStockholderEquity']}</MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={[common_styles.font_15]}>Total Liabilities and Stockholders' Equity</MyText>
          <MyText style={common_styles.bold}>{this.state.data['totalLiablitiesAndStockholderEquity']}</MyText>
        </View>
        <View style={[styles.financial_item, common_styles.margin_l_20]}>
          <MyText></MyText>
        </View>
        <View style={[styles.financial_item, styles.financial_item_last]}>
          <MyText style={common_styles.bold}>Net Tangible Assets</MyText>
          <MyText style={common_styles.bold}>{this.state.data['netTangibleAssets']}</MyText>
        </View>
      </View>
    );
  }
}
