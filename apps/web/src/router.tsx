import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
// You may need to install this package if you haven't already
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { ErrorCard } from './components/app/error';
import { NotFound } from './components/app/NotFound';
import { deLocalizeUrl, localizeUrl } from './paraglide/runtime';
import { routeTree } from './routeTree.gen';

export function getRouter() {
	const convexUrl = (import.meta as any).env.VITE_CONVEX_URL!;
	if (!convexUrl) {
		throw new Error('VITE_CONVEX_URL is not set');
	}
	const convexQueryClient = new ConvexQueryClient(convexUrl, {
		expectAuth: true,
	});
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	const router = createTanStackRouter({
		routeTree,
		context: { queryClient, convexQueryClient },
		// Paraglide URL rewrite docs: https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#rewrite-url
		// rewrite: {
		// 	input: ({ url }) => deLocalizeUrl(url),
		// 	output: ({ url }) => localizeUrl(url),
		// },
		
		defaultErrorComponent: ErrorCard,
		defaultNotFoundComponent: ({ isNotFound, routeId, data }) => <NotFound />,
		scrollRestoration: true,
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
	});

	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
