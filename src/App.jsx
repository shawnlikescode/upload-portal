import React from 'react'
import FileForm from './components/FileForm'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <main>
      <section className="container grid grid-flow-col mt-24 auto-cols-fr mx-auto h-screen bg-abbey">
        <FileForm />
        <Toaster />
      </section>
    </main>
  )
}

export default App
