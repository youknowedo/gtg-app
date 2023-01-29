import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Lesson, Skola24Object } from "skola24";
import { setClasses } from "../classesSlice";
import { setLessons, setLoadingLessons, setLoadingLessonsError } from "../lessonsSlice";
import { SafeAreaView } from "react-native";

const Layout = ({ children }: { children: string | JSX.Element | JSX.Element[] | (() => JSX.Element) }) => {
	const dispatch = useDispatch();
	const { classes, selectedIndex } = useSelector((state: RootState) => state.classes);
	const classesState = useSelector((state: RootState) => state.classes);

	const getClasses = async () => {
		const response = await fetch(
			"https://gtg.seabird.digital/api/schedule/classes"
		);

		const data = (await response.json()).data as Skola24Object[];

		dispatch(setClasses(data));

		await getLessons(data?.[classesState.selectedIndex].groupGuid);
	};

	const getLessons = async (selectionGuid?: string) => {
		dispatch(setLoadingLessons(true));
		dispatch(setLoadingLessonsError(false));

		const currentDate = new Date();
		const startDate = new Date(currentDate.getFullYear(), 0, 1);
		const days = Math.floor(
			(currentDate.valueOf() - startDate.valueOf()) /
			(24 * 60 * 60 * 1000)
		);

		const weekNumber = Math.ceil(days / 7);

		const url = "https://gtg.seabird.digital/api/schedule/lessons?" +
			`selectionGuid=${
				selectionGuid ?? classesState.classes?.[classesState.selectedIndex].groupGuid
			}` +
			`&week=${ weekNumber - 1 }` +
			`&day=${ (days % 7) }` +
			`&year=2023`;
		console.log(url);
		const response = await fetch(
			url
		);
		dispatch(setLoadingLessons(false));

		if (!response.ok) {
			console.log(await response.text());
			dispatch(setLoadingLessonsError(true));

			return;
		}

		const json = await response?.json();
		const data = json.data as Lesson[][];

		dispatch(setLessons(data));
	};

	useEffect(() => {
		getClasses().then(() => {

		});
	}, []);

	return (
		<>
			<SafeAreaView>
			</SafeAreaView>

			{ children }
		</>
	);
};

export default Layout;