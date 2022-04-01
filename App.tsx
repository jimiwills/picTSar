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
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Button,
  TextInput,
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';
const {width} = Dimensions.get('window');

const App: () => Node = () => {
  const [keywords, setKeywords] = useState('cats');
  const [message, setMessage] = useState('state...');
  const [showOverlay, setShowOverlay] = useState(true);
  const [uri, setUri] = useState(
    'https://www.iphonehacks.com/wp-content/uploads/2019/11/Anamorphic-Pro-Visual-Effects-Mac-Bundle.jpg',
  );
  const [uris, setUris] = useState([uri]);

  const search = () => {
    fetch(
      'https://images.search.yahoo.com/search/images?p=' +
        keywords.replace(/ /g, '+'),
    )
      .then(res => {
        res.text().then(text => {
          const r = [...text.matchAll(/"iurl":"([^"]+)"/g)];
          const i = r.map(x => x[1].replace(/\\\//g, '/'));
          setMessage('Results: ' + i.length);
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
        Image.prefetch(uris[1])
          .then(() => {})
          .catch(() => {});
      }
    }, 8000);
    return () => clearInterval(interval);
  });

  return (
    <View style={[styles.flex1]}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => setShowOverlay(!showOverlay)}
        style={[styles.flex1]}>
        <Image style={[styles.image]} source={{uri}} />
      </TouchableHighlight>

      {showOverlay && (
        <View style={[styles.overlay]}>
          <Text style={[styles.lighttext]}>Enter keyword</Text>
          <View style={[styles.horizontal]}>
            <TextInput
              onChangeText={setKeywords}
              style={[styles.lighttext, styles.flex1]}
              value={keywords}
            />
            <Button title={' GO '} onPress={search} />
          </View>
          <Text style={[styles.lighttext]}>{message}</Text>
        </View>
      )}

      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  lighttext: {
    color: '#a9a9a9',
  },
  image: {
    resizeMode: 'cover',
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    flex: 1,
  },
  flex1: {flex: 1},
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
