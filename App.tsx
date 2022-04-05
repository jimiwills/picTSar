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
  TouchableOpacity,
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';
const {width} = Dimensions.get('window');
const resizeModes = ['cover', 'contain', 'stretch', 'repeat', 'center'];
const emptyStringArray: Array<string> = [];
const defaultImageUri =
  'https://www.iphonehacks.com/wp-content/uploads/2019/11/Anamorphic-Pro-Visual-Effects-Mac-Bundle.jpg';

// @ts-ignore
const App: () => Node = () => {
  const [keywords, setKeywords] = useState('search for pics');
  const [message, setMessage] = useState('state...');
  const [showOverlay, setShowOverlay] = useState(true);
  const [uri, setUri] = useState(defaultImageUri);
  const [uris, setUris] = useState([[uri, 'WxH']]);
  const [candidates, setCandidates] = useState(emptyStringArray);
  const [resizeMode, setResizeMode] = useState('cover');
  const [currentSize, setCurrentSize] = useState('WxH');
  const [currentIndex, setCurrentIndex] = useState(0);
  const loadingMessage = 'loading...';

  useEffect(() => {
    const interval = setInterval(() => {
      if (uris.length > 1) {
        if (currentIndex + 1 < uris.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }
    }, 8000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    console.log(
      `useEffect currentIndex: ${currentIndex}; uris.length: ${uris.length}`,
    );
    if (uris.length == 0) {
      return;
    }
    setMessage(`${currentIndex + 1} of ${uris.length}`);
    setCurrentSize(uris[currentIndex][1]);
    setUri(uris[currentIndex][0]);
  }, [currentIndex, uris]);

  useEffect(() => {
    const myAsync = async () => {
      if (candidates.length > 0) {
        await tryUpdateStateFromResult(candidates[0], () => {
          setCandidates(candidates.slice(1));
        });
      }
    };
    myAsync();
  }, [candidates]);

  const reset = () => {
    setCurrentIndex(0);
    setCandidates([]);
    setUri(defaultImageUri);
    setUris([[defaultImageUri, 'WxH']]);
  };

  const search = () => {
    reset();
    setMessage(loadingMessage);
    fetch(
      'https://images.search.yahoo.com/search/images?p=' +
        keywords.replace(/ /g, '+'),
    ).then(res => res.text().then(processNewSearchResults));
  };

  const processNewSearchResults = async (text: string) => {
    console.log('process new results');
    const r = [...text.matchAll(/"iurl":"([^"]+.jpe?g)"/g)];
    const c = r.map(x => x[1].replace(/\\\//g, '/'));
    setCandidates(c);
  };

  const tryUpdateStateFromResult = async (im: string, p: () => void) => {
    await Image.getSize(
      im,
      (w, h) => {
        if (uris[0][0] == defaultImageUri) {
          setUris([...uris.slice(1), [im, `${w}x${h}`]]);
        }
        else {
          setUris([...uris, [im, `${w}x${h}`]]);
        }
        console.log(uris.length);
        p();
      },
      () => p,
    ).catch(() => p);
  };

  return (
    <View style={[styles.flex1, styles.background]}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => setShowOverlay(!showOverlay)}
        style={[styles.flex1]}>
        <Image style={[styles.flex1, {resizeMode}]} source={{uri}} />
      </TouchableHighlight>

      {showOverlay && (
        <>
          <View style={[styles.overlay]}>
            <View style={[styles.horizontal]}>
              <TextInput
                onChangeText={setKeywords}
                style={[styles.lighttext, styles.flex1, styles.input]}
                value={keywords}
              />

              <TouchableOpacity onPress={search} style={[styles.searchButton]}>
                <Text style={[styles.searchButtonLabel]}> GO </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.lighttext, styles.centered, styles.flex1]}>
              {message}
            </Text>
          </View>
          <View style={[styles.overlay2]}>
            <Text style={[styles.size]}>{currentSize}</Text>
            <View style={[styles.horizontal]}>
              {resizeModes.map(mode => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setResizeMode(mode)}
                  style={[
                    styles.button,
                    resizeMode === mode && styles.selected,
                  ]}>
                  <Text
                    style={[
                      styles.buttonLabel,
                      resizeMode === mode && styles.selectedLabel,
                    ]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
  },
  centered: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  background: {
    backgroundColor: 'black',
  },
  size: {
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'black',
    alignSelf: 'center',
    marginHorizontal: '1%',
    marginBottom: 6,
    flex: 1,
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  searchButtonLabel: {
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    alignSelf: 'center',
    marginHorizontal: '1%',
    marginBottom: 6,
    textAlign: 'center',
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  lighttext: {
    color: '#a9a9a9',
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
  overlay2: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width,
  },
});

export default App;
