// A helper class to perform exact fraction arithmetic using BigInt.
// This is necessary to handle large numbers without losing precision.
class Fraction {
    constructor(numerator, denominator = 1n) {
        if (denominator === 0n) {
            throw new Error("Denominator cannot be zero.");
        }
        // Simplify the fraction by dividing by the greatest common divisor (GCD)
        const commonDivisor = this.gcd(numerator, denominator);
        this.num = BigInt(numerator) / commonDivisor;
        this.den = BigInt(denominator) / commonDivisor;

        // Standardize the fraction so the sign is always on the numerator
        if (this.den < 0n) {
            this.num = -this.num;
            this.den = -this.den;
        }
    }

    // Greatest Common Divisor (GCD) using the Euclidean algorithm for BigInts
    gcd(a, b) {
        return b === 0n ? a : this.gcd(b, a % b);
    }

    // --- Fraction Arithmetic Methods ---
    add(other) {
        const newNum = this.num * other.den + other.num * this.den;
        const newDen = this.den * other.den;
        return new Fraction(newNum, newDen);
    }

    subtract(other) {
        const newNum = this.num * other.den - other.num * this.den;
        const newDen = this.den * other.den;
        return new Fraction(newNum, newDen);
    }

    multiply(other) {
        return new Fraction(this.num * other.num, this.den * other.den);
    }

    divide(other) {
        if (other.num === 0n) {
            throw new Error("Cannot divide by a zero fraction.");
        }
        return new Fraction(this.num * other.den, this.den * other.num);
    }

    // Converts the fraction to a string for clean printing
    toString() {
        if (this.den === 1n) {
            return this.num.toString();
        }
        return `${this.num}/${this.den}`;
    }
}

// Export the class to make it available to other files
module.exports = Fraction;