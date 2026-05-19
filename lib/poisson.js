'use strict';

const Log = require("log");
const seedrandom = require('seedrandom');
const log = new Log('info');

/**
 * Poisson distribution utilities for load testing.
 */
class PoissonGenerator {
  /**
   * Create a new Poisson generator instance
   * @param {string} seed - Seed value for reproducibility (optional)
   */
  constructor(seed = 'default-seed') {
    this.rng = seedrandom(seed);
  }

  /**
   * Set the seed for this instance's random number generation
   * @param {string} seed - Seed value
   */
  setSeed(seed) {
    this.rng = seedrandom(seed);
  }

  /**
   * Generate a Poisson-distributed random interval (in milliseconds).
   * Uses the inverse transform method.
   * @param {number} lambda - Average requests per second
   * @returns {number} Interval in milliseconds
   */
  getPoissonInterval(lambda) {
    if (lambda <= 0) {
      throw new Error('Lambda must be greater than 0');
    }
    // Convert requests per second to requests per millisecond
    const lambdaMs = lambda / 1000;
    // Inverse transform: -ln(U) / lambda, where U is uniform random [0,1)
    // const u = Math.random();
    const u = this.rng();
    return Math.log(1 - u) / -lambdaMs;
  }
}

exports.PoissonGenerator = PoissonGenerator;
