/**
* author: SangDo
*/
    import React from 'react';
    import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
    import PropTypes from 'prop-types';

    const styles = StyleSheet.create({
      container: {
        width: 50,
        height: 28,
        backgroundColor: '#fff',
        flexDirection: 'row',
        overflow: 'visible',
        borderRadius: 14,
        borderColor: '#ddd', borderWidth: 1
      },
      circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        marginTop: 1,
        left: 2,
        borderColor: '#ddd', borderWidth: 1
      },
      activeContainer: {
        backgroundColor: '#008da9',
        flexDirection: 'row-reverse',
        borderColor: '#008da9', borderWidth: 1
      },
      label: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 6,
        fontWeight: 'bold',
        color: '#fff',
        left:5
      },
    });

    class LabeledSwitch extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: props.value,
        };
        this.toggle = this.toggle.bind(this);
      }
      componentWillReceiveProps(nextProps) {
        // update local state.value if props.value changes....
        if (nextProps.value !== this.state.value) {
          this.setState({ value: nextProps.value });
        }
      }
      toggle() {
        // define how we will use LayoutAnimation to give smooth transition between state change
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        const newValue = !this.state.value;
        this.setState({
          value: newValue,
        });

        // fire function if exists
        if (typeof this.props.onValueChange === 'function') {
          this.props.onValueChange(newValue);
        }
      }
      render() {
        const { value } = this.state;

        return (
          <TouchableOpacity onPress={this.toggle}>
            <View style={[
              styles.container,
              value && styles.activeContainer]}
            >
              <View style={styles.circle} /></View>
          </TouchableOpacity>
        );
      }
    }

    LabeledSwitch.propTypes = {
      onValueChange: PropTypes.func,
      value: PropTypes.bool,
    };

    LabeledSwitch.defaultProps = {
    };

    export default LabeledSwitch;
