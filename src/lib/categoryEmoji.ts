/**
 * Utility function to get emoji based on category
 * Centralized to avoid code duplication
 */
export const getCategoryEmoji = (category: string): string => {
  const categoryLower = category.toLowerCase().trim();
  
  // Switch case for exact match
  switch (categoryLower) {
    // Electronics
    case "elektronik":
    case "hp":
    case "handphone":
    case "smartphone":
      return "📱";
    case "laptop":
    case "notebook":
      return "💻";
    
    // Documents
    case "dokumen":
    case "surat":
      return "📄";
    case "ktp":
    case "kartu":
    case "id card":
      return "🪪";
    
    // Keys
    case "kunci":
      return "🔑";
    
    // Bags & Wallets
    case "tas":
    case "ransel":
    case "backpack":
      return "🎒";
    case "dompet":
    case "wallet":
      return "👛";
    
    // Clothing
    case "pakaian":
    case "baju":
    case "kaos":
    case "kemeja":
      return "👕";
    case "sepatu":
    case "sandal":
      return "👟";
    
    // Accessories
    case "jam":
    case "jam tangan":
    case "watch":
      return "⌚";
    case "kacamata":
    case "glasses":
      return "🕶️";
    
    // Books & Stationery
    case "buku":
    case "novel":
    case "book":
      return "📚";
    case "alat tulis":
    case "pensil":
    case "pulpen":
      return "✏️";
    
    // Others
    case "lainnya":
    case "other":
      return "📦";
  }
  
  // Fallback with includes for partial match
  if (categoryLower.includes("kunci")) return "🔑";
  if (categoryLower.includes("hp") || categoryLower.includes("handphone")) return "📱";
  if (categoryLower.includes("laptop")) return "💻";
  if (categoryLower.includes("elektronik")) return "📱";
  if (categoryLower.includes("dokumen") || categoryLower.includes("surat")) return "📄";
  if (categoryLower.includes("ktp") || categoryLower.includes("kartu")) return "🪪";
  if (categoryLower.includes("tas")) return "🎒";
  if (categoryLower.includes("dompet")) return "👛";
  if (categoryLower.includes("baju") || categoryLower.includes("pakaian")) return "👕";
  if (categoryLower.includes("sepatu")) return "👟";
  if (categoryLower.includes("jam")) return "⌚";
  if (categoryLower.includes("kacamata")) return "🕶️";
  if (categoryLower.includes("buku")) return "📚";
  if (categoryLower.includes("pensil") || categoryLower.includes("alat tulis")) return "✏️";
  
  // Default
  return "📦";
};
