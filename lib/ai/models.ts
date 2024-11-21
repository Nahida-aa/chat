// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description?: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    // description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    // description: "OpenAI's most advanced multimodal model in the GPT-4 famil Can handle both text and image inputs.",
  },
  {
    id: 'o1-mini',
    label: 'o1 mini',
    apiIdentifier: 'o1-mini',
  },
  {
    id: 'o1-preview',
    label: 'o1 preview',
    apiIdentifier: 'o1-preview',
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
