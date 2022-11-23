import 'dart:convert';

import 'package:app/schedule.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;

import 'classes.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Naviation Demo',
      theme: ThemeData(
          colorScheme:
              const ColorScheme.dark().copyWith(secondary: Colors.green)),
      home: const Navigation(),
    );
  }
}

class Navigation extends StatefulWidget {
  const Navigation({super.key});

  static NavigationState? of(BuildContext context, {bool root = false}) => root
      ? context.findRootAncestorStateOfType<NavigationState>()
      : context.findAncestorStateOfType<NavigationState>();

  @override
  State<Navigation> createState() => NavigationState();
}

class NavigationState extends State<Navigation> {
  int currentPageIndex = 2;

  String selectedClass = "MTJhNTBiNjktNjhhZS1mMTNhLWEzYjEtNGM2NGZhZmE1ZDhi";
  late Future<List<Lesson>>? lessons;

  @override
  void initState() {
    super.initState();

    setState(() {
      lessons = fetchLessons();
    });
  }

  @override
  Widget build(BuildContext context) {
    return lessons == null
        ? const CircularProgressIndicator()
        : Scaffold(
            appBar: AppBar(
                title: ClassesDropdown(
              updateSelectedClass: updateSelectedClass,
            )),
            bottomNavigationBar: NavigationBar(
              onDestinationSelected: (int index) {
                setState(() {
                  currentPageIndex = index;
                });
              },
              selectedIndex: currentPageIndex,
              destinations: const <Widget>[
                NavigationDestination(
                  icon: Icon(Icons.explore),
                  label: 'Explore',
                ),
                NavigationDestination(
                  icon: Icon(Icons.commute),
                  label: 'Commute',
                ),
                NavigationDestination(
                  selectedIcon: Icon(Icons.calendar_view_day),
                  icon: Icon(Icons.calendar_view_day_outlined),
                  label: 'Schema',
                ),
              ],
            ),
            body: <Widget>[
              Container(
                color: Colors.red,
                alignment: Alignment.center,
                child: const Text('Page 1'),
              ),
              Container(
                color: Colors.green,
                alignment: Alignment.center,
                child: const Text('Page 2'),
              ),
              Schedule(
                futureLessons: lessons,
                refresh: refreshLessons,
              )
            ][currentPageIndex],
          );
  }

  updateSelectedClass(String id) {
    setState(() {
      lessons = null;
      selectedClass = id;
    });

    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (lessons == null) {
        setState(() {
          lessons = fetchLessons();
        });
      }
    });
  }

  Future<void> refreshLessons() async {
    setState(() {
      lessons = fetchLessons();
    });
  }

  Future<List<Lesson>> fetchLessons() async {
    final response = await http
        .get(Uri.https('gtg.seabird.digital', "/api/schedule/lessons", {
      "selectionGuid": selectedClass,
      "week": "47",
      "day": "3",
      "parsed": "true",
      "group": "true"
    }));

    if (response.statusCode == 200) {
      var data = jsonDecode(response.body)["data"];

      List<Lesson> lessons = [];
      Lesson? previousLesson;
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          var newLesson =
              Lesson.fromJson(data[i][j], data[i].length, previousLesson);
          lessons.add(newLesson);

          previousLesson = newLesson;
        }
      }

      return lessons;
    } else {
      // If the server did not return a 200 OK response,
      // then throw an exception.
      throw Exception('Failed to load Lesson');
    }
  }
}
