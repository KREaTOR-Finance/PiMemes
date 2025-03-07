/**
 * @typedef {Object} TokenSocials
 * @property {string} [website]
 * @property {string} [twitter]
 * @property {string} [telegram]
 * @property {string} [discord]
 * @property {string} [github]
 * @property {string} [medium]
 */

/**
 * @typedef {Object} TokenContact
 * @property {string} [email]
 * @property {string} [team]
 * @property {string} [location]
 */

/**
 * @typedef {Object} TokenMetadata
 * @property {string} name
 * @property {string} symbol
 * @property {number} decimals
 * @property {string} totalSupply
 * @property {string} description
 * @property {string} logoImage - Main token logo
 * @property {string} [bannerImage] - Optional banner for token page
 * @property {string} network - e.g. "Pi Network"
 * @property {string} contractAddress
 * @property {TokenSocials} socials
 * @property {TokenContact} contact
 * @property {string} [whitepaper]
 * @property {string} [roadmap]
 * @property {string[]} [tags] - e.g. ["meme", "defi", "gaming"]
 * @property {string} launchDate
 * @property {boolean} verified
 * @property {string} [initialPrice]
 * @property {boolean} [liquidityLocked]
 * @property {number} [liquidityLockPeriod] - in days
 */

/**
 * @typedef {Object} TokenFormData
 * @property {string} name
 * @property {string} symbol
 * @property {number} decimals
 * @property {string} totalSupply
 * @property {string} description
 * @property {string} logoImage
 * @property {string} [bannerImage]
 * @property {string} network
 * @property {string} contractAddress
 * @property {TokenSocials} socials
 * @property {TokenContact} contact
 * @property {string} [whitepaper]
 * @property {string} [roadmap]
 * @property {string[]} [tags]
 * @property {string} launchDate
 * @property {string} [initialPrice]
 * @property {boolean} [liquidityLocked]
 * @property {number} [liquidityLockPeriod]
 * @property {File} [logoImageFile]
 * @property {File} [bannerImageFile]
 */

// Export empty object to make this a module
export {}; 