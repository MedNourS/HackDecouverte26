export const MINUTES_IN_DAY = 24 * 60

export const START_HOUR = 7
export const HOUR_COUNT = 15
export const HOURS = Array.from({ length: HOUR_COUNT }, (_, i) => i + START_HOUR)

export const hourHeight = 64
export const pxPerMinute = hourHeight / 60