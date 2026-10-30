import fs from 'fs';
import path from 'path';
import { defaultDatabase, DatabaseSchema } from './defaultData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          ...defaultDatabase,
          ...parsed,
          branding: { ...defaultDatabase.branding, ...(parsed.branding || {}) },
          theme: { ...defaultDatabase.theme, ...(parsed.theme || {}) },
          homepage: { ...defaultDatabase.homepage, ...(parsed.homepage || {}) },
          statistics: { ...defaultDatabase.statistics, ...(parsed.statistics || {}) },
          siteVisibility: {
            ...defaultDatabase.siteVisibility,
            ...(parsed.siteVisibility || {}),
            pages: { ...defaultDatabase.siteVisibility.pages, ...(parsed.siteVisibility?.pages || {}) },
            sections: { ...defaultDatabase.siteVisibility.sections, ...(parsed.siteVisibility?.sections || {}) },
            maintenanceSettings: { ...defaultDatabase.siteVisibility.maintenanceSettings, ...(parsed.siteVisibility?.maintenanceSettings || {}) },
          },
          customLandingSections: Array.isArray(parsed.customLandingSections)
            ? parsed.customLandingSections
            : defaultDatabase.customLandingSections,
          customPages: Array.isArray(parsed.customPages)
            ? parsed.customPages
            : defaultDatabase.customPages,
          roles: Array.isArray(parsed.roles) ? parsed.roles : defaultDatabase.roles,
          users: Array.isArray(parsed.users) ? parsed.users : defaultDatabase.users,
        };
      }
    } catch (err) {
      console.error('Failed to load database.json, initializing default:', err);
    }

    this.save(defaultDatabase);
    return JSON.parse(JSON.stringify(defaultDatabase));
  }

  public save(newData?: DatabaseSchema): void {
    if (newData) {
      this.data = newData;
    }
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database.json:', err);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public update<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]): DatabaseSchema[K] {
    this.data[key] = value;
    this.save();
    return this.data[key];
  }

  public reset(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(defaultDatabase));
    this.save();
    return this.data;
  }
}

export const db = new DatabaseService();
