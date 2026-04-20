import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

// 模拟数据类型
interface User {
	id: number;
	name: string;
	email: string;
	avatar: string;
	createdAt: string; // ISO 时间字符串
}

// 复合游标类型 - 包含 id 和 createdAt
interface Cursor {
	id: number;
	createdAt: string;
}

interface PaginatedResponse {
	users: User[];
	nextCursor: Cursor | null;
}

interface FetchUsersParams {
	pageParam?: Cursor | null;
	limit: number;
}

// 模拟数据库 - 50 条用户数据
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => {
	const id = i + 1;
	// 模拟不同的创建时间（按 id 倒序，id 越大时间越新）
	const date = new Date('2024-01-01');
	date.setHours(date.getHours() + i);

	return {
		id,
		name: `用户 ${id}`,
		email: `user${id}@example.com`,
		avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
		createdAt: date.toISOString(),
	};
});

// 模拟 API 调用 - 使用复合游标（id + createdAt）
const fetchUsers = async ({
	pageParam = null,
	limit,
}: FetchUsersParams): Promise<PaginatedResponse> => {
	// 模拟网络延迟
	await new Promise((resolve) => setTimeout(resolve, 800));

	// 模拟数据库查询：按 createdAt 降序，id 降序
	let filteredUsers = [...mockUsers];

	// 如果有游标，只查询游标之后的数据
	if (pageParam) {
		// 找到游标位置，返回之后的记录
		const cursorIndex = filteredUsers.findIndex(
			(u) => u.id === pageParam.id && u.createdAt === pageParam.createdAt,
		);
		if (cursorIndex !== -1) {
			filteredUsers = filteredUsers.slice(cursorIndex + 1);
		}
	}

	// 取前 limit 条
	const users = filteredUsers.slice(0, limit);

	// 生成下一页游标（最后一条记录的 id 和 createdAt）
	const lastUser = users[users.length - 1];
	const nextCursor: Cursor | null = lastUser
		? { id: lastUser.id, createdAt: lastUser.createdAt }
		: null;

	return {
		users,
		nextCursor,
	};
};

export const Route = createFileRoute('/demo/tanstack-query/infinite-query')({
	component: RouteComponent,
});

function RouteComponent() {
	// 分页大小状态
	const [limit, setLimit] = useState<number>(10);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
		status,
	} = useInfiniteQuery({
		queryKey: ['users', 'infinite', limit],
		// queryFn 接收的 pageParam 类型是 Cursor | null
		queryFn: ({ pageParam }) => fetchUsers({ pageParam, limit }),
		initialPageParam: null as Cursor | null,
		// getNextPageParam 返回 Cursor | null 作为下一页的游标
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	// 当 limit 改变时，重新获取数据
	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
	};

	// 用于无限滚动
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// 加载中状态
	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4"
				style={{
					backgroundImage:
						'radial-gradient(50% 50% at 95% 5%, #6366f1 0%, #4f46e5 70%, #1e1b4b 100%)',
				}}
			>
				<div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
					<div className="flex items-center justify-center space-x-2 text-white">
						<div
							className="w-4 h-4 bg-white rounded-full animate-bounce"
							style={{ animationDelay: '0ms' }}
						/>
						<div
							className="w-4 h-4 bg-white rounded-full animate-bounce"
							style={{ animationDelay: '150ms' }}
						/>
						<div
							className="w-4 h-4 bg-white rounded-full animate-bounce"
							style={{ animationDelay: '300ms' }}
						/>
						<span className="ml-2">加载中...</span>
					</div>
				</div>
			</div>
		);
	}

	// 错误状态
	if (isError) {
		return (
			<div
				className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4"
				style={{
					backgroundImage:
						'radial-gradient(50% 50% at 95% 5%, #ef4444 0%, #dc2626 70%, #450a0a 100%)',
				}}
			>
				<div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
					<div className="text-center text-white">
						<h2 className="text-2xl font-bold mb-4">出错了</h2>
						<p className="text-white/80">{(error as Error).message}</p>
					</div>
				</div>
			</div>
		);
	}

	// 所有数据
	const allUsers = data?.pages.flatMap((page) => page.users) ?? [];

	// 获取当前游标信息（用于展示）
	const currentCursor = data?.pages[data.pages.length - 1]?.nextCursor;

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4"
			style={{
				backgroundImage:
					'radial-gradient(50% 50% at 95% 5%, #6366f1 0%, #4f46e5 70%, #1e1b4b 100%)',
			}}
		>
			<div className="w-full max-w-2xl mx-auto p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
				<h1 className="text-2xl font-bold text-white mb-2">
					TanStack Query 无限查询示例
				</h1>
				<p className="text-white/70 mb-2">
					使用复合游标 (id + createdAt) 实现无限滚动
				</p>
				<p className="text-white/50 text-sm mb-6">
					游标类型:{' '}
					<code className="bg-white/10 px-1 rounded">
						{'{ id: number, createdAt: string }'}
					</code>
				</p>

				{/* 分页大小选择器 */}
				<div className="mb-6 bg-white/5 rounded-lg p-4 border border-white/10">
					<label className="text-white/70 text-sm mb-2 block">
						每页显示数量 (limit):
					</label>
					<div className="flex gap-2 flex-wrap">
						{[5, 10, 15, 20].map((size) => (
							<button
								key={size}
								onClick={() => handleLimitChange(size)}
								className={`px-4 py-2 rounded-lg border transition-colors ${
									limit === size
										? 'bg-indigo-500 border-indigo-400 text-white'
										: 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
								}`}
							>
								{size} 条
							</button>
						))}
					</div>
				</div>

				{/* 状态信息 */}
				<div className="mb-6 flex flex-wrap gap-2">
					<span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-sm border border-blue-400/30">
						状态: {status}
					</span>
					<span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-sm border border-purple-400/30">
						已加载页数: {data?.pages.length ?? 0}
					</span>
					<span className="px-3 py-1 rounded-full bg-green-500/30 text-green-200 text-sm border border-green-400/30">
						总用户数: {allUsers.length}
					</span>
					<span className="px-3 py-1 rounded-full bg-orange-500/30 text-orange-200 text-sm border border-orange-400/30">
						每页数量: {limit}
					</span>
					{hasNextPage && (
						<span className="px-3 py-1 rounded-full bg-yellow-500/30 text-yellow-200 text-sm border border-yellow-400/30">
							还有更多数据
						</span>
					)}
				</div>

				{/* 当前游标信息 */}
				{currentCursor && (
					<div className="mb-6 bg-white/5 rounded-lg p-3 border border-white/10">
						<p className="text-white/60 text-xs mb-1">当前游标 (Cursor):</p>
						<code className="text-white/80 text-xs font-mono">
							{'{ '} <span className="text-blue-300">id</span>:{' '}
							{currentCursor.id},{' '}
							<span className="text-green-300">createdAt</span>: "
							{new Date(currentCursor.createdAt).toLocaleString()}"{' }'}
						</code>
					</div>
				)}

				{/* 用户列表 */}
				<div className="space-y-3 mb-6">
					{allUsers.map((user, index) => (
						<div
							key={`${user.id}-${index}`}
							className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm shadow-md hover:bg-white/15 transition-colors"
						>
							<div className="flex items-center space-x-4">
								<img
									src={user.avatar}
									alt={user.name}
									className="w-12 h-12 rounded-full bg-white/20"
								/>
								<div className="flex-1 min-w-0">
									<h3 className="text-white font-semibold truncate">
										{user.name}
									</h3>
									<p className="text-white/60 text-sm truncate">{user.email}</p>
									<p className="text-white/40 text-xs mt-1">
										创建时间: {new Date(user.createdAt).toLocaleString()}
									</p>
								</div>
								<span className="text-white/40 text-xs flex-shrink-0">
									ID: {user.id}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* 加载更多区域 - 用于无限滚动检测 */}
				<div ref={loadMoreRef} className="text-center py-4">
					{isFetchingNextPage ? (
						<div className="flex items-center justify-center space-x-2 text-white">
							<div
								className="w-3 h-3 bg-white rounded-full animate-bounce"
								style={{ animationDelay: '0ms' }}
							/>
							<div
								className="w-3 h-3 bg-white rounded-full animate-bounce"
								style={{ animationDelay: '150ms' }}
							/>
							<div
								className="w-3 h-3 bg-white rounded-full animate-bounce"
								style={{ animationDelay: '300ms' }}
							/>
							<span className="ml-2 text-white/70">加载更多...</span>
						</div>
					) : hasNextPage ? (
						<button
							onClick={() => fetchNextPage()}
							className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors"
						>
							加载更多
						</button>
					) : (
						<p className="text-white/50">已加载全部数据</p>
					)}
				</div>
			</div>
		</div>
	);
}
