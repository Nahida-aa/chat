import {
	ClientOnly,
	Link,
	type LinkOptions,
	type RegisteredRouter,
} from '@tanstack/react-router';
import { ChevronRight, FileIcon, Folder } from 'lucide-react';
import BetterAuthHeader, {
	BetterAuthHeaderLoading,
} from '#/components/app/header-user';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '#/components/ui/collapsible';
import { Separator } from '#/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from '#/components/ui/sidebar';
import { cn } from '#/lib/utils';
import ParaglideLocaleSwitcher from '../LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

// 叶子节点
type NavLeafNode = {
	title: string;
	link: LinkOptions<RegisteredRouter>['to'];
	params?: LinkOptions<RegisteredRouter>['params'];
	children?: undefined;
};
type NavNode = {
	title: string;
	children: NavLeafNode[];
};
// 深度
type DemoNav = NavLeafNode | NavNode;
function Tree({ item, depth = 0 }: { item: DemoNav; depth?: number }) {
	if (!item?.children) {
		return (
			<SidebarMenuButton asChild>
				<Link
					to={item.link!}
					params={item.params}
					className={`rounded-none $ px-${2 + 6 * depth}`}
				>
					<FileIcon />
					{item.title}
				</Link>
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton className={`rounded-none px-${2 + 6 * depth}`}>
						<ChevronRight className="transition-transform" />
						<Folder />
						{item.title}
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent className="relative">
					<Separator
						orientation="vertical"
						className={cn(`absolute bg-accent-foreground z-1`)}
						style={{
							left: `${1 + 1.5 * depth}rem`, // 直接用 inline style，最可靠
						}}
					/>
					<SidebarMenuSub className="border-0 m-0 p-0">
						{item.children.map((child) => (
							<Tree key={child.title} item={child} depth={depth + 1} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}

function flattenItems(nodes: DemoNav[]): DemoNav[] {
	const result: DemoNav[] = [];

	function walk(items: DemoNav[]) {
		for (const item of items) {
			if (item.children) {
				walk(item.children);
			} else if (item.link) {
				result.push(item);
			}
		}
	}

	walk(nodes);
	return result;
}
export function AppSidebar() {
	const items: DemoNav[] = [
		{
			title: '集成', // integrations
			children: [
				// {
				// 	title: 'Neon',
				// 	link: '/demo/integration/neon',
				// },
				// {
				// 	title: 'Drizzle',
				// 	link: '/demo/integration/drizzle',
				// },
				{
					title: 'I18n example',
					link: '/demo/integration/i18n',
				},
				// {
				// 	title: 'TanStack Table',
				// 	link: '/demo/table',
				// },
				{
					title: 'TanStack Store',
					link: '/demo/integration/store',
				},
				{
					title: 'Better Auth',
					link: '/demo/integration/better-auth',
				},
				{
					title: 'Better Auth (openapi)',
					link: '/api/auth/$',
					params: { _splat: 'reference' },
				},
				// {
				// 	title: 'oRPC Todo',
				// 	link: '/demo/orpc_todo',
				// },
				// {
				// 	title: 'oRPC Batch',
				// 	link: '/demo/orpc_batch',
				// },
				{
					title: 'openapi(by orpc)',
					link: '/api/$',
				},
				// {
				// 	title: 'TanStack Query',
				// 	link: '/demo/rq',
				// },
				// {
				// 	title: 'TanStack Query (Suspense)',
				// 	link: '/demo/rq_suspense',
				// },
				// {
				// 	link: '/demo/hook/useResizeObserver',
				// },
				// { link: '/demo/ui/stackModal' },
				{
					title: 'Simple Form',
					link: '/demo/integration/form/simple',
				},
				{
					title: 'Address Form',
					link: '/demo/integration/form/address',
				},
			],
		},

		{
			title: 'UI',
			children: [
				{
					title: 'Action',
					children: [
						{
							title: 'Button',
							link: '/demo/ui/action/button',
						},
					],
				},
			],
		},
	] as DemoNav[];
	return (
		<Sidebar mobileWidth="18rem">
			<SidebarHeader>
				<nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
					<div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
						<Link
							to="/"
							className="nav-link"
							activeOptions={{ exact: true }} // 要求精确匹配
							activeProps={{ className: 'nav-link is-active' }}
						>
							Home
						</Link>
						<a
							href="https://tanstack.com/start/latest/docs/framework/react/overview"
							className="nav-link"
							target="_blank"
							rel="noreferrer"
						>
							Docs
						</a>
						<details className="relative w-full sm:w-auto">
							<summary className="nav-link list-none cursor-pointer">
								Demos
							</summary>
							<div className="mt-2 min-w-56 rounded-xl border border-(--line) bg-(--header-bg) p-2 shadow-lg sm:absolute z-50">
								{flattenItems(items).map(
									(item) =>
										!item.children && (
											<Link
												key={item.link}
												to={item.link}
												params={item.params}
												className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
											>
												{item.title || item?.link?.replace('/demo/', '')}
											</Link>
										),
								)}
							</div>
						</details>
					</div>
				</nav>
			</SidebarHeader>
			<SidebarContent className="max-w-full overflow-hidden">
				{items.map((item) => (
					<Tree key={item.title} item={item} />
				))}
				{/* <SidebarGroup />
				<SidebarGroup /> */}
			</SidebarContent>
			<SidebarFooter>
				<ParaglideLocaleSwitcher />
				<ClientOnly fallback={<BetterAuthHeaderLoading />}>
					<BetterAuthHeader />
				</ClientOnly>

				<ThemeToggle />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
