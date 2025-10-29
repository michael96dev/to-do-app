import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TodoList } from '../src/todoList.js';

test('TodoList operations', async (t) => {
    await t.test('should add a todo', async () => {
        const list = new TodoList();
        await list.init();
        
        const todo = await list.add('Test todo');
        assert.equal(todo.text, 'Test todo');
        assert.equal(todo.done, false);
        assert.equal(todo.id, 1);
    });

    await t.test('should list todos', async () => {
        const list = new TodoList();
        await list.init();
        
        await list.add('First todo');
        await list.add('Second todo');
        const todos = await list.list();
        
        assert.equal(todos.length, 2);
        assert.equal(todos[0].text, 'First todo');
        assert.equal(todos[1].text, 'Second todo');
    });

    await t.test('should mark todo as done', async () => {
        const list = new TodoList();
        await list.init();
        
        await list.add('Test todo');
        const updated = await list.done(1);
        
        assert.equal(updated.done, true);
    });

    await t.test('should delete todo', async () => {
        const list = new TodoList();
        await list.init();
        
        await list.add('Test todo');
        await list.delete(1);
        const todos = await list.list();
        
        assert.equal(todos.length, 0);
    });
});