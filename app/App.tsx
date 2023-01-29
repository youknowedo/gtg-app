import * as eva from "@eva-design/eva";
import { ApplicationProvider, BottomNavigation, BottomNavigationTab, Icon, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EvaIconsPack } from "@ui-kitten/eva-icons";


import Layout from "./components/Layout";
import { HomeScreen } from "./screens/Home";
import ScheduleScreen from "./screens/Schedule";
import { Provider } from "react-redux";
import store from "./store";
import React from "react";
import { SafeAreaView } from "react-native";
import SettingsScreen from "./screens/Settings";

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
	<SafeAreaView>
		<BottomNavigation
			style={ {
				paddingVertical: 12
			} }
			selectedIndex={ state.index }
			onSelect={ index => navigation.navigate(state.routeNames[index]) }>
			<BottomNavigationTab title="ÖVERSIKT" icon={ <Icon name={ "compass-outline" }/> }/>
			<BottomNavigationTab title="SCHEMA" icon={ <Icon name={ "menu-2-outline" }/> }/>
			<BottomNavigationTab title="SCHEMA" icon={ <Icon name={ "settings-outline" }/> }/>
		</BottomNavigation>
	</SafeAreaView>
);

function App() {

	return (
		<Provider store={ store }>
			<IconRegistry icons={ EvaIconsPack }/>
			<ApplicationProvider { ...eva } theme={ eva.light }>
				<NavigationContainer>
					<Layout>
						<Tab.Navigator screenOptions={ { headerShown: false } }
						               tabBar={ props => <BottomTabBar { ...props } /> }>
							<Tab.Screen name="Home" component={ HomeScreen }/>
							<Tab.Screen name="Schema" component={ ScheduleScreen }/>
							<Tab.Screen name="Installningar" component={ SettingsScreen }/>
						</Tab.Navigator>
					</Layout>
				</NavigationContainer>
			</ApplicationProvider>
		</Provider>
	);
}

export default App;
