import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/tanstack-query')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
