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
    Icon,
    IconRegistry,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import React from "react";
import { SafeAreaView } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "./lib/components/Layout";
import { getAll } from "./lib/fetchers";
import { HomeScreen } from "./screens/Home";
import ScheduleScreen from "./screens/Schedule";
import SettingsScreen from "./screens/Settings";
import store, { persistor } from "./store";

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                        <Layout />
                    </NavigationContainer>
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
