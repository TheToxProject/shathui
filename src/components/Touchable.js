import { TouchableNativeFeedback, Platform } from 'react-native';
import PropTypes from 'prop-types';
import TouchableRipple from 'react-native-material-ripple';

const Touchable = Platform.select({
  ios: TouchableRipple,
  android: TouchableNativeFeedback,
  windows: TouchableRipple,
  web: TouchableRipple
});

Touchable.propTypes = {
  children: PropTypes.isRequired
};

export default Touchable;
