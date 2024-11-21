import { createOpenAI } from '@ai-sdk/openai'
const openai_default_baseURL = "https://api.openai.com/v1"
const openai_github_baseURL = "https://models.inference.ai.azure.com"
const github_token = process.env.GITHUB_TOKEN
const openai = createOpenAI({
  // custom settings, e.g.
  // compatibility: 'strict', // strict mode, enable when using the OpenAI API
  baseURL: openai_github_baseURL, apiKey: github_token
});
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
