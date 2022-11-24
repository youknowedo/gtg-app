import 'package:app/utils.dart';
import 'package:flutter/material.dart';

class Exam {
  final DateTime date;

  final String type;
  final String name;
  final String teacher;

  final DateTime registered;

  Exam({
    required this.date,
    required this.type,
    required this.name,
    required this.teacher,
    required this.registered,
  });

  factory Exam.fromJson(Map<String, dynamic> json, DateTime date) {
    return Exam(
        date: date,
        type: json["type"],
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
              child: Wrap(
                  alignment: WrapAlignment.start,
                  direction: Axis.horizontal,
                  children: snapshot.data!.map<Widget>((currentExam) {
                    bool passed = currentExam.date.millisecondsSinceEpoch <
                        DateTime.now().millisecondsSinceEpoch;

                    return Card(
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
                              top: BorderSide(
                                  color: HexColor("ff0000"), width: 3),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(
                                  left: 7,
                                  right: 7,
                                  top: 12,
                                  bottom: 10,
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.only(bottom: 3),
                                      child: Text(
                                        currentExam.name,
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
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList()),
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
