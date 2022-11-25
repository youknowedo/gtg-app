import 'package:app/pages/schedule.dart';
import 'package:app/widgets/current_next_lesson.dart';
import 'package:flutter/material.dart';

import '../widgets/exams.dart';

class Home extends StatelessWidget {
  final Future<List<Lesson>>? futureLessons;
  final Future<List<Exam>>? futureExams;

  const Home({super.key, this.futureLessons, this.futureExams});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.symmetric(vertical: 20),
        child: Column(
          children: [
            CurrentNextLesson(futureLessons: futureLessons),
            Exams(
              futureExams: futureExams,
            ),
          ],
        ));
  }
}
