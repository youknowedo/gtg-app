import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'main.dart';

class Class {
  final String id;
  final String name;

  const Class({required this.id, required this.name});

  factory Class.fromJson(Map<String, dynamic> json) {
    return Class(
      id: json["groupGuid"],
      name: json["groupName"],
    );
  }
}

class ClassesDropdown extends StatefulWidget {
  final Function(String id)? updateSelectedClass;

  const ClassesDropdown({
    super.key,
    this.updateSelectedClass,
  });

  static of(BuildContext context, {bool root = false}) => root
      ? context.findRootAncestorStateOfType<Classes>()
      : context.findAncestorStateOfType<Classes>();

  @override
  State<ClassesDropdown> createState() => Classes();
}

class Classes extends State<ClassesDropdown> {
  late Future<List<Class>> futureClasses;

  @override
  void initState() {
    super.initState();

    futureClasses = Future.value([]);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      () async {
        var prefs = await SharedPreferences.getInstance();
        var classNames = prefs.getStringList("classNames");
        var classIds = prefs.getStringList("classIds");

        List<Class> classes = [];
        if (classIds != null && classNames != null) {
          for (var i = 0; i < classIds.length; i++) {
            classes.add(Class(id: classIds[i], name: classNames[i]));
          }

          setState(() {
            futureClasses = Future.value(classes);
          });
        }
      }();
      setState(() {
        futureClasses = fetchClasses();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Class>>(
      future: futureClasses,
      builder: (context, snapshot) {
        if (snapshot.hasData || snapshot.data == []) {
          return DropdownButton(
            value: Navigation.of(context)?.selectedClass,
            items: snapshot.data!.map<DropdownMenuItem>((e) {
              return DropdownMenuItem(
                value: e.id,
                child: Text(e.name),
              );
            }).toList(),
            onChanged: (s) => widget.updateSelectedClass!(s),
          );
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        }

        // By default, show a loading spinner.
        return DropdownButton(
          items: const [DropdownMenuItem(child: Text(" "))],
          onChanged: (s) => {},
        );
      },
    );
  }
}

Future<List<Class>> fetchClasses() async {
  final response =
      await http.get(Uri.https('gtg.seabird.digital', "/api/schedule/classes"));

  if (response.statusCode == 200) {
    var data = jsonDecode(response.body)["data"];

    List<Class> classes = [];
    for (var i = 0; i < data.length; i++) {
      classes.add(Class.fromJson(data[i]));
    }

    return classes;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load Class');
  }
}
