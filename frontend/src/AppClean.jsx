import { useState, useEffect, useRef } from 'react'
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import Clock from './components/Clock'
import WeatherPanel from './components/WeatherPanel'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

export default function App() {
  const [todos, setTodos] = useState([])
  const [headerVisible, setHeaderVisible] = useState(true)
  const [footerVisible, setFooterVisible] = useState(false)
  const lastScrollY = useRef(0)
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('selectedLocation')
    return savedLocation ? JSON.parse(savedLocation) : null
  })

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
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (text, timerMinutes) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, timerMinutes })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const newTodo = await response.json()
      setTodos(prev => [...prev, newTodo])
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}/done`, { method: 'PUT' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <ErrorBoundary>
      <header className={`app-header ${headerVisible ? '' : 'header-hidden'}`}>
        <h1 className="app-title">My App</h1>
        <Clock />
      </header>

      <div className="app grid-layout">
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
          <p className="notes-placeholder">Notes and quick links.</p>
        </section>

        <section className="panel bottom-right-panel">
          <h3>Settings</h3>
          <p className="settings-placeholder">App settings will appear here.</p>
        </section>
      </div>

      <footer className={`app-footer ${footerVisible ? 'footer-visible' : ''}`}>
        <span className="copyright">©</span> TEKKA DEVELOPERS LLC
      </footer>
    </ErrorBoundary>
  )
}
