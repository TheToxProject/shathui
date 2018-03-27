import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, Text, Platform, Dimensions, PanResponder } from 'react-native';

import { noSelect } from '../../utils';
import Touchable from '../Touchable';
import styles from './styles';

class TabsView extends Component {
  constructor(props) {
    super(props);

    this.canMoveScreen = this.canMoveScreen.bind(this);
    this.startGesture = this.startGesture.bind(this);
    this.respondToGesture = this.respondToGesture.bind(this);
    this.terminateGesture = this.terminateGesture.bind(this);

    this.state = {
      tabsCount: 0,
      selectedIndex: 0,
      previousIndex: 0,
      pendingIndex: null,
      animated: new Animated.Value(0),
      offsetX: new Animated.Value(0)
    };
  }

  componentWillMount() {
    const { defaultTabIndex, children } = this.props;
    const { width } = this.state;
    const tabsCount = React.Children.toArray(children).length;

    this.setState({
      selectedIndex: defaultTabIndex,
      tabsCount,
      offsetX: new Animated.Value(tabsCount * width)
    });

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.canMoveScreen,
      onMoveShouldSetPanResponderCapture: this.canMoveScreen,
      onPanResponderGrant: this.startGesture,
      onPanResponderMove: this.respondToGesture,
      onPanResponderTerminate: this.terminateGesture,
      onPanResponderRelease: this.terminateGesture,
      onPanResponderTerminationRequest: () => true
    });
  }

  componentDidMount() {
    this.transitionTo(this.props.defaultTabIndex, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { previousIndex, selectedIndex } = this.state;
    if (previousIndex === null || selectedIndex !== nextState.selectedIndex) {
      return false;
    }

    return true;
  }

  _isMovingHorizontally(evt, gestureState) {
    const { swipeTolerance } = this.props;

    return (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy * swipeTolerance) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy * swipeTolerance)
    );
  }

  _canMoveScreen(evt, gestureState) {
    const { deadZone } = this.props;
    const { tabsCount, selectedIndex } = this.state;

    return (
      this.isMovingHorizontally(evt, gestureState) &&
      ((gestureState.dx >= deadZone && selectedIndex > 0) ||
        (gestureState.dx <= -deadZone && selectedIndex < tabsCount - 1))
    );
  }

  _startGesture(evt, gestureState) {
    const { onSwipeStart } = this.props;

    if (typeof onSwipeStart === 'function') {
      onSwipeStart(evt, gestureState);
    }

    this.state.animated.stopAnimation();
  }

  _respondToGesture(evt, gestureState) {
    const { tabsCount, selectedIndex } = this.state;

    if (
      // swiping left
      (gestureState.dx > 0 && selectedIndex <= 0) ||
      // swiping right
      (gestureState.dx < 0 && selectedIndex >= tabsCount - 1)
    ) {
      return;
    }

    this.state.animated.setValue(gestureState.dx);
  }

  _terminateGesture(evt, gestureState) {
    const { tabsCount, selectedIndex, pendingIndex } = this.state;
    const { width, onSwipeEnd } = this.props;

    let swipeDistanceThreshold = width / 1.75;
    let swipeVelocityThreshold = 0.15;

    if (typeof onSwipeEnd === 'function') {
      onSwipeEnd(evt, gestureState);
    }

    /**
     * On Android, velocity is way lower due to timestamp being in nanosecond
     * we MUST normalize it to have the same velocity on both iOS and Android
     */
    if (Platform.OS === 'android') {
      swipeVelocityThreshold = swipeVelocityThreshold / 1000000;
    }

    const currentIndex = pendingIndex ? pendingIndex : selectedIndex;
    let nextIndex = currentIndex;

    if (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
      (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
        Math.abs(gestureState.vx) > swipeVelocityThreshold)
    ) {
      nextIndex = Math.round(
        Math.min(
          Math.max(0, currentIndex - gestureState.dx / Math.abs(gestureState.dx)),
          tabsCount - 1
        )
      );
      this.setState({ selectedIndex: nextIndex });
    }

    if (!isFinite(nextIndex)) {
      nextIndex = currentIndex;
    }

    this.transitionTo(nextIndex);
  }

  _transitionTo(index, animated = true) {
    const { width, animTension, animFriction } = this.props;
    const offset = -index * width;

    const animationConfig = {
      useNativeDriver: Platform.OS === 'android',
      tension: animTension,
      friction: animFriction
    };

    // The following allows for initial tab index to avoid being
    // animated (which creates a laggy effect)
    let animationTiming = null;
    if (animated) {
      animationTiming = Animated.spring;
    } else {
      animationTiming = Animated.timing;
      animationConfig.duration = 0;
    }

    Animated.parallel([
      animationTiming(this.state.animated, {
        toValue: 0,
        ...animationConfig
      }),
      animationTiming(this.state.offsetX, {
        toValue: offset,
        ...animationConfig
      })
    ]).start(({ finished }) => {
      if (finished) {
        this.setState({ pendingIndex: null });
      }
    });

    this.setState({ pendingIndex: index });
  }

  render() {
    const { tabsCount, animated, offsetX } = this.state;
    const {
      children,
      backgroundColor,
      tabsColor,
      iconsColor,
      underlineColor,
      underlineHeight,
      width
    } = this.props;

    const childrens = React.Children.toArray(children);
    const maxTranslate = width * (tabsCount - 1);

    const tabLineTranslateX = Animated.add(animated, offsetX).interpolate({
      inputRange: [-maxTranslate, 0],
      outputRange: [maxTranslate / tabsCount, 0],
      extrapolate: 'clamp'
    });

    const translateX = Animated.add(animated, offsetX).interpolate({
      inputRange: [-maxTranslate, 0],
      outputRange: [-maxTranslate, 0],
      extrapolate: 'clamp'
    });

    return (
      <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
        <View style={styles.tabBar}>
          <View style={styles.tabs}>
            {childrens.map((view, index) => {
              return (
                <Touchable
                  key={view}
                  style={styles.touchable}
                  onPress={() => this.transitionTo(index)}
                >
                  <View
                    style={[
                      styles.tab,
                      {
                        width: width / tabsCount,
                        backgroundColor: tabsColor
                      }
                    ]}
                  >
                    <Text style={{ color: iconsColor }}>{view.props.icon}</Text>
                  </View>
                </Touchable>
              );
            })}
          </View>

          <Animated.View
            style={{
              backgroundColor: underlineColor,
              transform: [{ translateX: tabLineTranslateX }, { translateY: -underlineHeight }],
              height: underlineHeight,
              width: width / tabsCount - 1
            }}
          />
        </View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={{
            ...styles.contentView,
            transform: [{ translateX }],
            width: tabsCount * width,
            maxWidth: tabsCount * width,
            minWidth: tabsCount * width,
            ...Platform.select({ web: { overflowX: 'hidden' } })
          }}
        >
          {childrens.map(view => {
            return (
              <View key={view.props} style={{ width: width, maxWidth: width, ...noSelect }}>
                {view.props.children}
              </View>
            );
          })}
        </Animated.View>
      </View>
    );
  }
}

TabsView.propTypes = {
  children: PropTypes.array.isRequired,
  defaultTabIndex: PropTypes.number,
  backgroundColor: PropTypes.string,
  tabsColor: PropTypes.string,
  iconsColor: PropTypes.string,
  underlineColor: PropTypes.string,
  underlineHeight: PropTypes.number,
  width: PropTypes.number,
  deadZone: PropTypes.number,
  swipeTolerance: PropTypes.number,
  animFriction: PropTypes.number,
  animTension: PropTypes.number,
  onSwipeStart: PropTypes.func,
  onSwipeEnd: PropTypes.func
};

TabsView.defaultProps = {
  defaultTabIndex: 0,
  underlineColor: 'white',
  iconsColor: 'white',
  tabsColor: 'blue',
  backgroundColor: 'white',
  underlineHeight: 3,
  width: Dimensions.get('window').width,
  deadZone: 12,
  swipeTolerance: 2,
  animFriction: 35,
  animTension: 200,
  onSwipeStart: () => null,
  onSwipeEnd: () => null
};

export default TabsView;
