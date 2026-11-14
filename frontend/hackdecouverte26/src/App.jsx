import { useState } from 'react'
import Event from './components/layout/event/event'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className='flex min-h-screen justify-center items-center'>
        <Event startTime={12} endTime={13} dayStart={8} dayEnd={20}></Event>
      </section>
    </>
  )
}

export default App
