import { Lesson } from "skola24";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store from "./store";

export type LessonsState = {
	lessons?: Lesson[][]
	nextBlockIndex?: number
	loading: boolean
	error: boolean
}

const initialState: LessonsState = {
	lessons: undefined,
	nextBlockIndex: undefined,
	loading: false,
	error: false,
};

const classesSlice = createSlice({
	name: "lessons",
	initialState,
	reducers: {
		getLessons: (state, selectionGuid: PayloadAction<string | undefined>) => {
			const currentDate = new Date();
			const startDate = new Date(currentDate.getFullYear(), 0, 1);
			const days = Math.floor(
				(currentDate.valueOf() - startDate.valueOf()) /
				(24 * 60 * 60 * 1000)
			);

			const weekNumber = Math.ceil(days / 7);

			const url = "https://gtg.seabird.digital/api/schedule/lessons?" +
				`selectionGuid=${
					selectionGuid.payload ?? store.getState().classes.classes?.[store.getState().classes.selectedIndex].groupGuid
				}` +
				`&week=${ weekNumber - 1 }` +
				`&day=${ (days % 7) }` +
				`&year=2023`;
			console.log(url);
			fetch(
				url
			).then(response => {
				response?.json().then(json => {
					state.lessons = json.data as Lesson[][];
				});
			}).catch(e => {
				state.error = true;
			});
			state.loading = false;
		},
		setLessons: (state, newState: PayloadAction<Lesson[][] | undefined>) => {
			state.lessons = newState.payload;

			if (state.lessons) {
				const currentDate = new Date();

				let foundBlock = false;
				for (let i = 0; i < state.lessons.length; i++) {
					const block = state.lessons[i];
					for (const lesson of block) {
						if ((new Date(lesson.from).getTime()) > currentDate.getTime()) {
							foundBlock = true;
							break;
						}
					}

					if (foundBlock) {
						state.nextBlockIndex = i;
						break;
					}
				}

				if (!foundBlock)
					state.nextBlockIndex = undefined;
			}
		},
		setLoadingLessons: (state, loadingLessons: PayloadAction<boolean>) => {
			state.loading = loadingLessons.payload;
		},
		setLoadingLessonsError: (state, loadingLessonsError: PayloadAction<boolean>) => {
			state.error = loadingLessonsError.payload;
		},
	}
});

export const { getLessons, setLessons, setLoadingLessons, setLoadingLessonsError } = classesSlice.actions;

export default classesSlice;