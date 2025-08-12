import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PodcastsScreen from './screens/PodcastsScreen';
import PlayerScreen from './screens/PlayerScreen';
import QueueScreen from './screens/QueueScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName: string;

                switch (route.name) {
                  case 'Podcasts':
                    iconName = 'podcasts';
                    break;
                  case 'Player':
                    iconName = 'play-circle';
                    break;
                  case 'Queue':
                    iconName = 'queue-music';
                    break;
                  case 'Settings':
                    iconName = 'settings';
                    break;
                  default:
                    iconName = 'circle';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
              headerShown: false,
            })}>
            <Tab.Screen name="Podcasts" component={PodcastsScreen} />
            <Tab.Screen name="Player" component={PlayerScreen} />
            <Tab.Screen name="Queue" component={QueueScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;