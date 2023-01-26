import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card, Icon, IndexPath, Layout, Select, SelectItem, Spinner, Text } from "@ui-kitten/components";
import { Lesson, Skola24Object } from "skola24";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

export const HomeScreen = ({ navigation }: NativeStackScreenProps<any, "Home">) => {
		const [nextBlock, setNextBlock] = useState<Lesson[] | undefined>(
			undefined
		);
		const [classes, setClasses] = useState<Skola24Object[] | undefined>(
			undefined
		);
		const [selectedIndex, setSelectedIndex] = useState(new IndexPath(1));
		const [loading, setLoading] = useState(false);
		const [errorText, setErrorText] = useState<string | undefined>(undefined);

		let selectedClass = classes?.[selectedIndex.row];

		const getClasses = async () => {
			const response = await fetch(
				"https://gtg.seabird.digital/api/schedule/classes"
			);

			const data = (await response.json()).data as Skola24Object[];

			setClasses(data);

			await getLessons();
		};

		const getLessons = async (index?: IndexPath) => {
			setLoading(true);
			setNextBlock(undefined);

			const currentDate = new Date();
			const startDate = new Date(currentDate.getFullYear(), 0, 1);
			const days = Math.floor(
				(currentDate.valueOf() - startDate.valueOf()) /
				(24 * 60 * 60 * 1000)
			);

			const weekNumber = Math.ceil(days / 7);

			const url = "https://gtg.seabird.digital/api/schedule/lessons?" +
				`selectionGuid=${
					classes?.[index ? index.row : selectedIndex.row].groupGuid
				}` +
				`&week=${ weekNumber }` +
				`&day=${ (days % 7) }` +
				`&year=2023`;
			console.log(url);
			const response = await fetch(
				url
			);
			setLoading(false);

			if (!response.ok) {
				console.log(await response.text());
				setErrorText("Sum ting wong");
				return;
			}

			const json = await response?.json();
			const data = json.data as Lesson[][];

			for (const block of data) {
				let isNextBlock = false;
				for (const lesson of block) {
					console.log(lesson.to);
					if ((new Date(lesson.from).getTime()) > currentDate.getTime()) {
						isNextBlock = true;
						break;
					}
				}

				if (isNextBlock) {
					setNextBlock(block);
					break;
				}
			}

		};

		useEffect(() => {
			getClasses().then(() => {
			});
		}, []);

		return (
			<Layout style={ { paddingHorizontal: 16, paddingVertical: 24 } } level="1">
				<Select
					selectedIndex={ selectedIndex }
					value={ selectedClass?.groupName }
					onSelect={ (index) => {
						setSelectedIndex(index as IndexPath);

						getLessons(index as IndexPath).then(() => {
						});
					} }
				>
					{ classes?.map((c) => {
						return <SelectItem title={ c.groupName }/>;
					}) }
				</Select>
				<Pressable onPress={ () => navigation.navigate("Schedule") }>

					<View style={ {
						marginBottom: 2,
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center"
					} }>
						<Text category={ "h4" }>Schema</Text>
						<Icon style={ { width: 28, height: 28 } } name="arrow-ios-forward"/>
					</View>
				</Pressable>
				<View>
					{ loading ? (
						<View style={ { alignItems: "center" } }>
							<Spinner/>
						</View>
					) : (nextBlock ? (
						<View>
							<Text style={ { marginBottom: 4 } }
							      category={ "c1" }>{ nextBlock.length > 1 ? "Nästa block:" : "Nästa lektion:" }</Text>
							{ nextBlock.map((l) => {
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
							<Text>{ errorText ?? "Inga fler lektioner idag" }</Text>
						</Card>
					)) }
				</View>
			</Layout>
		);
	}
;
