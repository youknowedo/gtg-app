import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { IndexPath, Layout, Select, SelectItem, Spinner, Text } from "@ui-kitten/components";
import { Lesson, Skola24Object } from "skola24";
import { useEffect, useState } from "react";

export const HomeScreen = ({}: NativeStackScreenProps<any, "Home">) => {
		const [nextLesson, setNextLesson] = useState<Lesson[] | undefined>(
			undefined
		);
		const [classes, setClasses] = useState<Skola24Object[] | undefined>(
			undefined
		);
		const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
		const [loading, setLoading] = useState(false);

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
			setNextLesson(undefined);

			const currentDate = new Date();
			const startDate = new Date(currentDate.getFullYear(), 0, 1);
			const days = Math.floor(
				(currentDate.valueOf() - startDate.valueOf()) /
				(24 * 60 * 60 * 1000)
			);

			const weekNumber = Math.ceil(days / 7) - 1;

			const response = await fetch(
				"https://gtg.seabird.digital/api/schedule/lessons?" +
				`selectionGuid=${
					classes?.[index ? index.row : selectedIndex.row].groupGuid
				}` +
				`&week=${ weekNumber }` +
				`&day=${ days % 7 }` +
				`&year=2023`
			);
			setLoading(false);

			const json = await response.json();
			const data = json.data as Lesson[][];

			console.log((currentDate.getTime()));
			for (const block of data) {
				let notIt = false;
				for (const lesson of block) {
					if ((new Date(lesson.to).getTime()) < currentDate.getTime()) {
						notIt = true;
						break;
					}
				}

				if (!notIt) {
					setNextLesson(block);
					break;
				}
			}

		};

		useEffect(() => {
			getClasses().then(() => {
			});
		}, []);

		return (
			<Layout style={ { padding: 16 } } level="1">
				<Text>{ new Date().toDateString() }</Text>

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
				<Layout>
					<Text>Nästa lektion</Text>
					<Layout>
						{ loading ? <Spinner/> : (nextLesson ? nextLesson.map((l) => {
							return (
								<Layout>
									<Text>{ l?.name }</Text>
									<Text>{ l?.from?.valueOf() }</Text>
									<Text>{ l?.to?.valueOf() }</Text>
								</Layout>
							);
						}) : <Text>Inga fler lektioner idag</Text>) }
					</Layout>
				</Layout>
			</Layout>
		);
	}
;
