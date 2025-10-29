## Quick orientation for AI agents

This is a lightweight to-do app focused on lean, quickly executable code. The implementation uses Node.js for simplicity and quick startup.

Key principles:
- Minimal dependencies - prefer native Node.js modules where possible
- Single responsibility files - each component does one thing well
- Local storage first - start with file-based storage, can evolve later
- Fast startup time - avoid heavy frameworks initially

Project structure to create:
```
src/
  index.js         # Entry point and CLI handling
  storage.js       # Data persistence (start with JSON file)
  todoList.js      # Core todo list operations
  validators.js    # Input validation helpers
tests/
  todo.test.js     # Core functionality tests
package.json       # Minimal deps: just testing framework
```

Required scripts in package.json:
```json
{
  "start": "node src/index.js",
  "test": "node --test tests/"
}
```

Development workflow:
1. Install only: `npm install`
2. Run app: `npm start`
3. Run tests: `npm test`

Core features to implement first:
- Add todo: `npm start add "Buy milk"`
- List todos: `npm start list`
- Complete todo: `npm start done 1`
- Delete todo: `npm start delete 1`

Storage convention:
- Todos stored in `data/todos.json`
- Format: `[{id: number, text: string, done: boolean, created: string}]`

Testing approach:
- Use Node's built-in test runner
- Focus on core todo operations
- Mock file system in tests

Next steps for AI agents:
1. Create package.json with minimal test dependency
2. Implement core files in src/ following structure above
3. Add basic CLI parsing in index.js
4. Add storage with local JSON file
5. Write tests for core operations

Update this file when adding:
- New CLI commands
- Additional storage options
- External integrations
- New test patterns

Keep the implementation lean and focused on working code rather than extensive configurations.
