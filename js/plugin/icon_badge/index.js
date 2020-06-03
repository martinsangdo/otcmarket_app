//author: Martin
var React = require('react');
var style = require('./style');
import {
  View,
} from 'react-native';

class IconBadge extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display_balloon: false,
      badge_left: 37
    };
  }

  showBalloon(val){
    this.setState({display_balloon:val});
  }

  setBadgeLeft(val){
    this.setState({badge_left: val});
  }

  render(){
    return (
      <View style={[style.MainView, (this.props.MainViewStyle ? this.props.MainViewStyle : {})]}>
        {
          // main element
          this.props.MainElement
        }
        { !this.props.Hidden &&
          <View style={[style.IconBadge, (this.props.IconBadgeStyle ? this.props.IconBadgeStyle : {}),
            {width: this.state.display_balloon?20:0, height: this.state.display_balloon?20:0, left:this.state.badge_left}]}>
            {
              // badge element
              this.props.BadgeElement
            }
          </View>
        }
      </View>
    )
  }
}

module.exports = IconBadge;
