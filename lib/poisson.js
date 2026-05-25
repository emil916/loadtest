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
   * @param {number} burstiness - CV target (>=1). 1 = standard exponential
   */
  constructor(seed = 'default-seed', burstiness = 1) {
    this.rng = seedrandom(seed);
    this.burstiness = burstiness;
  }

  /**
   * Set the seed for this instance's random number generation
   * @param {string} seed - Seed value
   */
  setSeed(seed) {
    this.rng = seedrandom(seed);
  }

  /**
   * Set burstiness (CV target)
   * @param {number} burstiness - Must be >= 1
   */
  setBurstiness(burstiness) {
    this.burstiness = burstiness;
  }

  /**
   * Generate a Poisson-distributed random interval (in milliseconds).
   * Uses a 2-phase hyperexponential mixture to allow CV > 1.
   * @param {number} lambda - Average requests per second
   * @param {number} burstiness - Optional CV target (>=1)
   * @returns {number} Interval in milliseconds
   */
  getPoissonInterval(lambda, burstiness = this.burstiness) {
    if (lambda <= 0) {
      throw new Error('Lambda must be greater than 0');
    }
    if (burstiness < 1) {
      throw new Error('Burstiness must be >= 1');
    }

    // Convert requests per second to requests per millisecond
    const lambdaMs = lambda / 1000;

    // Hyperexponential: choose p from desired CV
    // p(1-p) = 1 / (2*(CV^2 + 1))
    const cv2 = burstiness * burstiness;
    const root = Math.sqrt((cv2 - 1) / (cv2 + 1));
    const p = (1 + root) / 2;

    // Rates chosen to preserve mean: lambda1 = 2p*lambda, lambda2 = 2(1-p)*lambda
    const rate1 = 2 * p * lambdaMs;
    const rate2 = 2 * (1 - p) * lambdaMs;

    // Choose which exponential to sample
    const coinflip = this.rng();
    const rate = (coinflip < p) ? rate1 : rate2;

    const U = this.rng();
    return Math.log(1 - U) / -rate;
  }
}

exports.PoissonGenerator = PoissonGenerator;
