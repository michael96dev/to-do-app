import express from 'express';
import cors from 'cors';
import { TodoList } from './todoList.js';

const app = express();
const port = 3001;
const todoList = new TodoList();

app.use(cors());
app.use(express.json());

// Initialize storage
await todoList.init();

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await todoList.list();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new todo
// Create new todo (optional timerMinutes in body)
app.post('/api/todos', async (req, res) => {
  try {
    const { text, timerMinutes } = req.body;
    const minutes = typeof timerMinutes === 'number' ? timerMinutes : (timerMinutes ? Number(timerMinutes) : undefined);
    const todo = await todoList.add(text, minutes);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark todo as done
app.put('/api/todos/:id/done', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await todoList.done(id);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await todoList.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});