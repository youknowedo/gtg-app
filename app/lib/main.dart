import 'package:app/schedule.dart';
import 'package:flutter/material.dart';

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

  @override
  State<Navigation> createState() => _NavigationState();
}

class _NavigationState extends State<Navigation> {
  int currentPageIndex = 2;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: DropdownButton(items: const [
        DropdownMenuItem(
          child: Text("T1C"),
        )
      ], onChanged: (e) => {})),
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
      body: Container(
        margin: const EdgeInsets.symmetric(horizontal: 10),
        child: <Widget>[
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
          const Schedule()
        ][currentPageIndex],
      ),
    );
  }
}
