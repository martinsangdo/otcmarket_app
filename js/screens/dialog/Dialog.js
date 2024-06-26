/**
* MIT License
*
* Copyright (c) 2017 Douglas Nassif Roma Junior
https://github.com/douglasjunior/react-native-simple-dialogs
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

import React, { Component } from 'react'
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    Text,
    Platform,
    ViewPropTypes
} from 'react-native'
const { OS } = Platform;

import PropTypes from 'prop-types';
import MyText from '../../component/MyText';

class Dialog extends Component {

    renderContent() {
        const { children, contentStyle } = this.props;

        return (
            <View style={[{
                width: '100%',
                padding: 24,
                paddingTop: 20
            }, contentStyle]}>
                {children}
            </View>
        )
    }

    renderTitle() {
        const { title, titleStyle } = this.props;

        const textAlign = OS === 'ios' ? "center" : null;

        if (title)
            return (
                <MyText style={[{
                    textAlign,
                    color: "#000000DD",
                    fontSize: 20,
                    margin: 24,
                    marginBottom: 0
                }, titleStyle]}>
                    {title}
                </MyText>
            )
    }

    renderButtons() {
        const { buttons, buttonsStyle } = this.props;

        const containerStyle = OS === 'ios' ?
            {} :
            {
                width: '100%',
                paddingLeft: 24,
                paddingRight: 8,
                paddingTop: 8,
                paddingBottom: 8
            };

        if (buttons)
            return (
                <View style={[containerStyle, buttonsStyle]}>
                    {buttons}
                </View>
            )
    }

    _renderOutsideTouchable(onTouch) {
        const view = <View style={{ flex: 1, width: '100%' }} />

        if (!onTouch) return view;

        return (
            <TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        )
    }

    render() {
        const {
            dialogStyle, visible, animationType, onRequestClose, onShow,
            onOrientationChange, onTouchOutside, overlayStyle, supportedOrientations
        } = this.props;

        const dialogBackgroundColor = OS === 'ios' ? "#e8e8e8" : "#ffffff";
        const dialogBorderRadius = 6; //Martin SD changed

        return (
            <Modal
                animationType={animationType}
                transparent={true}
                visible={visible}
                onRequestClose={onRequestClose}
                onShow={onShow}
                onOrientationChange={onOrientationChange}
                supportedOrientations={supportedOrientations}
            >
                <View style={[{
                    flex: 1,
                    backgroundColor: "#000000AA",
                    padding: 24
                }, overlayStyle]}>

                    {this._renderOutsideTouchable(onTouchOutside)}

                    <View style={[{
                        backgroundColor: dialogBackgroundColor,
                        width: '100%',
                        shadowOpacity: 0.24,
                        borderRadius: dialogBorderRadius,
                        elevation: 4,
                        shadowOffset: {
                            height: 4,
                            width: 2
                        }
                    }, dialogStyle]}>

                        {this.renderTitle()}

                        {this.renderContent()}

                        {this.renderButtons()}

                    </View>

                    {this._renderOutsideTouchable(onTouchOutside)}

                </View>
            </Modal>
        )
    }
}

Dialog.propTypes = {
    dialogStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
    buttonsStyle: ViewPropTypes.style,
    overlayStyle: ViewPropTypes.style,
    buttons: PropTypes.element,
    visible: PropTypes.bool,
    // animationType: Modal.propTypes.animationType,
    onRequestClose: PropTypes.func,
    onShow: PropTypes.func,
    // onOrientationChange: Modal.propTypes.onOrientationChange,
    onTouchOutside: PropTypes.func,
    // supportedOrientations: Modal.propTypes.supportedOrientations,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style
}

Dialog.defaultProps = {
    visible: false,
    onRequestClose: () => null
};

export default Dialog;
