import React, { Component } from 'react';
import { Platform, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { getStyles } from './styles';

import webMuted from './assets/logo-muted.svg';
import webWhite from './assets/logo-white.svg';
import webBlack from './assets/logo-black.svg';
import muted from './assets/logo-muted.png';
import white from './assets/logo-white.png';
import black from './assets/logo-black.png';

const ORIGINAL_WIDTH = 149;
const ORIGINAL_HEIGHT = 60;
const SCALE_RATIO = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;

export class Logo extends Component {
  getSizeStyle(size) {
    return {
      small: {
        width: ORIGINAL_WIDTH / 2,
        height: ORIGINAL_HEIGHT / 2
      },
      medium: {
        width: ORIGINAL_WIDTH / 1.5,
        height: ORIGINAL_HEIGHT / 1.5
      },
      normal: {
        width: ORIGINAL_WIDTH,
        height: ORIGINAL_HEIGHT
      },
      big: {
        width: ORIGINAL_WIDTH * 1.5,
        height: ORIGINAL_HEIGHT * 1.5
      },
      bigger: {
        width: ORIGINAL_WIDTH * 2,
        height: ORIGINAL_HEIGHT * 2
      }
    }[size];
  }

  getAlignStyle(align) {
    return {
      left: 'flex-start',
      right: 'flex-end',
      center: 'center'
    }[align];
  }

  getVariantImage(variant) {
    return Platform.select({
      web: {
        muted: webMuted,
        white: webWhite,
        black: webBlack
      },
      default: {
        muted: muted,
        white: white,
        black: black
      }
    })[variant];
  }

  render() {
    const { size, align, variant, height, ...rest } = this.props;
    const sizeStyle = this.getSizeStyle(size);
    const alignStyle = this.getAlignStyle(align);
    const logoSource = this.getVariantImage(variant);
    const logoStyle = height ? { height: height, width: height * SCALE_RATIO } : sizeStyle;
    const styles = getStyles(alignStyle);

    return (
      <View style={styles} {...rest}>
        <Image
          {...rest}
          style={logoStyle}
          resizeMode={'contain'}
          {...Platform.select({
            android: { fadeDuration: 0 },
            ios: { fadeDuration: 0 }
          })}
          draggable={false}
          source={logoSource}
        />
      </View>
    );
  }
}

Logo.propTypes = {
  height: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'normal', 'big', 'bigger']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  variant: PropTypes.oneOf(['muted', 'white', 'black'])
};

Logo.defaultProps = {
  size: 'normal',
  align: 'center',
  variant: 'white',
  height: 30
};

export default Logo;
