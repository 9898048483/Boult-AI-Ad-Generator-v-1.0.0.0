export interface AdRecord {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
  aspectRatio: string;
  tags?: string[];
  layers?: any[];
}

export interface SessionRecord {
  id: string;
  activeAdId?: string;
  lastPrompt?: string;
  currentStep?: number;
  timestamp: number;
}

export interface PromptHistoryRecord {
  id: string;
  prompt: string;
  category: string;
  timestamp: number;
}

export interface SettingRecord {
  key: string;
  value: any;
  updatedAt: number;
}

export interface CanvasLayerRecord {
  id: string;
  adId: string;
  layers: any[];
  updatedAt: number;
}

const DB_NAME = 'BOULT_AI_AD_DB';
const DB_VERSION = 1;

class DBService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('ads')) {
          db.createObjectStore('ads', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('promptHistory')) {
          db.createObjectStore('promptHistory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('canvasLayers')) {
          db.createObjectStore('canvasLayers', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- Ads Store Operations ---
  public async saveAd(ad: AdRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('ads', 'readwrite');
      const store = tx.objectStore('ads');
      const req = store.put(ad);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAds(): Promise<AdRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('ads', 'readonly');
      const store = tx.objectStore('ads');
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as AdRecord[]) || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async getAd(id: string): Promise<AdRecord | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('ads', 'readonly');
      const store = tx.objectStore('ads');
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as AdRecord) || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteAd(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('ads', 'readwrite');
      const store = tx.objectStore('ads');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Sessions Store Operations ---
  public async saveSession(session: SessionRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      const req = store.put(session);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getSession(id: string): Promise<SessionRecord | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly');
      const store = tx.objectStore('sessions');
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as SessionRecord) || null);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Prompt History Operations ---
  public async addPromptHistory(prompt: string, category: string): Promise<void> {
    const db = await this.getDB();
    const record: PromptHistoryRecord = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      prompt,
      category,
      timestamp: Date.now(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('promptHistory', 'readwrite');
      const store = tx.objectStore('promptHistory');
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getPromptHistory(): Promise<PromptHistoryRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('promptHistory', 'readonly');
      const store = tx.objectStore('promptHistory');
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result as PromptHistoryRecord[]) || [];
        records.sort((a, b) => b.timestamp - a.timestamp);
        resolve(records);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // --- Settings Operations ---
  public async saveSetting(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    const record: SettingRecord = {
      key,
      value,
      updatedAt: Date.now(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('settings', 'readonly');
        const store = tx.objectStore('settings');
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.value !== undefined) {
            resolve(req.result.value as T);
          } else {
            resolve(defaultValue);
          }
        };
        req.onerror = () => resolve(defaultValue);
      });
    } catch {
      return defaultValue;
    }
  }

  // --- Canvas Layers Operations ---
  public async saveCanvasLayers(adId: string, layers: any[]): Promise<void> {
    const db = await this.getDB();
    const record: CanvasLayerRecord = {
      id: `layers_${adId}`,
      adId,
      layers,
      updatedAt: Date.now(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('canvasLayers', 'readwrite');
      const store = tx.objectStore('canvasLayers');
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getCanvasLayers(adId: string): Promise<any[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('canvasLayers', 'readonly');
        const store = tx.objectStore('canvasLayers');
        const req = store.get(`layers_${adId}`);
        req.onsuccess = () => {
          resolve(req.result ? req.result.layers : []);
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // --- Backup & Restore ---
  public async exportFullBackup(): Promise<string> {
    const ads = await this.getAds();
    const promptHistory = await this.getPromptHistory();
    const backupData = {
      version: 1,
      exportedAt: Date.now(),
      ads,
      promptHistory,
    };
    return JSON.stringify(backupData, null, 2);
  }

  public async importFullBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.ads)) {
        for (const ad of data.ads) {
          await this.saveAd(ad);
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  }
}

export const dbService = new DBService();
