import React, { useState, useEffect } from 'react'
import { InfoForm } from './InfoForm'
import { DropZone } from './DropZone'
import Dropzone, { useDropzone } from 'react-dropzone'

export default function FileForm() {
  const [droppedFiles, setDroppedFiles] = useState([])
  const [loaded, setLoaded] = useState(true)

  return (
    <section>
      <div className="col-span-4">
        {droppedFiles.length <= 0 ? (
          <div className="flex-grow">
            <DropZone
              droppedFiles={droppedFiles}
              setDroppedFiles={setDroppedFiles}
              loaded={loaded}
              setLoaded={setLoaded}
            />
          </div>
        ) : (
          <div>
            <button className="btn" onClick={() => location.reload()}>
              Reset
            </button>
            <div className="flex flex-row justify-evenly flex-wrap">
              {droppedFiles.map((file, i) => (
                <InfoForm
                  key={i}
                  className="flex-none"
                  index={i}
                  droppedFiles={droppedFiles}
                  setDroppedFiles={setDroppedFiles}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
