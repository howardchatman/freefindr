export interface UserSettings {
  home_zip: string
  radius_miles: number
  notifications_enabled: boolean
  do_not_disturb: boolean
  only_items_with_image: boolean
  source_preferences: Record<string, boolean> // source_code -> enabled
}

export const DEFAULT_SETTINGS: UserSettings = {
  home_zip: '77002',
  radius_miles: 25,
  notifications_enabled: true,
  do_not_disturb: false,
  only_items_with_image: false,
  source_preferences: {
    facebook_marketplace: true,
    craigslist: true,
    nextdoor: true,
    offerup: true,
    trashnothing: true,
  },
}

// Dev mode user — replace with real auth later
export const DEV_USER_ID = '00000000-0000-0000-0000-000000000001'
