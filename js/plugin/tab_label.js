import React from 'react';
import { Text } from 'react-native';
//display label of Tabs
class TabLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.children
    };
  }
  setText(val){
      this.setState({value:val});
  }
  render() {
      return <Text {...this.props}>{this.state.value}</Text>
  }
}

export default TabLabel;
