// 排序相关常量
export const SORT_OPTIONS = {
  TIMESTAMP: 'timestamp',
  CONTENT: 'content'
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const SORT_LABELS = {
  [SORT_OPTIONS.TIMESTAMP]: '按时间',
  [SORT_OPTIONS.CONTENT]: '按内容'
} as const;

export const SORT_ORDER_LABELS = {
  [SORT_ORDERS.ASC]: '升序（最早/最小在前）',
  [SORT_ORDERS.DESC]: '降序（最新/最大在前）'
} as const;

// 显示设置常量
export const DISPLAY_LIMITS = {
  MIN_ITEMS: 10,
  MAX_ITEMS: 1000,
  DEFAULT_ITEMS: 100
} as const;

export const HISTORY_LIMITS = {
  MIN_SIZE: 5,
  MAX_SIZE: 50,
  DEFAULT_SIZE: 10
} as const;

// 应用常量
export const APP_CONFIG = {
  DEFAULT_SORT_BY: SORT_OPTIONS.TIMESTAMP,
  DEFAULT_SORT_ORDER: SORT_ORDERS.DESC,
  DEFAULT_MAX_ITEMS: DISPLAY_LIMITS.DEFAULT_ITEMS,
  DEFAULT_MAX_HISTORY: HISTORY_LIMITS.DEFAULT_SIZE
} as const;

// 类型定义
export type SortBy = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
export type SortOrder = typeof SORT_ORDERS[keyof typeof SORT_ORDERS]; 