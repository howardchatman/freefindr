/**
 * Maps listing title/description keywords to a category.
 * Used when importing listings without an explicit category.
 */
const CATEGORY_RULES: { pattern: RegExp; category: string }[] = [
  { pattern: /\bpallet[s]?\b/i,                                       category: 'pallets' },
  { pattern: /\b(wood|lumber|plywood|2x4|timber|logs?|boards?)\b/i,  category: 'wood' },
  { pattern: /\b(fridge|refrigerator|washer|dryer|stove|oven|dishwasher|microwave|freezer|a\/c|air.?condition|hvac)\b/i, category: 'appliances' },
  { pattern: /\b(couch|sofa|dresser|chair|table|bed|mattress|desk|bookcase|bookshelf|cabinet|armchair|recliner|loveseat)\b/i, category: 'furniture' },
  { pattern: /\b(tool[s]?|drill|saw|hammer|ladder|wrench|toolbox|workbench|compressor)\b/i, category: 'tools' },
  { pattern: /\b(crib|stroller|baby|infant|toddler|kids?|children|car.?seat|high.?chair)\b/i, category: 'baby_kids' },
  { pattern: /\b(patio|grill|bbq|outdoor|garden|yard|lawn|pergola|swing|planter)\b/i, category: 'outdoor' },
]

export function detectCategory(title: string, description?: string | null): string {
  const text = [title, description].filter(Boolean).join(' ')
  for (const { pattern, category } of CATEGORY_RULES) {
    if (pattern.test(text)) return category
  }
  return 'miscellaneous'
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pallets:       'Pallets',
    wood:          'Wood',
    appliances:    'Appliances',
    furniture:     'Furniture',
    tools:         'Tools',
    baby_kids:     'Baby & Kids',
    outdoor:       'Outdoor',
    miscellaneous: 'Other',
  }
  return labels[category] ?? category
}

export function categoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    pallets:       '📦',
    wood:          '🌲',
    appliances:    '🧊',
    furniture:     '🛋️',
    tools:         '🔧',
    baby_kids:     '🧸',
    outdoor:       '🌿',
    miscellaneous: '📋',
  }
  return emojis[category] ?? '📋'
}
