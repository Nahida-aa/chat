'use client';

import { useDemo } from '@/app/demo/react/provider/provider';

export default function Page() {
  console.log("'.../app/demo/react/provider/page.tsx'");
  const { isConnected, transport } = useDemo();
  return (
    <div>
      {isConnected ? 'Connected' : 'Not connected'} transport: {transport}
    </div>
  );
}
