import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/modal/list/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  console.log('/demo/modal/list/$id', id);
  return <div>Hello "/demo/modal/list/$id"! id: {id}</div>;
}
