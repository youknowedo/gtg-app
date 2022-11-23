import 'package:app/utils.dart';
import 'package:flutter/material.dart';

class LColors {
  final String background;
  final String text;

  const LColors({required this.background, required this.text});

  factory LColors.fromJson(Map<String, dynamic> json) {
    return LColors(background: json["background"], text: json["text"]);
  }
}

class Lesson {
  final String id;
  final LColors? colors;

  final String name;
  final String teacher;
  final String room;

  final int dayOfWeek;
  final DateTime from;
  final DateTime to;

  final int numberInRow;
  final double topMargin;

  Lesson({
    required this.id,
    this.colors,
    required this.name,
    required this.teacher,
    required this.room,
    required this.dayOfWeek,
    required this.from,
    required this.to,
    this.numberInRow = 1,
    required this.topMargin,
  });

  factory Lesson.fromJson(
      Map<String, dynamic> json, int numberInRow, Lesson? previous) {
    var from = DateTime.parse(json["from"]);
    var to = DateTime.parse(json["to"]);

    return Lesson(
        id: json["id"],
        colors: LColors.fromJson(json["colors"]),
        name: json["name"],
        teacher: json["teacher"],
        room: json["room"],
        dayOfWeek: json["dayOfWeek"],
        from: from,
        to: to,
        numberInRow: numberInRow,
        topMargin: previous == null
            ? 5
            : (from == previous.from
                ? previous.topMargin
                : (from.millisecondsSinceEpoch >
                            previous.from.millisecondsSinceEpoch &&
                        from.millisecondsSinceEpoch <
                            previous.to.millisecondsSinceEpoch
                    ? previous.topMargin + 15
                    : 10)));
  }
}

class Schedule extends StatelessWidget {
  final Future<List<Lesson>>? futureLessons;

  const Schedule({super.key, this.futureLessons});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Lesson>>(
      future: futureLessons,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 20),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Wrap(
                    alignment: WrapAlignment.start,
                    direction: Axis.horizontal,
                    children: snapshot.data!.map<Widget>((currentLesson) {
                      double screenWidth = MediaQuery.of(context).size.width;
                      double cardWidth =
                          screenWidth * (1 / currentLesson.numberInRow) -
                              (20 / currentLesson.numberInRow);

                      bool passed = currentLesson.to.millisecondsSinceEpoch <
                          DateTime.now().millisecondsSinceEpoch;

                      return SizedBox(
                        width: cardWidth,
                        child: Card(
                          semanticContainer: true,
                          clipBehavior: Clip.antiAliasWithSaveLayer,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5),
                          ),
                          margin: EdgeInsets.only(
                              left: 5,
                              right: 5,
                              bottom: 5,
                              top: currentLesson.topMargin),
                          child: Opacity(
                            opacity: passed ? .5 : 1,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 10),
                              decoration: BoxDecoration(
                                border: Border(
                                  top: BorderSide(
                                      color: HexColor(
                                          currentLesson.colors?.background ??
                                              "fff"),
                                      width: 3),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Container(
                                    padding:
                                        const EdgeInsets.fromLTRB(6, 4, 6, 3),
                                    decoration: const BoxDecoration(
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(2)),
                                        color: Colors.black26),
                                    child: Text(
                                        "${currentLesson.from.toLocal().hour}:${currentLesson.from.toLocal().minute.toString().padLeft(2, "0")}"),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 7, horizontal: 7),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 3),
                                          child: Text(
                                            currentLesson.name,
                                            style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14),
                                          ),
                                        ),
                                        Text(
                                            "${currentLesson.teacher != "" ? "${currentLesson.teacher}; " : ""}${currentLesson.room}"),
                                      ],
                                    ),
                                  ),
                                  Align(
                                      alignment: Alignment.centerRight,
                                      child: Container(
                                        padding: const EdgeInsets.fromLTRB(
                                            6, 4, 6, 3),
                                        decoration: const BoxDecoration(
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(2)),
                                            color: Colors.black26),
                                        child: Text(
                                            "${currentLesson.to.toLocal().hour}:${currentLesson.to.toLocal().minute.toString().padLeft(2, "0")}"),
                                      )),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList()),
              ),
            ),
          );
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        }

        // By default, show a loading spinner.
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}
