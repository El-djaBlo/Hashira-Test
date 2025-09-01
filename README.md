
# Polynomial Coefficient Solver

A robust command-line tool built with Node.js to solve for the coefficients of a polynomial from a given set of points. This project demonstrates the evolution from a basic script to a modular, user-friendly, and error-tolerant application.

-----

## 📂 Repository Structure

This repository is organized into two distinct folders, representing the two major stages of the project's development.

```
.
├── InitialScript/      <-- The original, basic single-file solution
└── OptimisedCode/      <-- The final, improved and modular version
    ├── fraction.js
    ├── solver.js
    ├── test.json
    ├── output.txt
    └── improvement.txt
```

-----

## The Story Behind the Two Folders

The separation into two folders tells the story of our project's journey. We started with a simple goal and progressively added features to make the tool more powerful and reliable.

### 📁 InitialScript

This folder contains the first version of the code. It was a single JavaScript file that successfully solved the problem but had several limitations:

  * The input data was hardcoded directly into the file.
  * It lacked robust error handling.
  * All the logic was in one place, making it less maintainable.

### 📂 OptimisedCode

This folder contains the final, superior version of the tool. After solving the initial problem, we focused on improving the code's quality, usability, and reliability. This version is a complete command-line application with several key enhancements.

-----

## ✨ Key Features of the Optimised Code

The final version of the script includes several significant improvements that were not part of the original solution:

  * **Dynamic File Input:** The script now reads JSON data from a file path provided as a command-line argument, making it a flexible and reusable tool.
  * **Robust Error Handling:** It gracefully handles common errors like a missing file or invalid JSON, providing clear, user-friendly messages instead of crashing.
  * **Solution Validation:** It automatically uses any extra data points provided in the input file to verify the correctness of the calculated polynomial coefficients.
  * **Modular Code Structure:** The logic is cleanly separated into two files: `solver.js` for the main application logic and `fraction.js` for the high-precision mathematical calculations.

-----

## 🚀 How to Run the Optimised Code

To use the final version of the tool, follow these steps.

1.  **Navigate to the Folder:**
    Open your terminal and navigate into the `OptimisedCode` directory.

    ```sh
    cd OptimisedCode
    ```

2.  **Run the Solver:**
    Execute the script using Node.js, passing the path to your input file as an argument. The file `test.json` is included as a sample.

    ```sh
    node solver.js test.json
    ```

3.  **Saving the Output:**
    To save the results to the `output.txt` file, you can redirect the output like this:

    ```sh
    node solver.js test.json > output.txt
    ```

-----

## 📄 File Descriptions

  * **solver.js**: The main application file. It handles file input, runs the main logic, and prints the final output.
  * **fraction.js**: A specialized module that handles high-precision fraction arithmetic with `BigInt`, preventing rounding errors with large numbers.
  * **test.json**: A sample JSON input file used for testing the script.
  * **output.txt**: A file where you can save the output from the solver.
  * **improvement.txt**: A text file likely containing notes on the enhancements made to the code.
