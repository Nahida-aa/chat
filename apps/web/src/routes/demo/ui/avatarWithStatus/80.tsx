import { createFileRoute } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 头像尺寸配置对象
 * 定义了四种尺寸（sm、md、lg、xl）的配置参数，包括：
 * - width/height: 头像宽高
 * - maskSize: SVG 遮罩尺寸
 * - translate: 状态指示器的位移偏移量
 * - statusSize: 状态指示器的尺寸
 */
const sizeConfig = {
	sm: {
		width: 32,
		height: 32,
		maskSize: 40,
		translate: 'translate(14.5, 17)',
		statusSize: { width: 25, height: 15 },
	},
	md: {
		width: 48,
		height: 48,
		maskSize: 48,
		translate: 'translate(21.5, 25)',
		statusSize: { width: 37.5, height: 22.5 },
	},
	lg: {
		width: 64,
		height: 64,
		maskSize: 64,
		translate: 'translate(28.5, 33)',
		statusSize: { width: 50, height: 30 },
	},
	xl: {
		width: 96,
		height: 96,
		maskSize: 96,
		translate: 'translate(42.5, 49)',
		statusSize: { width: 75, height: 45 },
	},
};

/**
 * 状态颜色配置对象
 * 定义了四种在线状态对应的颜色值：
 * - online: 在线（绿色）
 * - offline: 离线（灰色）
 * - busy: 忙碌（红色）
 * - away: 离开（橙色）
 */
const statusColors = {
	online: '#45a366',
	offline: '#747f8d',
	busy: '#f84747',
	away: '#faa61a',
};

/**
 * 使用 class-variance-authority (CVA) 定义头像组件的变体样式
 * - base: 基础样式（相对定位、内联flex布局、居中、组悬停效果）
 * - variants.size: 四种尺寸对应的宽高 Tailwind 类名
 */
const avatarVariants = cva('relative ', {
	variants: {
		size: {
			sm: 'w-8 h-8', // 32px
			md: 'w-12 h-12', // 48px
			lg: 'w-16 h-16', // 64px
			xl: 'w-24 h-24', // 96px
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * AvatarWithStatus 组件的属性接口
 * @extends VariantProps<typeof avatarVariants> - 继承 CVA 变体类型
 * @property src - 头像图片的 URL 地址
 * @property alt - 图片的替代文本（用于无障碍访问）
 * @property status - 用户在线状态：'online' | 'offline' | 'busy' | 'away'
 * @property className - 可选的自定义 CSS 类名
 */
export interface AvatarWithStatusProps
	extends VariantProps<typeof avatarVariants> {
	src: string;
	alt: string;
	status: 'online' | 'offline' | 'busy' | 'away';
	className?: string;
}

/**
 * 带状态指示器的头像组件
 *
 * 该组件使用 SVG 和遮罩技术实现头像图片与状态指示器的组合显示：
 * 1. 使用 SVG mask 创建圆形头像，并在右下角预留缺口用于状态指示器
 * 2. 使用 foreignObject 嵌入 HTML img 标签显示头像图片
 * 3. 在右下角显示彩色状态指示器（在线/离线/忙碌/离开）
 *
 * @param props - 组件属性
 * @returns 带状态指示器的头像 JSX 元素
 */
export function AvatarWithStatus({
	src,
	alt,
	status,
	size = 'md',
	className,
}: AvatarWithStatusProps) {
	// 根据尺寸获取对应的配置参数
	const config = sizeConfig[size || 'md'];
	// 根据状态获取对应的颜色值
	const statusColor = statusColors[status];
	// 生成唯一的 mask ID（避免多个组件实例之间的 ID 冲突）
	const maskId = `avatar-mask-${Math.random().toString(36).substr(2, 9)}`;
	const statusMaskId = `status-mask-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div
			aria-label={`${alt},${status}`}
			className={twMerge(avatarVariants({ size }), className)}
		>
			<svg
				width={config.maskSize}
				height={config.maskSize}
				viewBox={`0 0 ${config.maskSize} ${config.maskSize}`}
				className="w-full h-full"
				aria-hidden="true"
			>
				{/* 头像遮罩定义：圆形头像 + 右下角矩形缺口 */}
				<mask id={maskId} width={config.width} height={config.height}>
					{/* 白色圆形区域：显示头像图片 */}
					<circle
						cx={config.width / 2}
						cy={config.width / 2}
						r={config.width / 2}
						fill='white'
					/>
					{/* 黑色矩形区域：挖空右下角用于放置状态指示器 */}
					<rect
						color='black'
						x={config.width * 0.59375}
						y={config.width * 0.59375}
						width={config.width * 0.5}
						height={config.width * 0.5}
						rx={config.width * 0.25}
						ry={config.width * 0.25}
					/>
				</mask>

				{/* 使用 foreignObject 嵌入 HTML 内容显示头像图片 */}
				<foreignObject
					x='0'
					y='0'
					width={config.width}
					height={config.height}
					mask={`url(#${maskId})`}
				>
					<div className="w-full h-full">
						<Image
							src={src}
							alt={alt}
							width={config.width}
							height={config.height}
							className="rounded-full object-cover w-full h-full"
						/>
					</div>
				</foreignObject>

				{/* 状态指示器组：通过 transform 定位到右下角 */}
				<g transform={`scale(1) ${config.translate}`}>
					<svg
						width={config.statusSize.width}
						height={config.statusSize.height}
						viewBox={`0 0 ${config.statusSize.width} ${config.statusSize.height}`}
					>
						{/* 状态指示器遮罩定义 */}
						<mask id={statusMaskId}>
							{/* 白色圆形：显示状态颜色 */}
							<rect
								x='7.5'
								y='5'
								width='10'
								height='10'
								rx='5'
								ry='5'
								fill='white'
							/>
							{/* 黑色矩形和多边形：创建状态指示器的形状效果 */}
							<rect
								x='12.5'
								y='10'
								width='0'
								height='0'
								rx='0'
								ry='0'
								fill='black'
							/>
							<polygon
								points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
								fill='black'
								transform="scale(0) translate(13.125 10)"
								style={{ transformOrigin: '13.125px 10px' }}
							/>
							<circle fill="black" cx="12.5" cy="10" r="0" />
						</mask>
						{/* 应用遮罩的状态指示器矩形，填充对应状态颜色 */}
						<rect
							fill={statusColor}
							width={config.statusSize.width}
							height={config.statusSize.height}
							mask={`url(#${statusMaskId})`}
						/>
					</svg>
					{/* 透明的辅助矩形，用于无障碍访问（被 aria-hidden 隐藏） */}
					<rect
						x={config.width * 0.6875} // 32 * 0.6875 =
						y={config.width * 0.6875}
						width={config.width * 0.3125}
						height={config.width * 0.3125}
						fill='transparent'
						aria-hidden='true'
						tabIndex={-1}
					/>
				</g>
			</svg>
		</div>
	)
}

/**
 * 使用 TanStack Router 创建路由
 * 路由路径: /demo/ui/avatarWithStatus
 */
export const Route = createFileRoute('/demo/ui/avatarWithStatus/80')({
	component: RouteComponent,
});

const Demo32 = () => (
	<div
		role="img"
		aria-label="MEE6, 在线"
		aria-hidden="false"
		style={{
			width: '32px',
			height: '32px',
		}}
	>
		<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
			<mask id="«r4f»" width="32" height="32">
				<circle cx="16" cy="16" r="16" fill="white"></circle>
				<rect
					color='black'
					x='19'
					y='19'
					width='16'
					height='16'
					rx='8'
					ry='8'
				></rect>
			</mask>
			<foreignObject x="0" y="0" width="32" height="32" mask="url(#«r4f»)">
				<div>
					<img
						alt=' '
						aria-hidden='true'
						src="https://cdn.discordapp.com/avatars/159985870458322944/765030df32975c5b23f8dfe86d6ff520.webp?size=32"
					/>
				</div>
			</foreignObject>
			<g transform="scale(1) translate(14.5, 17)">
				<svg width="25" height="15" viewBox="0 0 25 15">
					<mask id="«r4g»">
						<rect
							x='7.5'
							y='5'
							width='10'
							height='10'
							rx='5'
							ry='5'
							fill='white'
						></rect>
						<rect
							x='12.5'
							y='10'
							width='0'
							height='0'
							rx='0'
							ry='0'
							fill='black'
						></rect>
						<polygon
							points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
							fill='black'
							transform="scale(0) translate(13.125 10)"
							style={{
								transformOrigin: '13.125px 10px',
							}}
						></polygon>
						<circle fill="black" cx="12.5" cy="10" r="0"></circle>
					</mask>
					<rect fill="#45a366" width="25" height="15" mask="url(#«r4g»)"></rect>
				</svg>
				<rect
					x='22'
					y='22'
					width='10'
					height='10'
					fill="transparent"
					aria-hidden="true"
					tabIndex={-1}
				></rect>
			</g>
		</svg>
	</div>
);
const Demo80 = () => (
	<div
		className="size-20 rounded-full"
		role="img"
		aria-label="nahida_aa, 在线"
		aria-hidden="false"
	>
		<svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
			<foreignObject
				x='0'
				y='0'
				width='80'
				height='80'
				mask="url(#svg-mask-avatar-status-round-80)"
			>
				<div>
					<img
						alt=' '
						aria-hidden='true'
						className="rounded-full"
						src="https://cdn.discordapp.com/avatars/1317134881553256532/fc78bd344774335f43a5d6758d537557.webp?size=80"
					/>
				</div>
			</foreignObject>
			<g>
				<rect
					width='16'
					height='16'
					x='60'
					y='60'
					fill='#45a366'
					mask="url(#svg-mask-status-online)"
				></rect>
			</g>
		</svg>
	</div>
);

/**
 * 路由组件：展示 AvatarWithStatus 组件的各种用法示例
 * 包含四种尺寸（sm、md、lg、xl）和四种状态（online、offline、busy、away）的组合展示
 */
function RouteComponent() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
			<h1 className="text-2xl font-bold mb-8 text-center">
				Avatar With Status
			</h1>

			<Demo32 />
			<AvatarWithStatus
				src="https://randomuser.me/api/portraits/men/1.jpg"
				alt='User 1'
				status="online"
				size='sm'
			/>
			<Demo80 />
			{/* 头像展示网格 */}
			<div className="flex flex-wrap gap-8 justify-center">
				{/* 小型在线状态头像 */}
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300/30 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/1.jpg"
						alt='User 1'
						status='online'
						size='sm'
					/>
					<span className="text-sm">Online (Small)</span>
				</div>

				{/* 中型离线状态头像 */}
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/2.jpg"
						alt='User 2'
						status='offline'
						size='md'
					/>
					<span className="text-sm">Offline (Medium)</span>
				</div>

				{/* 大型忙碌状态头像 */}
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/3.jpg"
						alt='User 3'
						status='busy'
						size='lg'
					/>
					<span className="text-sm">Busy (Large)</span>
				</div>

				{/* 超大型离开状态头像 */}
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/4.jpg"
						alt='User 4'
						status='away'
						size='xl'
					/>
					<span className="text-sm">Away (Extra Large)</span>
				</div>
			</div>

			{/* 使用示例代码块 */}
			<div className="mt-12 max-w-md text-center">
				<h2 className="text-lg font-semibold mb-4">Usage Example</h2>
				<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left overflow-auto">
					{`import { AvatarWithStatus } from '#/components/ui/avatarWithStatus';

// Basic usage
<AvatarWithStatus
  src="https://randomuser.me/api/portraits/men/1.jpg"
  alt="User"
  status="online"
  size="md"
/>`}
				</pre>
			</div>
		</div>
	)
}
