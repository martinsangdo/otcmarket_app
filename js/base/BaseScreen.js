import React, {Component} from "react";
import { NavigationActions, StackActions } from 'react-navigation';


class BaseScreen extends Component {
    constructor(props) {
  		super(props);
  		this.state = {

  		};
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
}

export default BaseScreen;
