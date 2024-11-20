import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';
import { SparklesIcon } from 'lucide-react';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <SparklesIcon size={32} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          以 chatbot{' '}
          为基础的 AI 应用聚合平台。目前仅实现 chatbot 部分使用 Next.js 和 Vercel 的 AI SDK 构建。
          它在服务器端使用 {' '}
          <code className="rounded-md bg-muted px-1 py-0.5">streamText</code>{' '}
          函数，在客户端使用{' '}
          <code className="rounded-md bg-muted px-1 py-0.5">useChat</code>{' '}
          钩子，创建了一个无缝的聊天体验。
        </p>
        <p>
          您可以通过访问{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            文档
          </Link>{' '}
          来了解更多关于 AI SDK 的信息。
        </p>
      </div>
    </motion.div>
  );
};
