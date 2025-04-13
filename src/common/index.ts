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

// interface Plugin {
//   id: string;
//   name: string;
//   label: string;
//   type: string;
//   description: string;
// }

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

export async function load() {
  const loadJsonFiles = async (
    folderPath: string,
    cache: NodeCache,
    keyField: string = 'id',
  ) => {
    const files = await readdir(folderPath);

    for (const file of files) {
      const fullPath = join(folderPath, file);
      if (!file.endsWith('.json')) continue;

      try {
        const content = await readFile(fullPath, 'utf-8');
        if (!content.trim()) {
          console.warn(`[SKIP] ${file} is empty.`);
          continue;
        }

        let data: any;
        try {
          data = JSON.parse(content);
        } catch (err) {
          console.warn(`[SKIP] ${file} is not valid JSON.`, err.message);
          continue;
        }

        if (!data || Object.keys(data).length === 0) {
          console.warn(`[SKIP] ${file} contains no usable data.`);
          continue;
        }

        if (!data[keyField]) {
          console.warn(`[SKIP] ${file} missing "${keyField}" field.`);
          continue;
        }

        cache.set(data[keyField], data);
      } catch (err) {
        console.error(`[ERROR] Failed to process file: ${file}`, err);
      }
    }
  };

  await loadJsonFiles(join(__dirname, 'templates'), BuiltInCache.templates);
  await loadJsonFiles(join(__dirname, 'plugins'), BuiltInCache.plugins, 'id');
}
