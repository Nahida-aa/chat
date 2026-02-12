'use client';

import { Badge } from '@/components/ui/badge';
import { useSocketIo } from '@/lib/ws/provider';

export const IOIndicator = () => {
  const { ioC, isConnected, transport } = useSocketIo();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback: Polling every 1s. transport: {transport} 
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live: Real-time updates. transport: {transport} {ioC?.io.engine.transport.name}
    </Badge>
  );
};
