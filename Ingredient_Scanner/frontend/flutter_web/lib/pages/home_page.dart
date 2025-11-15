import 'package:flutter/material.dart';
import 'scanner_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AI Ingredient Scanner")),
      body: Center(
        child: ElevatedButton(
          child: const Text("Start Scanning"),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ScannerPage()),
            );
          },
        ),
      ),
    );
  }
}
