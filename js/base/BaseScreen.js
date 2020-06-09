import React, {Component} from "react";
import { NavigationActions, StackActions } from 'react-navigation';
import {Image, View, TouchableOpacity, FlatList} from "react-native";
import {Text, Icon} from "native-base";

import common_styles from "../../css/common";
import styles from "../screens/style";    //CSS defined here
import Utils from "../utils/functions";

const oo_icon = require("../../img/OO_icon.jpg");
const pc_icon = require("../../img/PC_icon.jpg");
const pn_icon = require("../../img/PN_icon.jpg");
const qb_icon = require("../../img/QB_icon.jpg");
const qx_icon = require("../../img/QX_icon.jpg");
const em_icon = require("../../img/EM_icon.jpg");
const pl_icon = require("../../img/PL_icon.jpg");

class BaseScreen extends Component {
    constructor(props) {
  		super(props);
  	}
    componentDidMount() {
			console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
			YellowBox.ignoreWarnings([
			  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.', // TODO: Remove when fixed
			]);
    }
    //navigate to another screen
    _navigateTo = (routeName: string) => {
      const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: routeName })],
          });
      this.props.navigation.dispatch(resetAction);
    };

    //navigate to another screen
    _navigateCanBackTo = (routeName: string) => {
        this.props.navigation.navigate(routeName);
    };
    //
		_get_symbol_icon(tierCode){
			switch (tierCode) {
				case 'OO':
					return oo_icon;
					break;
					case 'PC':
						return pc_icon;
						break;
						case 'PN':
							return pn_icon;
							break;
							case 'QB':
								return qb_icon;
								break;
								case 'QX':
									return qx_icon;
									break;
									case 'EM':
										return em_icon;
										break;
										case 'PL':
											return pl_icon;
											break;
				default:
					return pn_icon;
			}
		}
    //
    _on_go_back = () => {
      this.props.navigation.goBack();
    }
    //
		_keyExtractor = (item) => item.symbol;
		//render the list. MUST use "item" as param
    //used to show list of stocks (Home, current_market)
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row]} key={item.symbol}>
					<View style={[common_styles.margin_r_5]}>
						<Image source={this._get_symbol_icon(item.tierCode)} style={[styles.stock_ico]}/>
					</View>
					<View style={[styles.td_stock_price_item_first]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StockDetailNews', {symbol: item.symbol})}
            >
  						<Text>{item.symbol}</Text>
            </TouchableOpacity>
          </View>
					<View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{Utils.number_to_float(item.price)}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={[common_styles.float_right, common_styles.blackColor, item.pctChange < 0 && common_styles.redColor]}>{item.pctChange}</Text></View>
					<View style={[styles.td_stock_price_item]}><Text style={common_styles.float_right}>{Utils.shorten_big_num(item.dollarVolume)}</Text></View>
				</View>
		);
}

export default BaseScreen;
