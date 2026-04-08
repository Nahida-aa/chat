import { createFileRoute } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
		maskSize: 60,
		translate: 'translate(21.5, 25)',
		statusSize: { width: 37.5, height: 22.5 },
	},
	lg: {
		width: 64,
		height: 64,
		maskSize: 80,
		translate: 'translate(28.5, 33)',
		statusSize: { width: 50, height: 30 },
	},
	xl: {
		width: 96,
		height: 96,
		maskSize: 120,
		translate: 'translate(42.5, 49)',
		statusSize: { width: 75, height: 45 },
	},
};

const statusColors = {
	online: '#45a366',
	offline: '#747f8d',
	busy: '#f84747',
	away: '#faa61a',
};

const avatarVariants = cva(
	'relative inline-flex items-center justify-center group',
	{
		variants: {
			size: {
				sm: 'w-8 h-8',
				md: 'w-12 h-12',
				lg: 'w-16 h-16',
				xl: 'w-24 h-24',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

export interface AvatarWithStatusProps
	extends VariantProps<typeof avatarVariants> {
	src: string;
	alt: string;
	status: 'online' | 'offline' | 'busy' | 'away';
	className?: string;
}

export function AvatarWithStatus({
	src,
	alt,
	status,
	size = 'md',
	className,
}: AvatarWithStatusProps) {
	const config = sizeConfig[size || 'md'];
	const statusColor = statusColors[status];
	const maskId = `avatar-mask-${Math.random().toString(36).substr(2, 9)}`;
	const statusMaskId = `status-mask-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className={twMerge(avatarVariants({ size }), className)}>
			<svg
				width={config.maskSize}
				height={config.maskSize}
				viewBox={`0 0 ${config.maskSize} ${config.maskSize}`}
				className="w-full h-full"
				aria-hidden="true"
			>
				<mask id={maskId} width={config.width} height={config.height}>
					<circle
						cx={config.width / 2}
						cy={config.width / 2}
						r={config.width / 2}
						fill="white"
					/>
					<rect
						color="black"
						x={config.width * 0.5625}
						y={config.width * 0.5625}
						width={config.width * 0.5}
						height={config.width * 0.5}
						rx={config.width * 0.25}
						ry={config.width * 0.25}
					/>
				</mask>
				<foreignObject
					x="0"
					y="0"
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
				<g transform={`scale(1) ${config.translate}`}>
					<svg
						width={config.statusSize.width}
						height={config.statusSize.height}
						viewBox={`0 0 ${config.statusSize.width} ${config.statusSize.height}`}
					>
						<mask id={statusMaskId}>
							<rect
								x="7.5"
								y="5"
								width="10"
								height="10"
								rx="5"
								ry="5"
								fill="white"
							/>
							<rect
								x="12.5"
								y="10"
								width="0"
								height="0"
								rx="0"
								ry="0"
								fill="black"
							/>
							<polygon
								points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
								fill="black"
								transform="scale(0) translate(13.125 10)"
								style={{ transformOrigin: '13.125px 10px' }}
							/>
							<circle fill="black" cx="12.5" cy="10" r="0" />
						</mask>
						<rect
							fill={statusColor}
							width={config.statusSize.width}
							height={config.statusSize.height}
							mask={`url(#${statusMaskId})`}
						/>
					</svg>
					<rect
						x={config.width * 0.6875}
						y={config.width * 0.6875}
						width={config.width * 0.3125}
						height={config.width * 0.3125}
						fill="transparent"
						aria-hidden="true"
						tabIndex={-1}
					/>
				</g>
			</svg>
		</div>
	);
}

export const Route = createFileRoute('/demo/ui/avatarWithStatus')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
			<h1 className="text-2xl font-bold mb-8 text-center">
				Avatar With Status
			</h1>

			<div className="flex flex-wrap gap-8 justify-center">
				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300/30 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/1.jpg"
						alt="User 1"
						status="online"
						size="sm"
					/>
					<span className="text-sm">Online (Small)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/2.jpg"
						alt="User 2"
						status="offline"
						size="md"
					/>
					<span className="text-sm">Offline (Medium)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/men/3.jpg"
						alt="User 3"
						status="busy"
						size="lg"
					/>
					<span className="text-sm">Busy (Large)</span>
				</div>

				<div className="flex flex-col items-center gap-2 hover:bg-cyan-300 group p-2 rounded-lg">
					<AvatarWithStatus
						src="https://randomuser.me/api/portraits/women/4.jpg"
						alt="User 4"
						status="away"
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
  alt="User"
  status="online"
  size="md"
/>`}
				</pre>
			</div>
		</div>
	);
}
