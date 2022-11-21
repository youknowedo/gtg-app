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

class Lessons extends State {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return const Text("hi");
  }
}

Future<Lesson> fetchLessons() async {
  final response =
      await http.get(Uri.parse('http://localhost:3000/api/schedule/lessons'));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Lesson.fromJson(jsonDecode(response.body));
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load Lesson');
  }
}
