import 'package:flutter/material.dart';

import '../utils.dart';

class Exam {
  final DateTime date;

  final String? type;
  final String? typeColor;
  final String? name;
  final String? teacher;

  final DateTime registered;

  Exam({
    required this.date,
    required this.type,
    required this.typeColor,
    required this.name,
    required this.teacher,
    required this.registered,
  });

  factory Exam.fromJson(Map<String, dynamic> json, DateTime date) {
    return Exam(
        date: date,
        type: json["type"],
        typeColor: json["typeColor"],
        name: json["name"],
        teacher: json["teacher"],
        registered: DateTime.parse(json["registered"]));
  }
}

class Exams extends StatelessWidget {
  final Future<List<Exam>>? futureExams;

  const Exams({super.key, this.futureExams});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Exam>>(
      future: futureExams,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Container(
            margin: const EdgeInsets.symmetric(vertical: 20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Händelser"),
                    ...snapshot.data!.map<Widget>((currentExam) {
                      double screenWidth = MediaQuery.of(context).size.width;

                      bool passed = currentExam.date.millisecondsSinceEpoch <
                          DateTime.now().millisecondsSinceEpoch;

                      Color color;
                      switch (currentExam.typeColor) {
                        case "blue":
                          color = Colors.blue;
                          break;
                        case "green":
                          color = Colors.green;
                          break;
                        default:
                          color = Colors.red;
                      }

                      return SizedBox(
                        width: screenWidth,
                        child: Card(
                          semanticContainer: true,
                          clipBehavior: Clip.antiAliasWithSaveLayer,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5),
                          ),
                          margin: const EdgeInsets.all(5),
                          child: Opacity(
                            opacity: passed ? .5 : 1,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 10),
                              decoration: BoxDecoration(
                                border: Border(
                                  top: BorderSide(color: color, width: 3),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: currentExam.type != null || passed
                                        ? const EdgeInsets.fromLTRB(6, 4, 6, 3)
                                        : null,
                                    decoration: const BoxDecoration(
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(2)),
                                        color: Colors.black26),
                                    child: Text(currentExam.type ?? ""),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.only(
                                      left: 7,
                                      right: 7,
                                      top: currentExam.type != null ? 14 : 8,
                                      bottom: 10,
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 3),
                                          child: Text(
                                            currentExam.name ?? "",
                                            style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14),
                                          ),
                                        ),
                                        Text(currentExam.teacher != ""
                                            ? "${currentExam.teacher}; "
                                            : ""),
                                      ],
                                    ),
                                  ),
                                  Align(
                                      alignment: Alignment.centerRight,
                                      child: Container(
                                          padding: const EdgeInsets.fromLTRB(
                                              6, 4, 6, 4),
                                          decoration: const BoxDecoration(
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(2)),
                                              color: Colors.black26),
                                          child: Text(Weekday[
                                              currentExam.date.weekday - 1]))),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList()
                  ]),
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
