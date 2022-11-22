import 'dart:convert';

import 'package:app/utils.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

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

  const Lesson(
      {required this.id,
      required this.name,
      required this.teacher,
      required this.room,
      required this.dayOfWeek,
      required this.from,
      required this.to,
      this.colors});

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json["id"],
      colors: LColors.fromJson(json["colors"]),
      name: json["name"],
      teacher: json["teacher"],
      room: json["room"],
      dayOfWeek: json["dayOfWeek"],
      from: DateTime.parse(json["from"]),
      to: DateTime.parse(json["to"]),
    );
  }
}

class Schedule extends StatefulWidget {
  const Schedule({super.key});

  @override
  State<Schedule> createState() => Lessons();
}

class Lessons extends State<Schedule> {
  late Future<List<Lesson>> futureLessons;

  @override
  void initState() {
    super.initState();
    futureLessons = fetchLessons();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Lesson>>(
      future: futureLessons,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return RefreshIndicator(
            onRefresh: _pullRefresh,
            child: SingleChildScrollView(
              child: Container(
                margin: const EdgeInsets.symmetric(vertical: 20),
                child: Wrap(
                    alignment: WrapAlignment.start,
                    direction: Axis.horizontal,
                    children: snapshot.data!.map<Widget>((currentLesson) {
                      double screenWidth = MediaQuery.of(context).size.width;

                      return SizedBox(
                        width: screenWidth,
                        child: Card(
                          semanticContainer: true,
                          clipBehavior: Clip.antiAliasWithSaveLayer,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5),
                          ),
                          margin: const EdgeInsets.symmetric(
                              vertical: 5, horizontal: 5),
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
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(2)),
                                      color: Colors.black26),
                                  child: Text(
                                      "${currentLesson.from.hour}:${currentLesson.from.minute}"),
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
                                              fontSize: 16),
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
                                      padding:
                                          const EdgeInsets.fromLTRB(6, 4, 6, 3),
                                      decoration: const BoxDecoration(
                                          borderRadius: BorderRadius.all(
                                              Radius.circular(2)),
                                          color: Colors.black26),
                                      child: Text(
                                          "${currentLesson.to.hour}:${currentLesson.to.minute}"),
                                    )),
                              ],
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

  Future<void> _pullRefresh() async {
    Future<List<Lesson>> freshLessons = fetchLessons();
    setState(() {
      futureLessons = Future.value(freshLessons);
    });
  }
}

class DateFormat {}

Future<List<Lesson>> fetchLessons() async {
  final response =
      await http.get(Uri.https('gtg.seabird.digital', "/api/schedule/lessons", {
    "selectionGuid": "MTJhNTBiNjktNjhhZS1mMTNhLWEzYjEtNGM2NGZhZmE1ZDhi",
    "week": "42",
    "day": "1",
    "parsed": "true"
  }));

  if (response.statusCode == 200) {
    var data = jsonDecode(response.body)["data"];

    List<Lesson> lessons = [];
    for (var i = 0; i < data.length; i++) {
      lessons.add(Lesson.fromJson(data[i]));
    }

    return lessons;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load Lesson');
  }
}
