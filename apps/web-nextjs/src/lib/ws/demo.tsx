'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useSocketIo } from './provider';
// import cApi from "../../api/app/client";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import { IOIndicator } from '@/lib/ws/IOIndicator';
import { nanoid } from 'nanoid';
import type { DemoMessage } from '@/lib/ws/types';
import { testSendToAll } from '@/lib/ws/action';
import { Input } from '@/components/ui/input';


const Login = ({setUserId}: {setUserId: (id: string) => void}) => {
  const [value, setValue] = useState('');
  return <div  className='flex gap-2'><Input value={value} onChange={(e) => setValue(e.target.value)} /><Button onClick={() => setUserId(value)}>login</Button></div>
}
const ChatInput = () => {};
export const SocketIODemo = () => {
  const [userId, setUserId] = useLocalStorage('userId', '');
  const [channelId, setChannelId] = useLocalStorage('channelId', '');
  const { ioC, isConnected, transport } = useSocketIo();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // 监听消息和加入频道
  useEffect(() => {
    if (!ioC || !isConnected) return;
    ioC.onAny((event, data) => {
      console.log({ event, data });
    });
    ioC.on('demoMsg', (data) => {
      setMessages((prev) => [...prev, data]);
    })
    // 加入频道
    // if (isAnonymous) {
    //   sendData({
    //     op: "joinChannel",
    //     d: {
    //       channelId,
    //       userId,
    //     },
    //   });
    // }

    // 监听新消息
    return () => {
      ioC.off('demoMsg');
    }
  }, [ioC, isConnected, userId, channelId]);

  const handleSendMessage = async () => {
    if (!content.trim()) return;

    try {
      setIsSending(true);
      const message: DemoMessage = {
        id: nanoid(),
        channelId,
        userId,
        content,
        createdAt: new Date(),
      };

      // 通过 HTTP API 通知服务端 广播消息
      const ok = await testSendToAll(message);
      // const { data, error } = await cApi.channel.channel.message.$post(message);
      // const ret = await cApi.sendChannelMessage(message);
      if (!ok) {
        toast.error('server not find io');
        return;
      }
      toast.success(`Message sent: ${ok}`);
      setContent('');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-4 space-y-4">
      <IOIndicator />
      <div className="w-full max-w-md">
        <div>
          {userId ? <p>User ID: {userId}</p>: <Login setUserId={setUserId} />}
          <p>Channel ID: {channelId}</p>
          <p>Messages: {messages.length}</p>
        </div>

        {/* 消息列表 */}
        <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2 p-2 bg-gray-100 rounded">
              <strong>{msg.userId}:</strong> {msg.content}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-500">No messages yet...</p>
          )}
        </div>

        {/* 输入框 */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded"
            onClick={(e) => handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !content.trim()}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </main>
  );
};
