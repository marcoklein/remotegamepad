
/**
 * 2D math vector as helper.
 * 
 https://github.com/matthiasferch/tsm/blob/master/src/vec2.ts
 * 
 * @author Marco Klein
 */
export class Vector {

    /**
     * X-coordinate.
     */
    x: number;
    /**
     * Y-coordinate.
     */
    y: number;

    /**
     * Instantiate new Vector.
     * If no values are given, zero is used for both coordinates.
     * 
     * If only one value is given, then both coordinates are set to the same value.
     * 
     * @param x X-value.
     * @param y Y-value.
     */
    constructor(x?: number, y?: number) {
        if (x === undefined || x === null) {
            this.set(0);
        } else {
            this.set(x, y);
        }
    }

    /**
     * Set x and y coordinates.
     * Providing a single value, applies it to both coordinates.
     * 
     * @param x X-coordinate to set.
     * @param y Y-coordinate to set.
     * @returns This vector.
     */
    set(x: number, y?: number): Vector {
        if (y === undefined || y === null) {
            // set both coordinates to same value
            this.x = x;
            this.y = x;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    /**
     * Set coordinates to zero.
     * 
     * @returns This vector.
     */
    reset(): Vector {
        return this.set(0);
    }

    /**
     * Clones this vector. If no destination vector is given, a new one is created.
     * 
     * @param dest Optional destination vector.
     * @returns Destination vector. New one is created if non is given.
     */
    copy(dest?: Vector): Vector {
        if (!dest) {
            // return new vector instance with same coordinates
            return new Vector(this.x , this.y);
        } else {
            // set coordinates of destination vector and return
            return dest.set(this.x, this.y);
        }
    }

    /**
     * Negates this vector and stores it in the destination vector if one is provided.
     * Otherwise, changes apply to this vector directly.
     * 
     * @param dest Optional destination vector.
     */
    negate(dest?: Vector): Vector {
        if (!dest) {
            // apply changes to this vector
            return this.set(-this.x, -this.y);
        } else {
            return dest.set(-this.x, -this.y);
        }
    }

    /**
     * Checks the numerical equality of two vectors.
     * A certain threshold can be set to compare coordinates.
     * 
     * @param other Other vector.
     * @param threshold Threshold to eliminate rounding errors.
     * @returns True, if vectors are equal.
     */
    equals(other: Vector, threshold: number = 0.00001): boolean {
        if (Math.abs(this.x - other.x) > threshold) {
            return false;
        }
        if (Math.abs(this.y - other.y) > threshold) {
            return false;
        }
        return true;
    }

    /**
     * Returns length of the vector.
     * 
     * @returns Vector length.
     */
    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Returns length of the vector squared.
     * Useful to prevent computation of the square root, used in length().
     * 
     * @returns Vector length squared.
     */
    lengthSquared(): number {
        return (this.x * this.x + this.y * this.y);
    }

    /**
     * Adds other vector to this vector.
     * 
     * @param other Vector to add.
     * @returns This vector.
     */
    add(other: Vector): Vector {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Subtracts given coordinates from this vector.
     * 
     * @param x X-value to subtract.
     * @param y Y-value to subtract.
     * @returns This vector.
     */
    sub(x: number, y: number): Vector;
    /**
     * Subtracts other vector from this vector.
     * 
     * @param other Vector to subtract.
     * @returns This vector.
     */
    sub(other: Vector): Vector;
    /**
     * Subtract overload implementation.
     */
    sub(other: Vector & number, optionalY?: number): Vector {
        if (optionalY === undefined) {
            // subtract other vector
            this.x -= other.x;
            this.y -= other.y;
        } else {
            this.x -= other;
            this.y -= optionalY;
        }
        return this;
    }

    /**
     * Scales this vector with given scalar.
     * 
     * @param scalar Scale multiplicator.
     * @returns This vector. 
     */
    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Return this vector normalized.
     * 
     * @returns This vector.
     */
    normalize(): Vector {
        let length = this.length();
        if (length === 1 || length === 0) {
            // already normalized
            return this;
        }

        length = 1.0 / length;

        this.x *= length;
        this.y *= length;

        return this;
    }

}