import { useState } from 'react'

function AddTodo({ onAdd }) {
  const [text, setText] = useState('')
  const [timer, setTimer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const minutes = timer ? Number(timer) : undefined
    onAdd(text, minutes)
    setText('')
    setTimer('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <input
        type="number"
        min="1"
        value={timer}
        onChange={(e) => setTimer(e.target.value)}
        placeholder="Timer (minutes)"
        style={{ width: '140px' }}
      />
      <button type="submit">Add</button>
    </form>
  )
}

export default AddTodo