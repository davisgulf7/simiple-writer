
import { UserSettings } from './settingsManager';

export interface FileMetadata {
    id: string;
    name: string;
    lastModified: number;
    type: 'html' | 'json'; // Internal HTML or Native JSON
}

export interface FileContent {
    id: string;
    content: string; // HTML content
    settings?: UserSettings; // Optional saved settings for this file
}

const STORAGE_PREFIX = 'clickit_file_';
const METADATA_KEY = 'clickit_file_list';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const listFiles = (): FileMetadata[] => {
    try {
        const list = localStorage.getItem(METADATA_KEY);
        return list ? JSON.parse(list) : [];
    } catch (e) {
        console.error("Failed to list files", e);
        return [];
    }
};

export const saveFile = (name: string, content: string, settings?: UserSettings, existingId?: string): FileMetadata => {
    const list = listFiles();
    const id = existingId || generateId();
    const now = Date.now();

    // Create/Update Metadata
    const metadata: FileMetadata = {
        id,
        name,
        lastModified: now,
        type: 'html'
    };

    // Update List
    const newList = existingId
        ? list.map(f => f.id === id ? { ...f, name, lastModified: now } : f)
        : [...list, metadata];

    localStorage.setItem(METADATA_KEY, JSON.stringify(newList));

    // Save Content
    const fileData: FileContent = {
        id,
        content,
        settings
    };
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(fileData));

    return metadata;
};

export const loadFile = (id: string): FileContent | null => {
    try {
        const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Failed to load file", e);
        return null;
    }
};

export const deleteFile = (id: string): void => {
    const list = listFiles();
    const newList = list.filter(f => f.id !== id);
    localStorage.setItem(METADATA_KEY, JSON.stringify(newList));
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
};

export const renameFile = (id: string, newName: string): void => {
    const list = listFiles();
    const newList = list.map(f => f.id === id ? { ...f, name: newName } : f);
    localStorage.setItem(METADATA_KEY, JSON.stringify(newList));
};
