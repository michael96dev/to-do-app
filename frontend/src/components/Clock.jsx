import { useEffect, useState } from 'react'

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now.toLocaleDateString()
  const timeStr = now.toLocaleTimeString()

  return (
    <div className="top-clock">
      <div className="date">{dateStr}</div>
      <div className="time">{timeStr}</div>
    </div>
  )
}

export default Clock
