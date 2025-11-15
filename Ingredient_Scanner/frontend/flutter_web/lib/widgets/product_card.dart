import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;
  ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(product['name'] ?? 'Unknown'),
        subtitle: Text('Ingredients: ${(product['ingredients'] ?? []).join(', ')}'),
      ),
    );
  }
}
