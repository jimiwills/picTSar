/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {ReactNode as Node} from 'react';
import {
  useColorScheme,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Button,
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';
const {width} = Dimensions.get('window');
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [message, setMessage] = useState('state...');
  const [showOverlay, setShowOverlay] = useState(true);
  const [uri, setUri] = useState(
    'https://www.iphonehacks.com/wp-content/uploads/2019/11/Anamorphic-Pro-Visual-Effects-Mac-Bundle.jpg',
  );
  const [uris, setUris] = useState([uri]);

  const search = () => {
    fetch('https://images.search.yahoo.com/search/images?p=cats')
      .then(res => {
        res.text().then(text => {
          const r = [...text.matchAll(/"iurl":"([^"]+)"/g)];
          const i = r.map(x => x[1].replace(/\\\//g, '/'));
          setMessage('length: ' + i.length);
          setUri(i[0]);
          setUris(i);
        });
      })
      .catch(() => setMessage('error'));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (uris.length > 1) {
        setUris([...uris.slice(1), uris[0]]);
        setUri(uris[0]);
        setMessage(uris[0]);
        Image.prefetch(uris[1]).then(() => {});
      }
    }, 8000);
    return () => clearInterval(interval);
  });

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
      }}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => setShowOverlay(!showOverlay)}
        style={{flex: 1}}>
        <Image
          style={{
            resizeMode: 'cover',
            flex: 1,
          }}
          source={{uri}}
        />
      </TouchableHighlight>

      {showOverlay && (
        <View style={[styles.overlay, {height: 360}]}>
          <Text>Hello right here!</Text>
          <Button title={'Hello'} onPress={search} />
          <Text>{message}</Text>
        </View>
      )}

      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  // Flex to fill, position absolute,
  // Fixed left/top, and the width set to the window width
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width,
  },
});

export default App;
