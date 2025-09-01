const Fraction = require('./fraction.js');

/**
 * Solves for the coefficients of a polynomial.
 * @param {string} jsonInput - The JSON string containing the problem data.
 */
function solvePolynomial(jsonInput) {
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

    const coefficients = Array(k).fill(new Fraction(0n));
    for (let i = k - 1; i >= 0; i--) {
        let sum = new Fraction(0n);
        for (let j = i + 1; j < k; j++) {
            sum = sum.add(matrix[i][j].multiply(coefficients[j]));
        }
        coefficients[i] = (matrix[i][k].subtract(sum)).divide(matrix[i][i]);
    }
    
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

    console.log(`\n✅ Solution Found`);
    console.log(`---------------------`);
    console.log(`Polynomial Degree: ${degree}`);
    console.log(`Coefficients (c${degree} ... c0):`);
    coefficients.forEach((coeff, index) => {
        console.log(`  c${degree - index}: ${coeff.toString()}`);
    });
}

// --- NEW: Main Execution Block for Showcase ---

const testCase1 = `{
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
}`;

const testCase2 = `{
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
}`;

console.log("--- Solving Test Case 1 ---");
solvePolynomial(testCase1);

console.log("\n=============================\n");

console.log("--- Solving Test Case 2 ---");
solvePolynomial(testCase2);