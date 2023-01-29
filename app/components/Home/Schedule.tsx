import { Pressable, View } from "react-native";
import { Card, Icon, Spinner, Text } from "@ui-kitten/components";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

type ScheduleProps = {
	screenProps: NativeStackScreenProps<any, "Home">
}

const Schedule = ({ screenProps }: ScheduleProps) => {
	const dispatch = useDispatch();
	const { lessons, nextBlockIndex, error, loading } = useSelector((state: RootState) => state.lessons);

	return (
		<>
			<Pressable onPress={ () => screenProps.navigation.navigate("Schedule") }>
				<View style={ {
					marginBottom: 4,
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				} }>
					<Text category={ "h6" }>Schema</Text>
					<Icon style={ { width: 28, height: 28 } } name="arrow-ios-forward-outline"/>
				</View>
			</Pressable>
			<View>
				{ loading ? (
					<View style={ { alignItems: "center" } }>
						<Spinner/>
					</View>
				) : (lessons && nextBlockIndex ? (
					<View>
						<Text style={ { marginBottom: 4 } }
						      category={ "c1" }>{ lessons[nextBlockIndex].length > 1 ? "Nästa block:" : "Nästa lektion:" }</Text>
						{ lessons[nextBlockIndex].map((l) => {
							l.from = new Date(l.from);
							l.to = new Date(l.to);

							return (
								<Card accent={ () => <View
									style={ { backgroundColor: l.colors?.background, paddingVertical: 2 } }/> }
								      style={ { marginVertical: 4 } }>
									<View style={ { flexDirection: "row", justifyContent: "space-between" } }>
										<Text category={ "h6" }>{ l?.name }</Text>
										<Text category={ "p1" }>{ l.from.toLocaleString(undefined, {
											hour: "2-digit",
											minute: "numeric",
											hourCycle: "h24"
										}) } - { l.to.toLocaleString(undefined, {
											hour: "2-digit",
											minute: "numeric",
											hourCycle: "h24"
										}) }</Text>
									</View>
									<Text category={ "s1" }>{ l.teacher ? l.teacher + "; " : "" }{ l.room }</Text>
								</Card>
							);
						}) }
					</View>
				) : (
					<Card>
						<Text>{ error ? "Sum ting wong" : "Inga fler lektioner idag" }</Text>
					</Card>
				)) }
			</View>
		</>
	);
};
export default Schedule;