const EMOJI: [RegExp, string][] = [
  [/matcha|tea\b/i, "🍵"], [/coffee|espresso|pour-over|tumbler/i, "☕"], [/mug/i, "🫖"], [/candle/i, "🕯️"],
  [/plant|pothos|succulent|planter/i, "🌿"], [/blanket|throw/i, "🛋️"], [/slipper/i, "🥿"], [/lamp/i, "💡"],
  [/book|novel|guide|journal/i, "📖"], [/puzzle/i, "🧩"], [/board game|card game|card deck/i, "🎲"],
  [/pottery|ceramic/i, "🏺"], [/watercolor|sketch|paint/i, "🎨"], [/embroidery|knit/i, "🧶"],
  [/vinyl|record|speaker|headphone|earbud/i, "🎧"], [/camera|photo/i, "📸"], [/keyboard|controller|console|video game|gaming/i, "🎮"],
  [/charger|cable|tracker|tag\b/i, "🔌"], [/telescope|star/i, "🔭"], [/camping|hiking|trail/i, "🏕️"],
  [/scarf|beanie|gloves/i, "🧣"], [/socks/i, "🧦"], [/bag|tote/i, "👜"], [/wallet/i, "👛"], [/watch/i, "⌚"],
  [/necklace|earring|jewelry/i, "💍"], [/hat\b/i, "🧢"], [/perfume|fragrance/i, "🌸"], [/lip|nail/i, "💄"],
  [/serum|cream|mask|sunscreen|soak|skincare/i, "🧴"], [/spa/i, "💆"], [/chocolate/i, "🍫"], [/popcorn/i, "🍿"],
  [/hot sauce|spicy/i, "🌶️"], [/pasta|cooking|skillet|recipe|waffle/i, "🍳"], [/cheese|charcuterie/i, "🧀"],
  [/wine/i, "🍷"], [/picnic/i, "🧺"], [/travel|bucket list|adventure/i, "🗺️"], [/movie/i, "🎬"], [/date/i, "💌"],
];

// A picture for a gift with no photo. Falls back to the category's emoji.
export function giftEmoji(title: string, fallback: string) {
  return EMOJI.find(([pattern]) => pattern.test(title))?.[1] ?? fallback;
}
