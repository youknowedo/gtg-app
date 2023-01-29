import { Skola24Object } from "skola24";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLessons } from "./lessonsSlice";

export type ClassesState = {
	classes?: Skola24Object[]
	selectedIndex: number
	loading: boolean
	error: boolean
}

const initialState: ClassesState = {
	classes: [],
	selectedIndex: 0,
	loading: false,
	error: false
};

const classesSlice = createSlice({
	name: "classes",
	initialState,
	reducers: {
		getClasses: (state) => {
			console.log("hi");
			fetch(
				"https://gtg.seabird.digital/api/schedule/classes"
			).then(response => {
				response.json().then(json => {
					state.classes = json.data as Skola24Object[];


					getLessons(state.classes[state.selectedIndex].groupGuid);
				});
			});

		},
		setClasses: (state, newState: PayloadAction<Skola24Object[]>) => {
			state.classes = newState.payload;
		},
		setSelectedClass: (state, selectedClassIndex: PayloadAction<number>) => {
			state.selectedIndex = selectedClassIndex.payload;
		}
	}
});


export const { getClasses, setClasses, setSelectedClass } = classesSlice.actions;

export default classesSlice;