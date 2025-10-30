import { useState, useEffect, useRef } from 'react'
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import Clock from './components/Clock'
import WeatherPanel from './components/WeatherPanel'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [headerVisible, setHeaderVisible] = useState(true)
  const [footerVisible, setFooterVisible] = useState(false)
  const lastScrollY = useRef(0)
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('selectedLocation')
    return savedLocation ? JSON.parse(savedLocation) : null
  })
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })

  const addNote = (title, text) => {
    const trimmed = text.trim()
    const trimmedTitle = (title || '').trim()
    if (!trimmed) return
    const newNote = { id: Date.now(), title: trimmedTitle || 'Untitled', text: trimmed }
    setNotes(prev => [...prev, newNote])
  }

   useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset
      const scrollingUp = currentScrollY < lastScrollY.current
      const nearBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 100
      setHeaderVisible(scrollingUp || currentScrollY < 50)
      setFooterVisible(nearBottom)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
    localStorage.setItem('selectedLocation', JSON.stringify(newLocation))
  }

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

   useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error('Error fetching todos:', err)
    }
  }

   const addTodo = async (text, timerMinutes) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, timerMinutes })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const newTodo = await res.json()
      setTodos(prev => [...prev, newTodo])
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}/done`, { method: 'PUT' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  }

   const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

   return (
    <ErrorBoundary>
      <header className={`app-header ${headerVisible ? '' : 'header-hidden'}`}>
        <h1 className="app-title">My App</h1>
        <Clock />
      </header>

      <div className="app app-grid">
        <section className="panel todos-panel">
          <h2>Todo App</h2>
          <AddTodo onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </section>

        <section className="panel weather-panel">
          <WeatherPanel location={location} onLocationChange={handleLocationChange} />
        </section>

        <section className="panel bottom-left-panel">
          <h3>Notes</h3>
          <form
            className="notes-form"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const titleInput = form.elements.namedItem('noteTitle')
              const textInput = form.elements.namedItem('noteText')
              addNote(titleInput.value, textInput.value)
              titleInput.value = ''
              textInput.value = ''
            }}
          >
            <input
              type="text"
              name="noteTitle"
              className="note-title-input"
              placeholder="Title"
              maxLength={80}
            />
            <textarea
              name="noteText"
              className="note-input"
              placeholder="Write a note..."
              rows={3}
              required
            />
            <button type="submit" className="note-submit">Add Note</button>
          </form>
        </section>

         <section className="panel bottom-right-panel">
          <h3>Settings</h3>
          <div className="notes-grid">
            {notes.slice(-6).reverse().map(n => (
              <div key={n.id} className="note-card">
                <div className="note-card-title">{n.title || 'Untitled'}</div>
                <div className="note-card-body">{n.text}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className={`app-footer ${footerVisible ? 'footer-visible' : ''}`}>
        <span className="copyright">©</span> TEKKA DEVELOPERS LLC
      </footer>
    </ErrorBoundary>
  )
}

export default App