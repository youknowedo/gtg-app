import 'package:flutter/material.dart';

import '../widgets/exams.dart';

class Home extends StatelessWidget {
  final Future<List<Exam>>? futureExams;

  const Home({super.key, this.futureExams});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.symmetric(vertical: 20),
        child: Exams(
          futureExams: futureExams,
        ));
  }
}
