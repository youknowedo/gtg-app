import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    IndexPath,
    Layout,
    Select,
    SelectItem,
    Spinner,
    Text,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { ClassesData, Lesson, ScheduleData, Skola24Object } from "skola24";

export const HomeScreen = ({
    navigation,
}: NativeStackScreenProps<any, "Home">) => {
    const [nextLesson, setNextLesson] = useState<Lesson[] | undefined>(
        undefined
    );
    const [classes, setClasses] = useState<Skola24Object[] | undefined>(
        undefined
    );
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

    let selectedClass = classes?.[selectedIndex.row];

    const getClasses = async () => {
        const response = await fetch(
            "https://gtg.seabird.digital/api/schedule/classes"
        );

        const data = (await response.json()).data as Skola24Object[];

        setClasses(data);

        getLessons();
    };

    const getLessons = async (index?: IndexPath) => {
        setNextLesson(undefined);

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        var days = Math.floor(
            (currentDate.valueOf() - startDate.valueOf()) /
                (24 * 60 * 60 * 1000)
        );

        var weekNumber = Math.ceil(days / 7);

        const response = await fetch(
            "https://gtg.seabird.digital/api/schedule/lessons?" +
                `selectionGuid=${
                    classes?.[index ? index.row : selectedIndex.row].groupGuid
                }` +
                `&week=${weekNumber}` +
                `&day=${days % 7}` +
                `&year=2023`
        );

        const json = await response.json();
        const data = json.data as Lesson[][];

        for (const block of data) {
            let notIt = false;
            for (const lesson of block) {
                if (lesson.to.valueOf() < currentDate.valueOf()) {
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
        getClasses();
    }, []);

    return (
        <Layout style={{ padding: 16 }} level="1">
            <Select
                selectedIndex={selectedIndex}
                value={selectedClass?.groupName}
                onSelect={(index) => {
                    setSelectedIndex(index as IndexPath);

                    getLessons(index as IndexPath);
                }}
            >
                {classes?.map((c) => {
                    return <SelectItem title={c.groupName} />;
                })}
            </Select>
            <Layout>
                <Text>Nästa lektion</Text>
                <Layout>
                    {nextLesson?.map((l) => {
                        return <Text>{l.name}</Text>;
                    })}
                </Layout>
            </Layout>
        </Layout>
    );
};
