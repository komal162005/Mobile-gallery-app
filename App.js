import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./screens/Home";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "@expo/vector-icons/FontAwesome";
import Search from "./screens/Search";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 250,
            paddingTop: 20,
          },
          headerStyle: {
            backgroundColor: "#f4978e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          drawerActiveTintColor: "blue",
          drawerLabelStyle: {
            color: "#111",
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => {
              <Icon name="home" size={24} color="black" />;
            },
          }}
          component={Home}
        />
        <Drawer.Screen
          name="search"
          options={{
            headerShown: false,
            drawerIcon: () => {
              <Icon name="home" size={24} color="black" />;
            },
          }}
          component={Search}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
