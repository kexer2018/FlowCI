import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import NodeCache = require('node-cache');

interface Stage {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string;
  stepGroups: StepGroups[];
}

interface StepGroups {
  steps: Step[];
}

interface Step {
  id: string;
  name: string;
  params: Param[];
  script: string;
  condition?: string;
}

interface Param {
  key: string;
  value: string;
}

interface Plugin {
  id: string;
  name: string;
  label: string;
  type?: string;
  description: string;
  params: Param[];
  script?: string;
}

export interface Template {
  id: string;
  name: string;
  label: string;
  type: string;
  description: string;
  stages: Stage[];
}

export const BuiltInCache = {
  plugins: new NodeCache({ stdTTL: 0, checkperiod: 600 }),
  templates: new NodeCache({ stdTTL: 0, checkperiod: 600 }),
};

async function loadJsonFiles<T>(
  folderPath: string,
  cache: NodeCache,
  keyField: string = 'id',
): Promise<void> {
  const files = await readdir(folderPath);
  let loadedCount = 0;

  const logSkip = (file: string, reason: string) =>
    console.warn(`[SKIP] ${file} - ${reason}`);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const fullPath = join(folderPath, file);

    let content: string;
    try {
      content = await readFile(fullPath, 'utf-8');
    } catch (err) {
      console.error(`[ERROR] Failed to read file: ${file}`, err);
      continue;
    }

    if (!content.trim()) {
      logSkip(file, 'file is empty');
      continue;
    }

    let data: T;
    try {
      data = JSON.parse(content);
    } catch (err: any) {
      logSkip(file, `invalid JSON: ${err.message}`);
      continue;
    }

    const id = data?.[keyField];
    if (!id || typeof id !== 'string') {
      logSkip(file, `missing or invalid "${keyField}" field`);
      continue;
    }
    cache.set(id, data);
    loadedCount++;
  }
  console.log(`[INFO] Loaded ${loadedCount} entries from ${folderPath}`);
}

export async function load(): Promise<void> {
  const base = __dirname;
  await loadJsonFiles<Template>(
    join(base, 'templates'),
    BuiltInCache.templates,
  );
  await loadJsonFiles<Plugin>(join(base, 'plugins'), BuiltInCache.plugins);
}
