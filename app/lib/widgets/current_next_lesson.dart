import 'package:app/pages/schedule.dart';
import 'package:app/utils.dart';
import 'package:flutter/material.dart';

class CurrentNextLesson extends StatefulWidget {
  final Future<List<Lesson>>? futureLessons;

  const CurrentNextLesson({super.key, this.futureLessons});

  @override
  State<CurrentNextLesson> createState() => _CurrentNextLessonState();
}

class _CurrentNextLessonState extends State<CurrentNextLesson> {
  Future<Lesson>? futureCurrentNextLesson;

  @override
  void initState() {
    super.initState();

    () async {
      var futureLessons = await widget.futureLessons;
      if (futureLessons != null) {
        for (var lesson in futureLessons) {
          if (lesson.to.millisecondsSinceEpoch - 1800000 >
              DateTime.now().millisecondsSinceEpoch) {
            setState(() {
              futureCurrentNextLesson = Future.value(lesson);
            });
            break;
          }
        }
      }

      if (futureCurrentNextLesson == null) throw ErrorDescription("message");
    }();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: FutureBuilder<Lesson>(
        future: futureCurrentNextLesson,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(snapshot.data!.from.millisecondsSinceEpoch >
                          DateTime.now().millisecondsSinceEpoch
                      ? "Nästa lektion:"
                      : "Nuvarande lektion:"),
                  SizedBox(
                    width: screenWidth,
                    child: Card(
                      semanticContainer: true,
                      clipBehavior: Clip.antiAliasWithSaveLayer,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                      margin: EdgeInsets.only(
                          left: 5,
                          right: 5,
                          bottom: 5,
                          top: snapshot.data!.topMargin),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 10),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(
                                color: HexColor(
                                    snapshot.data!.colors?.background ?? "fff"),
                                width: 3),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Container(
                              padding: const EdgeInsets.fromLTRB(6, 4, 6, 3),
                              decoration: const BoxDecoration(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(2)),
                                  color: Colors.black26),
                              child: Text(
                                  "${snapshot.data!.from.toLocal().hour}:${snapshot.data!.from.toLocal().minute.toString().padLeft(2, "0")}"),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(
                                left: 7,
                                right: 7,
                                top: 14,
                                bottom: 10,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(bottom: 3),
                                    child: Text(
                                      snapshot.data!.name,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14),
                                    ),
                                  ),
                                  Text(
                                      "${snapshot.data!.teacher != "" ? "${snapshot.data!.teacher}; " : ""}${snapshot.data!.room}"),
                                ],
                              ),
                            ),
                            Align(
                                alignment: Alignment.centerRight,
                                child: Container(
                                  padding:
                                      const EdgeInsets.fromLTRB(6, 4, 6, 3),
                                  decoration: const BoxDecoration(
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(2)),
                                      color: Colors.black26),
                                  child: Text(
                                      "${snapshot.data!.to.toLocal().hour}:${snapshot.data!.to.toLocal().minute.toString().padLeft(2, "0")}"),
                                )),
                          ],
                        ),
                      ),
                    ),
                  )
                ]);
          } else if (snapshot.hasError) {
            return Text('${snapshot.error}');
          }

          // By default, show a loading spinner.
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
