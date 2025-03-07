/**
 * Calculate rewards for a staking position
 * @param {number} stakedAmount - Amount of LP tokens staked
 * @param {string} lastHarvestTime - Last harvest time (ISO string)
 * @param {number} rewardRate - Reward rate (tokens per day per LP token)
 * @returns {number} - Pending rewards
 */
exports.calculateRewards = (stakedAmount, lastHarvestTime, rewardRate) => {
  // Convert last harvest time to milliseconds
  const lastHarvestMs = new Date(lastHarvestTime).getTime();
  const currentMs = Date.now();
  
  // Calculate time difference in days
  const daysDiff = (currentMs - lastHarvestMs) / (1000 * 60 * 60 * 24);
  
  // Calculate rewards
  const rewards = stakedAmount * rewardRate * daysDiff;
  
  return Math.max(0, rewards);
};

/**
 * Calculate APR for a farming pool
 * @param {number} rewardRate - Reward rate (tokens per day per LP token)
 * @param {number} rewardTokenPrice - Price of the reward token
 * @param {number} lpTokenValue - Value of one LP token
 * @returns {number} - APR (Annual Percentage Rate)
 */
exports.calculateAPR = (rewardRate, rewardTokenPrice, lpTokenValue) => {
  // Daily rewards value per LP token
  const dailyRewardValue = rewardRate * rewardTokenPrice;
  
  // Annual rewards value per LP token
  const annualRewardValue = dailyRewardValue * 365;
  
  // APR = (Annual rewards value / LP token value) * 100
  const apr = (annualRewardValue / lpTokenValue) * 100;
  
  return apr;
};

/**
 * Calculate optimal reward rate for a target APR
 * @param {number} targetAPR - Target APR (Annual Percentage Rate)
 * @param {number} rewardTokenPrice - Price of the reward token
 * @param {number} lpTokenValue - Value of one LP token
 * @returns {number} - Reward rate (tokens per day per LP token)
 */
exports.calculateRewardRate = (targetAPR, rewardTokenPrice, lpTokenValue) => {
  // APR = (Annual rewards value / LP token value) * 100
  // Annual rewards value = (targetAPR / 100) * lpTokenValue
  const annualRewardValue = (targetAPR / 100) * lpTokenValue;
  
  // Daily rewards value = Annual rewards value / 365
  const dailyRewardValue = annualRewardValue / 365;
  
  // Reward rate = Daily rewards value / reward token price
  const rewardRate = dailyRewardValue / rewardTokenPrice;
  
  return rewardRate;
}; 