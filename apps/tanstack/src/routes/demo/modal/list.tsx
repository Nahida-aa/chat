import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/modal/list')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link
        to="/demo/modal/list/$id"
        params={{
          id: 'aa',
        }}
      >
        <Button>aa</Button>
      </Link>
      Hello "/demo/modal/list"!
    </div>
  );
}
