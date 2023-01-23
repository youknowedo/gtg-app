import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    IndexPath,
    Layout,
    Select,
    SelectItem,
    Text,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { ClassesData, Lesson, ScheduleData, Skola24Object } from "skola24";

export const HomeScreen = ({
    navigation,
}: NativeStackScreenProps<any, "Home">) => {
    const [lessons, setLessons] = useState<Lesson[][] | undefined>(undefined);
    const [classes, setClasses] = useState<Skola24Object[] | undefined>(
        undefined
    );
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

    const selectedClass = classes?.[selectedIndex.row];

    const getClasses = async () => {
        const response = await fetch(
            "https://gtg.seabird.digital/api/schedule/classes"
        );

        const data = (await response.json()).data as Skola24Object[];

        setClasses(data);
    };

    const getLessons = async () => {
        const response = await fetch(
            "https://gtg.seabird.digital/api/schedule/lessons?" +
                `selectionGuid=${selectedClass?.groupGuid}` +
                "&week=3" +
                "&day=1"
        );

        const json = await response.json();
        const data = json.data as Lesson[][];
        console.log(data);

        setLessons(data);
    };

    useEffect(() => {
        getClasses();
    }, []);

    return (
        <Layout level="1">
            <Select
                selectedIndex={selectedIndex}
                value={selectedClass?.groupName}
                onSelect={(index) => {
                    setSelectedIndex(index as IndexPath);

                    getLessons();
                }}
            >
                {classes?.map((c) => {
                    return <SelectItem title={c.groupName} />;
                })}
            </Select>

            {lessons?.[0].map((l) => {
                return (
                    <Layout>
                        <Text>{l.name}</Text>
                    </Layout>
                );
            })}
        </Layout>
    );
};
