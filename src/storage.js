import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORAGE_FILE = '../data/todos.json';

/**
 * Storage class handles all file operations for todos
 * Uses JSON file for persistence with proper error handling
 */
export class Storage {
    constructor(filePath = STORAGE_FILE) {
        this.filePath = new URL(filePath, import.meta.url);
    }

    /**
     * Initialize storage - creates data directory and empty todos file if needed
     */
    async init() {
        try {
            // Convert file URL to a filesystem path before calling path.dirname
            const dirPath = dirname(fileURLToPath(this.filePath));
            await fs.mkdir(dirPath, { recursive: true });
            try {
                await fs.access(this.filePath);
            } catch {
                await fs.writeFile(this.filePath, '[]');
            }
        } catch (err) {
            throw new Error(`Failed to initialize storage: ${err.message}`);
        }
    }

    /**
     * Read all todos from storage
     * @returns {Promise<Array>} List of todo items
     */
    async readTodos() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await this.init();
                return [];
            }
            throw new Error(`Failed to read todos: ${err.message}`);
        }
    }

    /**
     * Write todos to storage
     * @param {Array} todos List of todo items to save
     */
    async writeTodos(todos) {
        try {
            await fs.writeFile(
                this.filePath,
                JSON.stringify(todos, null, 2)
            );
        } catch (err) {
            throw new Error(`Failed to write todos: ${err.message}`);
        }
    }
}