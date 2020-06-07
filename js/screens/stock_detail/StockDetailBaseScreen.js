import {Picker} from "native-base";

import common_styles from "../../../css/common";
import styles from "../../screens/style";    //CSS defined here
import Utils from "../../utils/functions";
import BaseScreen from "../../base/BaseScreen.js";

class StockDetailBaseScreen extends BaseScreen {
    constructor(props) {
  		super(props);
  		this.state = {
        symbol:'',
  		};
  	}

}

export default StockDetailBaseScreen;
