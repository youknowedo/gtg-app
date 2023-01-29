import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import Schedule from "../components/Home/Schedule";
import { Divider, Layout, Text } from "@ui-kitten/components";
import Events from "../components/Home/Events";
import Food from "../components/Home/Food";
import { ScrollView } from "react-native";

export const HomeScreen = (props: NativeStackScreenProps<any, "Home">) => {
	return (
		<ScrollView>
			<Layout style={ { paddingHorizontal: 16, paddingVertical: 24 } } level="1">
				<Text style={ { marginBottom: 8 } } category={ "h1" }>Översikt</Text>

				<Schedule screenProps={ props }/>

				<Divider style={ { marginVertical: 24 } }/>

				<Events screenProps={ props }/>

				<Divider style={ { marginVertical: 24 } }/>

				<Food/>
			</Layout>
		</ScrollView>
	);
};
