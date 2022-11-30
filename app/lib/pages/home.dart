import 'package:app/pages/schedule.dart';
import 'package:app/widgets/current_next_lesson.dart';
import 'package:app/widgets/menu.dart';
import 'package:flutter/material.dart';

import '../widgets/exams.dart';

class Home extends StatelessWidget {
  final Future<List<Lesson>>? futureLessons;
  final Future<List<Exam>>? futureExams;
  final Future<List<Dish>>? futureDishes;
  final String restaurantId;

  const Home(
      {super.key,
      this.futureLessons,
      this.futureExams,
      required this.restaurantId,
      this.futureDishes});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.symmetric(vertical: 20),
        child: SingleChildScrollView(
          child: Column(
            children: [
              CurrentNextLesson(futureLessons: futureLessons),
              Exams(
                futureExams: futureExams,
              ),
              Menu(
                restaurantId: restaurantId,
                futureDishes: futureDishes,
              )
            ],
          ),
        ));
  }
}
