import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
} from "@ui-kitten/components";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Skola24Object } from "skola24";
import { HomeScreen } from "../../screens/Home";
import ScheduleScreen from "../../screens/Schedule";
import SettingsScreen from "../../screens/Settings";
import { RootState } from "../../store";
import { getAll } from "../fetchers";
import { getClasses } from "../fetchers/classes";
import { getEvents } from "../fetchers/events";
import { getLessons } from "../fetchers/lessons";
import { setClasses } from "../redux/classesSlice";

const Tab = createBottomTabNavigator();

const Layout = () => {
    const dispatch = useDispatch();
    const { classes, selectedClassIndex } = useSelector(
        (state: RootState) => state.classes
    );
    const c = useSelector((state: RootState) => state.classes);
    const { selectedRestaurantIndex } = useSelector(
        (state: RootState) => state.foods
    );

    const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
        <SafeAreaView>
            <BottomNavigation
                style={{
                    paddingVertical: 12,
                }}
                selectedIndex={state.index}
                onSelect={(index) => {
                    navigation.navigate(state.routeNames[index]);

                    if (index == 0)
                        getAll(
                            dispatch,
                            classes,
                            selectedClassIndex,
                            selectedRestaurantIndex
                        );
                }}
            >
                <BottomNavigationTab
                    title="ÖVERSIKT"
                    icon={<Icon name={"compass-outline"} />}
                />
                <BottomNavigationTab
                    title="SCHEMA"
                    icon={<Icon name={"menu-2-outline"} />}
                />
                <BottomNavigationTab
                    title="INSTÄLLNINGAR"
                    icon={<Icon name={"settings-outline"} />}
                />
            </BottomNavigation>
        </SafeAreaView>
    );

    useEffect(() => {
        getAll(
            dispatch,
            classes,
            selectedClassIndex,
            selectedRestaurantIndex
        ).then(() =>
            console.log("inexus" + JSON.stringify(c.selectedClassIndex))
        );
    }, []);

    return (
        <>
            <SafeAreaView />

            <Tab.Navigator
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <BottomTabBar {...props} />}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Schema" component={ScheduleScreen} />
                <Tab.Screen name="Installningar" component={SettingsScreen} />
            </Tab.Navigator>
        </>
    );
};

export default Layout;
