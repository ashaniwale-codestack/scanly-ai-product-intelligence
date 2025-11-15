import 'package:flutter/material.dart';
import 'pages/scanner_page.dart'; // make sure path is correct

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ingredient Scanner',
      theme: ThemeData(primarySwatch: Colors.blue),
      debugShowCheckedModeBanner: false,
      home: ScannerPage(), // Removed const here
    );
  }
}
