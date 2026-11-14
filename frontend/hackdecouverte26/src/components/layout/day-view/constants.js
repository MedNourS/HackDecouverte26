export const START_HOUR = 6
export const START_MINUTE = START_HOUR * 60

export const MINUTES_IN_DAY = 24 * 60

export const HOURS = Array.from({ length: 24 - START_HOUR }, (_, i) => START_HOUR + i)
export const hourHeight = 64
export const pxPerMinute = hourHeight / 60