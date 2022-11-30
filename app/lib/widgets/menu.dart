import 'package:flutter/material.dart';

enum Restaurants { traffpunkten, hojden, aran }

class FoodData {
  final String id;
  final DateTime date;
  final List<Dish> dishes;

  FoodData({required this.id, required this.date, required this.dishes});

  factory FoodData.fromJson(Map<String, dynamic> json, String id) {
    List<Dish> dishes = [];
    for (var dish in json["dishes"]) {
      dishes.add(Dish.fromJson(dish));
    }

    return FoodData(id: id, date: DateTime.parse(json["date"]), dishes: dishes);
  }
}

class Dish {
  final String? type;
  final String? name;

  final int? price;
  final String? allergies;

  Dish({
    this.type,
    required this.name,
    required this.price,
    required this.allergies,
  });

  factory Dish.fromJson(Map<String, dynamic> json) {
    return Dish(
      type: json["type"],
      name: json["name"],
      price: json["price"],
      allergies: json["allergies"],
    );
  }
}

class Menu extends StatelessWidget {
  final Future<List<Dish>>? futureDishes;
  final String restaurantId;

  const Menu({super.key, required this.restaurantId, this.futureDishes});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (restaurantId) {
      case "rh":
        color = Colors.blue;
        break;
      case "ra":
        color = Colors.green;
        break;
      default:
        color = Colors.orange;
    }

    return FutureBuilder<List<Dish>>(
      future: futureDishes,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Container(
            margin: const EdgeInsets.symmetric(vertical: 20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Meny"),
                    ...snapshot.data!.map<Widget>((currentDish) {
                      double screenWidth = MediaQuery.of(context).size.width;

                      return SizedBox(
                        width: screenWidth,
                        child: Card(
                          semanticContainer: true,
                          clipBehavior: Clip.antiAliasWithSaveLayer,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5),
                          ),
                          margin: const EdgeInsets.all(5),
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
                                  padding: currentDish.type != null
                                      ? const EdgeInsets.fromLTRB(6, 4, 6, 3)
                                      : null,
                                  decoration: const BoxDecoration(
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(2)),
                                      color: Colors.black26),
                                  child: Text(currentDish.type ?? ""),
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                    left: 7,
                                    right: 7,
                                    top: currentDish.type != null ? 14 : 8,
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
                                          currentDish.name ?? "",
                                          style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 14),
                                        ),
                                      ),
                                      Text(currentDish.allergies != ""
                                          ? "${currentDish.allergies}; "
                                          : ""),
                                    ],
                                  ),
                                ),
                                currentDish.price != null
                                    ? Align(
                                        alignment: Alignment.centerRight,
                                        child: Container(
                                          padding: const EdgeInsets.fromLTRB(
                                              6, 4, 6, 4),
                                          decoration: const BoxDecoration(
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(2)),
                                              color: Colors.black26),
                                          child:
                                              Text("${currentDish.price} kr"),
                                        ))
                                    : Container()
                              ],
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
