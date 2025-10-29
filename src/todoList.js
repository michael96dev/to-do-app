import { Storage } from './storage.js';

export class TodoList {
    constructor() {
        this.storage = new Storage();
    }

    /**
     * Initialize the todo list and ensure storage is ready
     */
    async init() {
        await this.storage.init();
    }

    /**
     * Add a new todo item
     * @param {string} text The todo item text
     * @returns {Promise<object>} The created todo item
     */
    /**
     * Add a new todo item
     * @param {string} text The todo item text
     * @param {number} [timerMinutes] Optional timer in minutes for the todo
     * @returns {Promise<object>} The created todo item
     */
    async add(text, timerMinutes) {
        if (!text || typeof text !== 'string') {
            throw new Error('Todo text is required');
        }

        const todos = await this.storage.readTodos();
        const newTodo = {
            id: todos.length + 1,
            text: text.trim(),
            done: false,
            created: new Date().toISOString(),
            // timer: { minutes, expiresAt } or null
            timer: null
        };

        if (typeof timerMinutes === 'number' && timerMinutes > 0) {
            const expiresAt = new Date(Date.now() + timerMinutes * 60000).toISOString();
            newTodo.timer = {
                minutes: timerMinutes,
                expiresAt
            };
        }

        todos.push(newTodo);
        await this.storage.writeTodos(todos);
        return newTodo;
    }

    /**
     * List all todos
     * @returns {Promise<Array>} List of all todos
     */
    async list() {
        return await this.storage.readTodos();
    }

    /**
     * Mark a todo as done
     * @param {number} id Todo ID to mark as done
     * @returns {Promise<object>} Updated todo item
     */
    async done(id) {
        const todos = await this.storage.readTodos();
        const index = todos.findIndex(todo => todo.id === id);
        
        if (index === -1) {
            throw new Error(`Todo with id ${id} not found`);
        }

        todos[index].done = true;
        await this.storage.writeTodos(todos);
        return todos[index];
    }

    /**
     * Delete a todo
     * @param {number} id Todo ID to delete
     * @returns {Promise<void>}
     */
    async delete(id) {
        const todos = await this.storage.readTodos();
        const index = todos.findIndex(todo => todo.id === id);
        
        if (index === -1) {
            throw new Error(`Todo with id ${id} not found`);
        }

        todos.splice(index, 1);
        // Reindex remaining todos
        todos.forEach((todo, i) => todo.id = i + 1);
        await this.storage.writeTodos(todos);
    }
}