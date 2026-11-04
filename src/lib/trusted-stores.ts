type Store = { name: string; hosts: string[]; search: (query: string) => string };

const q = encodeURIComponent;

// Every shop link in the quiz goes to one of these stores.
export const TRUSTED_STORES: Store[] = [
  { name: "Amazon", hosts: ["amazon.com"], search: (s) => `https://www.amazon.com/s?k=${q(s)}` },
  { name: "Target", hosts: ["target.com"], search: (s) => `https://www.target.com/s?searchTerm=${q(s)}` },
  { name: "Walmart", hosts: ["walmart.com"], search: (s) => `https://www.walmart.com/search?q=${q(s)}` },
  { name: "Etsy", hosts: ["etsy.com"], search: (s) => `https://www.etsy.com/search?q=${q(s)}` },
  { name: "Sephora", hosts: ["sephora.com"], search: (s) => `https://www.sephora.com/search?keyword=${q(s)}` },
  { name: "Ulta", hosts: ["ulta.com"], search: (s) => `https://www.ulta.com/search?search=${q(s)}` },
  { name: "Nordstrom", hosts: ["nordstrom.com"], search: (s) => `https://www.nordstrom.com/sr?keyword=${q(s)}` },
  { name: "Best Buy", hosts: ["bestbuy.com"], search: (s) => `https://www.bestbuy.com/site/searchpage.jsp?st=${q(s)}` },
  { name: "Apple", hosts: ["apple.com"], search: (s) => `https://www.apple.com/us/search/${q(s)}` },
  { name: "REI", hosts: ["rei.com"], search: (s) => `https://www.rei.com/search?q=${q(s)}` },
  { name: "Uncommon Goods", hosts: ["uncommongoods.com"], search: (s) => `https://www.uncommongoods.com/search?q=${q(s)}` },
  { name: "Barnes & Noble", hosts: ["barnesandnoble.com"], search: (s) => `https://www.barnesandnoble.com/s/${q(s)}` },
  { name: "Nike", hosts: ["nike.com"], search: (s) => `https://www.nike.com/w?q=${q(s)}` },
  { name: "Adidas", hosts: ["adidas.com"], search: (s) => `https://www.adidas.com/us/search?q=${q(s)}` },
  { name: "New Balance", hosts: ["newbalance.com"], search: (s) => `https://www.newbalance.com/search?q=${q(s)}` },
  { name: "Foot Locker", hosts: ["footlocker.com"], search: (s) => `https://www.footlocker.com/search?query=${q(s)}` },
  { name: "Zara", hosts: ["zara.com"], search: (s) => `https://www.zara.com/us/en/search?searchTerm=${q(s)}` },
  { name: "Williams Sonoma", hosts: ["williams-sonoma.com"], search: (s) => `https://www.williams-sonoma.com/search/results.html?words=${q(s)}` },
  { name: "Bloomingdale's", hosts: ["bloomingdales.com"], search: (s) => `https://www.bloomingdales.com/shop/search?keyword=${q(s)}` },
  { name: "Spafinder", hosts: ["spafinder.com"], search: () => "https://www.spafinder.com/" },
  { name: "Priority Pass", hosts: ["prioritypass.com"], search: () => "https://www.prioritypass.com/" },
  { name: "Cozymeal", hosts: ["cozymeal.com"], search: () => "https://www.cozymeal.com/" },
];

export function findStore(name: string) {
  const wanted = name.toLowerCase().replace(/[\s-]+/g, "");
  return TRUSTED_STORES.find((store) => {
    const candidate = store.name.toLowerCase().replace(/\s+/g, "");
    return wanted === candidate || wanted.startsWith(`${candidate}-`) || wanted.startsWith(`${candidate}.`);
  });
}

export function isTrustedUrl(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return false;
    return TRUSTED_STORES.some((store) =>
      store.hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)),
    );
  } catch {
    return false;
  }
}

const DEFAULT_STORE: Record<string, string> = {
  "Clothes & accessories": "Nordstrom",
  "Skincare & beauty": "Sephora",
  "Gaming & tech": "Best Buy",
  "Home & cozy": "Target",
  "Food & drink": "Amazon",
  "Books & hobbies": "Barnes & Noble",
  Experiences: "Uncommon Goods",
};

export function storeForCategory(category: string) {
  return findStore(DEFAULT_STORE[category] ?? "Amazon")!;
}
