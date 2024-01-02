/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useRef} from 'react';
import {
  useColorScheme,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  Button,
  Touchable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const width = Dimensions.get('window').width;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const carouselRef = useRef(null);
  const offsetX = useSharedValue(0);
  const tapX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const onDragBy10Pixels = () => {
    const targetX = offsetX.value + 10;
    isSwiping.value = true;

    // Simulate swipe by animating to the new position
    offsetX.value = withSpring(
      targetX,
      {damping: 2, stiffness: 80},
      isFinished => {
        if (isFinished) {
          isSwiping.value = false;
        }
      },
    );
  };

  const renderCarouselItem = ({index}) => (
    <View style={{flex: 1, borderWidth: 1, justifyContent: 'center'}}>
      <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
    </View>
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = offsetX.value;
      tapX.value = offsetX.value;
    },
    onActive: (event, context) => {
      if (!isSwiping.value) {
        const diff = event.translationX - context.startX;
        tapX.value = context.startX + diff;
      }
    },
    onEnd: () => {
      // Check if the tap gesture initiated a swipe
      if (Math.abs(tapX.value - offsetX.value) >= 10) {
        runOnJS(onDragBy10Pixels)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offsetX.value}],
    };
  });

  setTimeout(() => {
    carouselRef.current?.scrollTo({count: 0.4, animated: true});
  }, 1000);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={backgroundStyle}>
        <Carousel
          ref={carouselRef}
          // loop
          width={width}
          height={width / 2}
          // autoPlay={true}
          data={[...new Array(6).keys()]}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({index}) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
            </View>
          )}
        />
        <Carousel
          // loop
          width={width}
          height={width / 2}
          // autoPlay={true}
          data={[...new Array(6).keys()]}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({index}) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
            </View>
          )}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            backgroundColor: 'green',
          }}>
          <Text
            onPress={() => {
              // startAnimation();
            }}>
            Text
          </Text>
        </TouchableOpacity>
        {/* <View>
          <TapGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View>
              <Carousel
                ref={carouselRef}
                data={[...new Array(6).keys()]}
                renderItem={renderCarouselItem}
                // sliderWidth={200}
                // itemWidth={150}
                // containerCustomStyle={{overflow: 'hidden'}}
              />
            </Animated.View>
          </TapGestureHandler>
        </View> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// const styles = StyleSheet.create({});

export default App;
