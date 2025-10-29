import { useEffect, useState } from 'react'

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

function formatRemaining(expiresAt) {
  const diff = Math.max(0, new Date(expiresAt) - Date.now())
  const total = Math.floor(diff / 1000)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function TodoList({ todos, onToggle, onDelete }) {
  const [nowTick, setNowTick] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (todos.length === 0) {
    return <p className="empty-list">No todos yet. Add one above!</p>
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
              />
              <div>
                <div className="todo-text">{todo.text}</div>
                <div className="todo-meta">Created: {formatDate(todo.created)}
                {todo.timer ? (
                  <span> • Timer: {formatRemaining(todo.timer.expiresAt)}</span>
                ) : null}
                </div>
              </div>
            </label>
          </div>
          <button 
            onClick={() => onDelete(todo.id)}
            className="delete-btn"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList