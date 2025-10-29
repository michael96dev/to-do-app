import { TodoList } from './todoList.js';

const COMMANDS = {
    add: 'add <text>     Add a new todo',
    list: 'list          Show all todos',
    done: 'done <id>     Mark a todo as completed',
    delete: 'delete <id>  Delete a todo'
};

/**
 * Print usage instructions
 */
function printHelp() {
    console.log('Usage: npm start <command>\n');
    console.log('Commands:');
    Object.values(COMMANDS).forEach(cmd => console.log(`  ${cmd}`));
}

/**
 * Format a todo for display
 */
function formatTodo(todo) {
    const status = todo.done ? '[✓]' : '[ ]';
    return `${status} ${todo.id}. ${todo.text}`;
}

async function main() {
    const todoList = new TodoList();
    await todoList.init();

    const [command, ...args] = process.argv.slice(2);

    try {
        switch (command) {
            case 'add':
                const text = args.join(' ');
                const todo = await todoList.add(text);
                console.log(`Added: ${formatTodo(todo)}`);
                break;

            case 'list':
                const todos = await todoList.list();
                if (todos.length === 0) {
                    console.log('No todos yet');
                    break;
                }
                todos.forEach(todo => console.log(formatTodo(todo)));
                break;

            case 'done':
                const doneId = parseInt(args[0], 10);
                await todoList.done(doneId);
                console.log(`Marked #${doneId} as done`);
                break;

            case 'delete':
                const deleteId = parseInt(args[0], 10);
                await todoList.delete(deleteId);
                console.log(`Deleted #${deleteId}`);
                break;

            default:
                printHelp();
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();