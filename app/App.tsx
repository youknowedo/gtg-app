import * as eva from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApplicationProvider } from "@ui-kitten/components";

import { HomeScreen } from "./screens/Home";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Home: undefined;
};

function App() {
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: "Overview" }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    );
}

export default App;
