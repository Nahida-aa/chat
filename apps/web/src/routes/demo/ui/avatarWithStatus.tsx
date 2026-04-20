import { createFileRoute } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { CircleMinus, Moon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { UxTooltip } from '#/components/uix/tooltip.tsx';
import type { OnlineStatus } from '#/lib/ws.ts';

/**
 * 头像尺寸配置对象
 * 定义了四种尺寸（sm、md、lg、xl）的配置参数，包括：
 * - size: 头像尺寸, SVG 遮罩尺寸
 * - translate: 状态指示器的位移偏移量
 * - statusSize: 状态指示器的尺寸
 */
const sizeConfig = {
	sm: {
		size: 24,
		translate: 'translate(17, 17)',
		statusMaskX: 14,
		statusSize: 7,
	},
	md: {
		size: 32,
		translate: 'translate(22, 22)',
		statusMaskX: 19,
		statusSize: 10,
	},
	lg: {
		size: 64,
		translate: 'translate(47, 47)',
		statusMaskX: 44,
		statusSize: 14,
	},
	xl: {
		size: 80,
		translate: 'translate(60, 60)',
		statusMaskX: 57,
		statusSize: 16,
	},
};
const avatarVariants = cva('relative rounded-full', {
	variants: {
		size: {
			sm: 'size-6', // 24px
			md: 'size-8', // 32px
			lg: 'size-16', // 64px
			xl: 'size-20', // 80px
		},
	},
	defaultVariants: {
		size: 'md',
	},
});
export interface AvatarWithStatusProps
	extends VariantProps<typeof avatarVariants> {
	src: string;
	name: string;
	status: OnlineStatus;
	className?: string;
}
export function AvatarWithStatus({
	src,
	name,
	status,
	size = 'md',
	className,
}: AvatarWithStatusProps) {
	// 根据尺寸获取对应的配置参数
	const config = sizeConfig[size || 'md'];
	// 根据状态获取对应的颜色值
	// 生成唯一的 mask ID（避免多个组件实例之间的 ID 冲突）
	const maskId = `avatar-mask-${Math.random().toString(36).substr(2, 9)}`;
	return (
		<div
			aria-label={`${name},${status}`}
			className={twMerge('rounded-full', className)}
		>
			<svg
				width={config.size}
				height={config.size}
				viewBox={`0 0 ${config.size} ${config.size}`}
				aria-hidden="true"
			>
				{/* 头像遮罩定义：圆形头像 + 右下角矩形缺口 */}
				<mask id={maskId} width={config.size} height={config.size}>
					{/* 白色圆形区域：显示头像图片 */}
					<circle
						cx={config.size / 2}
						cy={config.size / 2}
						r={config.size / 2}
						fill="white"
					/>
					{/* 黑色矩形区域：挖空右下角用于放置状态指示器 */}
					<rect
						color="black"
						x={config.statusMaskX} // 19
						y={config.statusMaskX}
						width={config.statusSize + 6} // 16
						height={config.statusSize + 6}
						rx={config.size * 0.25}
						ry={config.size * 0.25}
					/>
				</mask>

				{/* 使用 foreignObject 嵌入 HTML 内容显示头像图片 */}
				<foreignObject
					x="0"
					y="0"
					width={config.size}
					height={config.size}
					mask={`url(#${maskId})`}
				>
					<div className="w-full h-full">
						<Image
							src={src}
							alt={name || 'avatar'}
							width={config.size}
							height={config.size}
							className="rounded-full object-cover w-full h-full"
						/>
					</div>
				</foreignObject>

				{/* 状态指示器组：通过 transform 定位到右下角 */}
				<UxTooltip content={status}>
					<g transform={config.translate}>
						<StatusDot status={status} size={config.statusSize} />
					</g>
				</UxTooltip>
			</svg>
		</div>
	);
}
const SolidCircle = ({ color = '#45a366', size = 10 }) => (
	<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
		<circle cx={size / 2} cy={size / 2} r={size * 0.5} fill={color} />
	</svg>
);
export function StatusDot({
	status = 'offline',
	size = 10,
	className = '',
}: {
	status?: OnlineStatus;
	size?: number;
	className?: string;
}) {
	if (status === 'online') {
		return <SolidCircle size={size} />;
	} else if (status === 'dnd') {
		return (
			<CircleMinus
				color="#fb2c36"
				size={size}
				strokeWidth={size / 5}
				absoluteStrokeWidth
				className={`size-${size / 4} ${className}`}
			/>
		);
	} else if (status === 'idle') {
		return (
			<Moon
				size={size}
				color="#e5c890"
				strokeWidth={size / 5}
				absoluteStrokeWidth
				className={`size-${size / 4} ${className}`}
			/>
		);
	} else if (status === 'offline' || status === 'invisible') {
		return <SolidCircle color="#6a7282" size={size} />;
	}
}

export const Route = createFileRoute('/demo/ui/avatarWithStatus')({
	component: RouteComponent,
});

const Demo32 = () => (
	<div role="img" aria-label="MEE6, 在线" aria-hidden="false">
		<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
			<mask id="«r4f»" width="32" height="32">
				<circle cx="16" cy="16" r="16" fill="white"></circle>
				<rect
					color="black"
					x="19"
					y="19"
					width="16"
					height="16"
					rx="8"
					ry="8"
				></rect>
			</mask>
			<foreignObject x="0" y="0" width="32" height="32" mask="url(#«r4f»)">
				<div>
					<img
						alt=" "
						aria-hidden="true"
						src="https://cdn.discordapp.com/avatars/159985870458322944/765030df32975c5b23f8dfe86d6ff520.webp?size=32"
					/>
				</div>
			</foreignObject>
			<g transform="translate(22, 22)">
				<SolidCircle />
			</g>
		</svg>
	</div>
);
function RouteComponent() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
			<h1 className="text-2xl font-bold mb-8 text-center">
				Avatar With Status
			</h1>
			<Demo32 />
			<div className="flex flex-wrap gap-8 justify-center">
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300/30 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/1.jpg"
						name="User 1"
						status="online"
						size="sm"
					/>
					<span className="text-sm">Online (Small)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/2.jpg"
						name="User 2"
						status="offline"
						size="md"
					/>
					<span className="text-sm">Offline (Medium)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/3.jpg"
						name="User 3"
						status="dnd"
						size="lg"
					/>
					<span className="text-sm">Busy (Large)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/4.jpg"
						name="User 4"
						status="idle"
						size="xl"
					/>
					<span className="text-sm">Away (Extra Large)</span>
				</div>
			</div>

			<div className="mt-12 max-w-md text-center">
				<h2 className="text-lg font-semibold mb-4">Usage Example</h2>
				<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left overflow-auto">
					{`import { AvatarWithStatus } from '#/components/ui/avatarWithStatus';

// Basic usage
<AvatarWithStatus
  src="https://randomuser.me/api/portraits/men/1.jpg"
  name="User 1"
  status="online"
  size="md"
/>`}
				</pre>
			</div>
		</div>
	);
}
