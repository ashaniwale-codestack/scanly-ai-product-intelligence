import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ScannerPage extends StatefulWidget {
  const ScannerPage({super.key}); // can stay const if you want

  @override
  _ScannerPageState createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  String barcode = '';
  String productName = '';
  String ingredients = '';

  Future<void> fetchProduct(String code) async {
    final url = Uri.parse('http://127.0.0.1:8000/product/$code');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          productName = data['name'] ?? 'Unknown';
          ingredients = data['ingredients'] ?? 'No ingredient info';
        });
      } else {
        setState(() {
          productName = 'Error fetching product';
          ingredients = '';
        });
      }
    } catch (e) {
      setState(() {
        productName = 'Network error';
        ingredients = '';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ingredient Scanner')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: const InputDecoration(
                labelText: 'Enter Barcode',
                border: OutlineInputBorder(),
              ),
              onSubmitted: (value) {
                barcode = value;
                fetchProduct(barcode);
              },
            ),
            const SizedBox(height: 20),
            Text('Product: $productName', style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 10),
            Text('Ingredients: $ingredients', style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
