'use strict';

/**
 * Poisson distribution utilities for load testing.
 */

/**
 * Generate a Poisson-distributed random interval (in milliseconds).
 * Uses the inverse transform method.
 * @param {number} lambda - Average requests per second
 * @returns {number} Interval in milliseconds
 */
function getPoissonInterval(lambda) {
    if (lambda <= 0) {
        throw new Error('Lambda must be greater than 0');
    }
    // Convert requests per second to requests per millisecond
    const lambdaMs = lambda / 1000;
    // Inverse transform: -ln(U) / lambda, where U is uniform random [0,1)
    const u = Math.random();
    return Math.log(1 - u) / -lambdaMs;
}

/**
 * Create a Poisson interval generator.
 * @param {number} requestsPerSecond - Target requests per second
 * @returns {Function} Function that returns next interval in milliseconds
 */
function createPoissonGenerator(requestsPerSecond) {
    return () => getPoissonInterval(requestsPerSecond);
}

exports.getPoissonInterval = getPoissonInterval;
exports.createPoissonGenerator = createPoissonGenerator;