import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EvaIconsPack } from "@ui-kitten/eva-icons";


import { HomeScreen } from "./screens/Home";
import ScheduleScreen from "./screens/Schedule";

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
	Home: undefined;
};

function App() {
	return (
		<>
			<IconRegistry icons={ EvaIconsPack }/>
			<ApplicationProvider { ...eva } theme={ eva.light }>
				<NavigationContainer>
					<Tab.Navigator
						screenOptions={ ({ route }) => ({
							tabBarIcon: ({ focused, color, size }) => {
								let iconName = "";

								if (route.name === "Home") {
									iconName = focused
										? "ios-information-circle"
										: "ios-information-circle-outline";
								} else if (route.name === "Settings") {
									iconName = focused ? "ios-list" : "ios-list-outline";
								}

								// You can return any component that you like here!
								return <Ionicons name={ iconName as any } size={ size } color={ color }/>;
							},
							tabBarActiveTintColor: "tomato",
							tabBarInactiveTintColor: "gray",
						}) }
					>
						<Tab.Screen name="Home" component={ HomeScreen }/>
						<Tab.Screen name="Schedule" component={ ScheduleScreen }/>
					</Tab.Navigator>
				</NavigationContainer>
			</ApplicationProvider></>
	);
}

export default App;
