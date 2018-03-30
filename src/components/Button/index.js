import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import Touchable from '../Touchable';
import styles from './styles';

export class Button extends Component {
  transformText(text) {
    if (this.props.uppercase) {
      return String(text).toUpperCase();
    }

    return text;
  }

  getButtonStyles() {
    const { backgroundColor, size, raised } = this.props;
    const sizeStyle = styles.buttonSizes[size];

    if (raised) {
      return {
        backgroundColor: 'rgba(0,0,0,0)'
      };
    }

    return {
      backgroundColor: backgroundColor,
      paddingHorizontal: sizeStyle.paddingHorizontal || sizeStyle.padding,
      paddingVertical: sizeStyle.paddingVertical || sizeStyle.padding
    };
  }

  getTextStyles() {
    const { color, raised, size } = this.props;
    const sizeStyle = styles.buttonSizes[size];

    if (raised) {
      return {
        color: 'white'
      };
    }

    return {
      color: color,
      fontSize: sizeStyle.fontSize
    };
  }

  render() {
    const { text, textStyle, style, onLongPress, onPress, onPressDelay } = this.props;

    const borderRadius = style && style.borderRadius ? style.borderRadius : 0;
    const overflow = style && style.overflow ? style.overflow : 'hidden';

    return (
      <Touchable
        activeOpacity={0.8}
        onPress={() => setTimeout(() => onPress(), onPressDelay)}
        onLongPress={() => onLongPress()}
        style={{ borderRadius, overflow }}
      >
        <View style={[styles.button, this.getButtonStyles(), style]}>
          <Text style={[styles.text, this.getTextStyles(), textStyle]}>
            {this.transformText(text)}
          </Text>
        </View>
      </Touchable>
    );
  }
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  text: PropTypes.string,
  raised: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'normal', 'medium']),
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  uppercase: PropTypes.bool,
  onPressDelay: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onPress: () => null,
  onLongPress: () => null
};

Button.defaultProps = {
  text: 'Button',
  size: 'normal',
  raised: false,
  backgroundColor: 'blue',
  color: 'white',
  onPressDelay: 100,
  style: null,
  textStyle: null
};

export default Button;
