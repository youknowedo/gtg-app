import * as eva from "@eva-design/eva";
import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
    ApplicationProvider,
    BottomNavigation,
    BottomNavigationTab,
} from "@ui-kitten/components";

import React from "react";
import { SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "./lib/components/Layout";
import { HomeScreen } from "./screens/Home";
import ScheduleScreen from "./screens/Schedule";
import SettingsScreen from "./screens/Settings";
import store, { persistor } from "./store";

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
    <SafeAreaView>
        <BottomNavigation
            style={{
                paddingVertical: 12,
            }}
            selectedIndex={state.index}
            onSelect={(index) => navigation.navigate(state.routeNames[index])}
        >
            <BottomNavigationTab title="ÖVERSIKT" />
            <BottomNavigationTab title="SCHEMA" />
            <BottomNavigationTab title="INSTÄLLNINGAR" />
        </BottomNavigation>
    </SafeAreaView>
);

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                        <Layout>
                            <Tab.Navigator
                                screenOptions={{ headerShown: false }}
                                tabBar={(props) => <BottomTabBar {...props} />}
                            >
                                <Tab.Screen
                                    name="Home"
                                    component={HomeScreen}
                                />
                                <Tab.Screen
                                    name="Schema"
                                    component={ScheduleScreen}
                                />
                                <Tab.Screen
                                    name="Installningar"
                                    component={SettingsScreen}
                                />
                            </Tab.Navigator>
                        </Layout>
                    </NavigationContainer>
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
