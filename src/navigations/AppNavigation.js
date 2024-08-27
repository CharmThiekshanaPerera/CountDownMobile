// src/navigations/AppNavigation.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import IngredientsDetailsScreen from '../screens/IngredientsDetails/IngredientsDetailsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy/PrivacyPolicyScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { useTheme } from '../contexts/ThemeContext';
import SavedData from '../screens/BreathingMeter/SavedData';
import TimerScreen from '../screens/Focus/TimerScreen'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HeaderMenu({ navigation, toggleTheme, theme }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={24} color={theme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme === 'dark' ? '#333' : 'white' }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleTheme();
                setModalVisible(false);
              }}
            >
              <Text style={[styles.menuItemText, { color: theme === 'dark' ? 'white' : '#333' }]}>
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Settings');
                setModalVisible(false);
              }}
            >
              <Text style={[styles.menuItemText, { color: theme === 'dark' ? 'white' : '#333' }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('PrivacyPolicy');
                setModalVisible(false);
              }}
            >
              <Text style={[styles.menuItemText, { color: theme === 'dark' ? 'white' : '#333' }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function MainNavigator() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "Count Down", // Set the app name as the title
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#333' : '#fff', // Optional: Adjust background color based on the theme
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#000', // Optional: Adjust text color based on the theme
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={({ navigation }) => ({
          headerRight: () => <HeaderMenu navigation={navigation} toggleTheme={toggleTheme} theme={theme} />,
        })}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => <HeaderMenu navigation={navigation} toggleTheme={toggleTheme} theme={theme} />,
        })}
      />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="RecipesList" component={RecipesListScreen} />
      <Stack.Screen name="Ingredient" component={IngredientScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="IngredientsDetails" component={IngredientsDetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="SavedData" component={SavedData} />
      <Stack.Screen name="TimerScreen" component={TimerScreen} />
    </Stack.Navigator>
  );
}

function DrawerStack() {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName="Main"
      drawerStyle={{
        width: 250,
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => <DrawerContainer navigation={navigation} />}
    >
      <Drawer.Screen name="Main" component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <DrawerStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 150,
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 16,
  },
});
