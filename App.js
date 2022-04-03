import React, { useState, useEffect } from 'react';
import { Image, View, Text, Dimensions } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Magnetometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';


const { height, width } = Dimensions.get('window');

export default App = () => {

  const [subscription, setSubscription] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const [inRange, setInRange] = useState(false);
  const [checkpoints, setCheckpoints] = [0, 0, 90, 90, 180, 180, 270, 270]

  useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _angle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const _direction = (degree) => {
    if (degree >= 22.5 && degree < 67.5) {
      return 'NE';
    }
    else if (degree >= 67.5 && degree < 112.5) {
      return 'E';
    }
    else if (degree >= 112.5 && degree < 157.5) {
      return 'SE';
    }
    else if (degree >= 157.5 && degree < 202.5) {
      return 'S';
    }
    else if (degree >= 202.5 && degree < 247.5) {
      return 'SW';
    }
    else if (degree >= 247.5 && degree < 292.5) {
      return 'W';
    }
    else if (degree >= 292.5 && degree < 337.5) {
      return 'NW';
    }
    else {
      return 'N';
    }
  };

  const buzz_light = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  const buzz_heavy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }


  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  const _degree = (magnetometer) => {
    let degree = magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    if (degree < 20 || degree > 340) {
      if (!inRange) setInRange(true);
      buzz_heavy();
    }
    else {
      if (inRange) setInRange(false);
    }
    // if ( degree == checkpoints[0]) {
    //   checkpoints.splice
    // }
    // else if ((degree > 0 && degree < 10) || (degree > 350 && degree < 360))
    //   buzz_heavy();
    return degree
  };

  return (

    <Grid style={{ backgroundColor: 'black' }}>
      {/* <Row style={{ alignItems: 'center' }} size={.9}>
        <Col style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: '#fff',
              fontSize: height / 26,
              fontWeight: 'bold'
            }}>
            {_direction(_degree(magnetometer))}
          </Text>
        </Col>
      </Row> */}
      <Row style={{ alignItems: 'center' }} size={.1}>
        <Col style={{ alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: width, alignItems: 'center', top: 0 }}>
            <Image source={require('./assets/basis.png')} style={{
              height: height,
              resizeMode: 'contain'
            }} />
          </View>
        </Col>
      </Row>
      <Row style={{ alignItems: 'center' }} size={.1}>
        <Col style={{ alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: width, alignItems: 'center', top: 0 }}>
            <Image source={require('./assets/arrow.png')} style={{
              height: height - 30,
              resizeMode: 'contain',
              transform: [{ rotate: magnetometer + 270 + 'deg' }]
            }} />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={2}>
        <Text style={{
          color: '#fff',
          fontSize: height / 27,
          width: width,
          position: 'absolute',
          textAlign: 'center',
          opacity: 0
        }}>
          {_degree(magnetometer)}°
          </Text>

        <Col style={{ alignItems: 'center' }}>

        {inRange && <Image source={require("./assets/circle.png")} style={{
            height: width,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'contain',
            marginTop: 100,
            // transform: [{ rotate: 180 - magnetometer + 'deg' }]
          }} />}
          {!inRange && <Image source={require("./assets/sadcircle.png")} style={{
            height: width,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'contain',
            marginTop: 100,
            // transform: [{ rotate: 180 - magnetometer + 'deg' }]
          }} />}

        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={1}>
        {/* <Col style={{ alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Copyright @RahulHaque</Text>
        </Col> */}
      </Row>

    </Grid>

  );
}
