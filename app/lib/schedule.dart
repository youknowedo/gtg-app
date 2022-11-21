import 'dart:convert';

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
  final String from;
  final String to;

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
      from: json["from"],
      to: json["to"],
    );
  }
}

class LessonsPage extends StatefulWidget {
  const LessonsPage({super.key});

  @override
  State<LessonsPage> createState() => Lessons();
}

class Lessons extends State<LessonsPage> {
  late Future<List<Lesson>> futureLessons;

  @override
  void initState() {
    super.initState();
    futureLessons = fetchLessons();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("hi"),
        ),
        body: const Text("hi"));
  }
}

Future<List<Lesson>> fetchLessons() async {
  final response =
      await http.get(Uri.https('gtg.seabird.digital', "/api/schedule/lessons", {
    "selectionGuid": "MTJhNTBiNjktNjhhZS1mMTNhLWEzYjEtNGM2NGZhZmE1ZDhi",
    "week": "42"
  }));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    List<Lesson> lessons = [];
    for (var i = 0; i < jsonDecode(response.body).length; i++) {
      lessons.add(Lesson.fromJson(jsonDecode(response.body)));
    }

    return lessons;
  } else {
    var thing = response.body;
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load Lesson');
  }
}
