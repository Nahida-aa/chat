// 加入方法枚举
export const joinMethod = [
  "invite", // 通过邀请加入
  "manual_review", // 通过 人工审核(人工检查\验证) 即 申请 加入
  "discover", // 用户自己发现, 且 社区没有设置 人工审核
  "system", // 系统创建（如社区创建者）
] as const;
export type JoinMethod = (typeof joinMethod)[number];
