/**
* MIT License
*
* Copyright (c) 2017 Douglas Nassif Roma Junior
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
//https://github.com/douglasjunior/react-native-simple-dialogs
/**
* modified by Martin SD: changed to unified ios style
*/

import React, { Component } from 'react'
import {
    View,
    Text,
    Button,
    Platform,
    ViewPropTypes
} from 'react-native'

const { OS } = Platform;

import PropTypes from 'prop-types';

import Dialog from './Dialog'
import TouchableEffect from './TouchableEffect';
import MyText from '../../component/MyText';

class ConfirmDialog extends Component {

    renderMessage() {
        const { message, messageStyle } = this.props;

        const textAlign = "center";

        if (message)
            return (<MyText style={[{ textAlign, color: "#00000089", fontSize: 18 }, messageStyle]}>{message}</MyText>)
    }

    renderButton(button, positive) {
        if (button) {
            const { titleStyle, style, onPress, disabled, color, } = button;

            const title = button.title;

            const containerStyle = {
                    height: 46, borderRadius: 6,
                    justifyContent: "center",
                    paddingLeft:10, paddingRight:10, width:120,
                    backgroundColor: positive ?'#0097de':'#fff',
                    borderColor: '#0097de', borderWidth:1
                };

            const textStyle = {
                    textAlign: "center",
                    textAlignVertical: "center",
                    color: positive ?"#fff":'#0097de',
                    fontSize: 16,
                    fontWeight: positive ? "bold" : "normal"
                };

            const touchableStyle = { flex: 1 };

            return (
                <TouchableEffect onPress={onPress} disabled={disabled} style={touchableStyle}>
                    <View style={[containerStyle, style]}>
                        <Text
                            style={[textStyle, titleStyle]}
                        >{title}</MyText>
                    </View>
                </TouchableEffect>
            )
        }
    }

    renderButtons() {
        const { negativeButton, positiveButton } = this.props;

        const containerStyle = { flexDirection: "row", justifyContent: 'space-around', alignSelf: 'center', width: Platform.OS === 'ios' ? '80%':'90%'};

        const dividerVertStyle = { width: negativeButton ? 1 : 0, backgroundColor: "#00000011" };

        const dividerHoriStyle = { height: 1, backgroundColor: "#00000011" };

        return (
            <View>
                <View style={containerStyle}>
                    {this.renderButton(positiveButton, true)}
                    <View style={{width:5}}></View>
                    {this.renderButton(negativeButton, false)}
                </View>
            </View>
        )
    }

    renderContent() {
        const { children } = this.props;

        if (children)
            return children;
        else
            return this.renderMessage();
    }

    render() {
        return (
            <Dialog {...this.props}
                buttons={this.renderButtons()} >
                {this.renderContent()}
            </Dialog>
        )
    }
}

const buttonPropType = PropTypes.shape({
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    titleStyle: Text.propTypes.style,
    style: ViewPropTypes.style
});

ConfirmDialog.propTypes = {
    ...Dialog.propTypes,
    message: PropTypes.string,
    messageStyle: Text.propTypes.style,
    negativeButton: buttonPropType,
    positiveButton: buttonPropType.isRequired
}

export default ConfirmDialog;
