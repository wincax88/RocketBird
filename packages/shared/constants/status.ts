/**
 * 状态相关常量
 */

// 用户状态
export const USER_STATUS = {
  DISABLED: 0,
  ACTIVE: 1,
} as const;

export const USER_STATUS_TEXT: Record<number, string> = {
  [USER_STATUS.DISABLED]: '禁用',
  [USER_STATUS.ACTIVE]: '正常',
};

// 性别
export const GENDER = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2,
} as const;

export const GENDER_TEXT: Record<number, string> = {
  [GENDER.UNKNOWN]: '未知',
  [GENDER.MALE]: '男',
  [GENDER.FEMALE]: '女',
};

// 积分类型
export const POINTS_TYPE = {
  INCOME: 'income',
  COST: 'cost',
} as const;

export const POINTS_TYPE_TEXT: Record<string, string> = {
  [POINTS_TYPE.INCOME]: '收入',
  [POINTS_TYPE.COST]: '支出',
};

// 积分来源
export const POINTS_SOURCE = {
  CHECKIN: 'checkin',
  SHARE: 'share',
  REFERRAL: 'referral',
  BIRTHDAY: 'birthday',
  GROWTH: 'growth',
  NEWMEMBER: 'newmember',
  EXCHANGE: 'exchange',
  ADMIN: 'admin',
  REWARD: 'reward',
  EXPIRE: 'expire',
} as const;

export const POINTS_SOURCE_TEXT: Record<string, string> = {
  [POINTS_SOURCE.CHECKIN]: '打卡签到',
  [POINTS_SOURCE.SHARE]: '分享奖励',
  [POINTS_SOURCE.REFERRAL]: '邀请好友',
  [POINTS_SOURCE.BIRTHDAY]: '生日礼',
  [POINTS_SOURCE.GROWTH]: '成长礼',
  [POINTS_SOURCE.NEWMEMBER]: '新会员礼',
  [POINTS_SOURCE.EXCHANGE]: '积分兑换',
  [POINTS_SOURCE.ADMIN]: '管理员调整',
  [POINTS_SOURCE.REWARD]: '活动奖励',
  [POINTS_SOURCE.EXPIRE]: '积分过期',
};

// 商品类型
export const GOODS_TYPE = {
  VIRTUAL: 'virtual',
  PHYSICAL: 'physical',
} as const;

export const GOODS_TYPE_TEXT: Record<string, string> = {
  [GOODS_TYPE.VIRTUAL]: '虚拟商品',
  [GOODS_TYPE.PHYSICAL]: '实物商品',
};

// 商品状态
export const GOODS_STATUS = {
  OFF_SHELF: 0,
  ON_SHELF: 1,
} as const;

export const GOODS_STATUS_TEXT: Record<number, string> = {
  [GOODS_STATUS.OFF_SHELF]: '已下架',
  [GOODS_STATUS.ON_SHELF]: '已上架',
};

// 订单状态
export const ORDER_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export const ORDER_STATUS_TEXT: Record<number, string> = {
  [ORDER_STATUS.PENDING]: '待处理',
  [ORDER_STATUS.PROCESSING]: '处理中',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
};

// 打卡状态
export const CHECKIN_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

export const CHECKIN_STATUS_TEXT: Record<number, string> = {
  [CHECKIN_STATUS.PENDING]: '待审核',
  [CHECKIN_STATUS.APPROVED]: '已通过',
  [CHECKIN_STATUS.REJECTED]: '已拒绝',
};

// 福利类型
export const GIFT_TYPE = {
  BIRTHDAY: 'birthday',
  GROWTH: 'growth',
  NEWMEMBER: 'newmember',
} as const;

export const GIFT_TYPE_TEXT: Record<string, string> = {
  [GIFT_TYPE.BIRTHDAY]: '生日礼',
  [GIFT_TYPE.GROWTH]: '成长礼',
  [GIFT_TYPE.NEWMEMBER]: '新会员礼',
};

// 福利记录状态
export const GIFT_RECORD_STATUS = {
  PENDING: 0,
  CLAIMED: 1,
  EXPIRED: 2,
} as const;

export const GIFT_RECORD_STATUS_TEXT: Record<number, string> = {
  [GIFT_RECORD_STATUS.PENDING]: '待领取',
  [GIFT_RECORD_STATUS.CLAIMED]: '已领取',
  [GIFT_RECORD_STATUS.EXPIRED]: '已过期',
};

// 反馈类别
export const FEEDBACK_CATEGORY = {
  SUGGESTION: 'suggestion',
  COMPLAINT: 'complaint',
  BUG: 'bug',
  OTHER: 'other',
} as const;

export const FEEDBACK_CATEGORY_TEXT: Record<string, string> = {
  [FEEDBACK_CATEGORY.SUGGESTION]: '功能建议',
  [FEEDBACK_CATEGORY.COMPLAINT]: '投诉',
  [FEEDBACK_CATEGORY.BUG]: '问题反馈',
  [FEEDBACK_CATEGORY.OTHER]: '其他',
};

// 反馈状态
export const FEEDBACK_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  REPLIED: 2,
  CLOSED: 3,
} as const;

export const FEEDBACK_STATUS_TEXT: Record<number, string> = {
  [FEEDBACK_STATUS.PENDING]: '待处理',
  [FEEDBACK_STATUS.PROCESSING]: '处理中',
  [FEEDBACK_STATUS.REPLIED]: '已回复',
  [FEEDBACK_STATUS.CLOSED]: '已关闭',
};

// 邀请状态
export const INVITE_STATUS = {
  PENDING: 0,
  REWARDED: 1,
  INVALID: 2,
} as const;

export const INVITE_STATUS_TEXT: Record<number, string> = {
  [INVITE_STATUS.PENDING]: '待奖励',
  [INVITE_STATUS.REWARDED]: '已奖励',
  [INVITE_STATUS.INVALID]: '已失效',
};
