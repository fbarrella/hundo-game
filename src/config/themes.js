// Theme scales for the Hundo game
// Each theme represents an interval of 5 cards (1-5, 6-10, 11-15, etc.)
// Total: 20 themes for 100 cards

export const THEMES = [
    {
        interval: 0,
        range: [1, 5],
        scale: "Worst nightmare → Dream come true"
    },
    {
        interval: 1,
        range: [6, 10],
        scale: "Terrible relationship → Soulmates"
    },
    {
        interval: 2,
        range: [11, 15],
        scale: "Disgusting food → Delicious meal"
    },
    {
        interval: 3,
        range: [16, 20],
        scale: "Boring weekend → Best vacation ever"
    },
    {
        interval: 4,
        range: [21, 25],
        scale: "Awkward silence → Perfect conversation"
    },
    {
        interval: 5,
        range: [26, 30],
        scale: "Worst movie ever → Cinematic masterpiece"
    },
    {
        interval: 6,
        range: [31, 35],
        scale: "Freezing cold → Burning hot"
    },
    {
        interval: 7,
        range: [36, 40],
        scale: "Terrible haircut → Perfect hairstyle"
    },
    {
        interval: 8,
        range: [41, 45],
        scale: "Annoying song → Favorite anthem"
    },
    {
        interval: 9,
        range: [46, 50],
        scale: "Worst gift → Most thoughtful present"
    },
    {
        interval: 10,
        range: [51, 55],
        scale: "Embarrassing moment → Proudest achievement"
    },
    {
        interval: 11,
        range: [56, 60],
        scale: "Terrible joke → Hilarious comedy"
    },
    {
        interval: 12,
        range: [61, 65],
        scale: "Worst day → Best day of your life"
    },
    {
        interval: 13,
        range: [66, 70],
        scale: "Boring book → Page-turner masterpiece"
    },
    {
        interval: 14,
        range: [71, 75],
        scale: "Awful smell → Amazing fragrance"
    },
    {
        interval: 15,
        range: [76, 80],
        scale: "Terrible advice → Life-changing wisdom"
    },
    {
        interval: 16,
        range: [81, 85],
        scale: "Worst party → Epic celebration"
    },
    {
        interval: 17,
        range: [86, 90],
        scale: "Painful experience → Pure bliss"
    },
    {
        interval: 18,
        range: [91, 95],
        scale: "Biggest regret → Best decision ever"
    },
    {
        interval: 19,
        range: [96, 100],
        scale: "Complete disaster → Absolute perfection"
    }
];

/**
 * Get theme information from a card number
 * @param {number} cardNumber - Card number (1-100)
 * @returns {object} Theme object with interval, range, and scale
 */
export function getThemeFromCard(cardNumber) {
    const intervalIndex = Math.floor((cardNumber - 1) / 5);
    return THEMES[intervalIndex];
}

/**
 * Get all card numbers for a specific theme interval
 * @param {number} intervalIndex - Theme interval (0-19)
 * @returns {number[]} Array of card numbers in that interval
 */
export function getCardsInInterval(intervalIndex) {
    const theme = THEMES[intervalIndex];
    const cards = [];
    for (let i = theme.range[0]; i <= theme.range[1]; i++) {
        cards.push(i);
    }
    return cards;
}
