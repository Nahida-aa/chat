export const fileGroup = ['avatar', 'version', 'other'] as const
export type FileGroup = (typeof fileGroup)[number]
