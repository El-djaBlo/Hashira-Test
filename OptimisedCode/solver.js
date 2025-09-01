// NEW: Import the Node.js File System module and our local Fraction class
const fs = require('fs');
const Fraction = require('./fraction.js');

/**
 * Solves for the coefficients of a polynomial.
 * @param {string} jsonInput - The JSON string containing the problem data.
 */
function solvePolynomial(jsonInput) {
    // Helper to convert a string value from any base to a BigInt
    function stringToBigInt(value, base) {
        let result = 0n;
        const bigBase = BigInt(base);
        for (let i = 0; i < value.length; i++) {
            const digit = parseInt(value[i], base);
            result = result * bigBase + BigInt(digit);
        }
        return result;
    }

    const data = JSON.parse(jsonInput);
    const k = data.keys.k;
    const degree = k - 1;

    let points = [];
    for (const key in data) {
        if (key === "keys") continue;
        points.push({
            x: BigInt(key),
            y: stringToBigInt(data[key].value, parseInt(data[key].base, 10))
        });
    }

    points.sort((a, b) => (a.x < b.x ? -1 : 1));
    const solvingPoints = points.slice(0, k);

    let matrix = Array(k).fill(0).map(() => Array(k + 1).fill(new Fraction(0n)));
    for (let i = 0; i < k; i++) {
        const p = solvingPoints[i];
        for (let j = 0; j < k; j++) {
            matrix[i][j] = new Fraction(p.x ** BigInt(degree - j));
        }
        matrix[i][k] = new Fraction(p.y);
    }

    // --- Gaussian elimination with progress updates ---
    for (let i = 0; i < k; i++) {
        console.log(`Processing matrix row ${i + 1} of ${k}...`);
        let max = i;
        for (let j = i + 1; j < k; j++) {
            if (Math.abs(Number(matrix[j][i].num)) > Math.abs(Number(matrix[max][i].num))) {
                max = j;
            }
        }
        [matrix[i], matrix[max]] = [matrix[max], matrix[i]];

        for (let j = i + 1; j < k; j++) {
            const factor = matrix[j][i].divide(matrix[i][i]);
            for (let l = i; l < k + 1; l++) {
                matrix[j][l] = matrix[j][l].subtract(factor.multiply(matrix[i][l]));
            }
        }
    }

    // --- Back substitution ---
    const coefficients = Array(k).fill(new Fraction(0n));
    for (let i = k - 1; i >= 0; i--) {
        let sum = new Fraction(0n);
        for (let j = i + 1; j < k; j++) {
            sum = sum.add(matrix[i][j].multiply(coefficients[j]));
        }
        coefficients[i] = (matrix[i][k].subtract(sum)).divide(matrix[i][i]);
    }
    
    // NEW: Section for validating the solution with unused points
    console.log("\n🔍 Validating solution with remaining points...");
    function evaluatePolynomial(x, coeffs) {
        let result = new Fraction(0n);
        const polyDegree = coeffs.length - 1;
        for (let i = 0; i < coeffs.length; i++) {
            const term = coeffs[i].multiply(new Fraction(x ** BigInt(polyDegree - i)));
            result = result.add(term);
        }
        return result;
    }
    const unusedPoints = points.slice(k);
    if (unusedPoints.length > 0) {
        let allValid = true;
        for (const point of unusedPoints) {
            const calculatedY = evaluatePolynomial(point.x, coefficients);
            if (calculatedY.num === point.y && calculatedY.den === 1n) {
                console.log(`  - Point (${point.x}, ...): OK`);
            } else {
                console.error(`  - Point (${point.x}, ...): FAILED!`);
                allValid = false;
            }
        }
        if (allValid) console.log("✨ Validation successful!");
    } else {
        console.log("  - No extra points to validate with.");
    }

    // --- Final results printing ---
    console.log(`\n✅ Solution Found`);
    console.log(`---------------------`);
    console.log(`Polynomial Degree: ${degree}`);
    console.log(`Coefficients (c${degree} ... c0):`);
    coefficients.forEach((coeff, index) => {
        console.log(`  c${degree - index}: ${coeff.toString()}`);
    });
}


// --- NEW: Main Execution Block ---
// This handles command-line arguments and file reading.
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("❌ Error: Please provide the path to your JSON input file.");
        console.log("Usage: node solve.js <path-to-file.json>");
        process.exit(1);
    }
    const filePath = args[0];

    try {
        console.log(`Reading input from: ${filePath}\n`);
        const jsonInput = fs.readFileSync(filePath, 'utf8');
        solvePolynomial(jsonInput);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`❌ Error: File not found at '${filePath}'`);
        } else if (error instanceof SyntaxError) {
            console.error(`❌ Error: The file '${filePath}' contains invalid JSON.`);
        } else {
            console.error(`❌ An unexpected error occurred: ${error.message}`);
        }
        process.exit(1);
    }
}

main();