import React from 'react';
import { Text } from 'react-native';
import MyText from '../component/MyText';

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
      return <MyText {...this.props}>{this.state.value}</MyText>
  }
}

export default TabLabel;
