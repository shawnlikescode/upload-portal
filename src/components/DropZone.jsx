import React, { useState } from 'react'
import Dropzone, { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

export const DropZone = ({
  field,
  form,
  droppedFiles,
  setDroppedFiles,
  loaded,
  setLoaded,
  setFileMetadata,
  fileMetadata,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState('block')
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    open,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDropAccepted: async (acceptedFiles) => {
      setDroppedFiles(() => {
        return [...droppedFiles, ...acceptedFiles]
      })
      await acceptedFiles.map((file) => toast.success(`${file.name} accepted`))
    },
    onDropRejected: (fileRejections) => {
      fileRejections.map(({ file, errors }) => {
        console.log(fileRejections)
        errors.map((e) => toast.error(`${file.name} rejected: ${e.code}`))
      })
    },
    onDrop: () => {
      if (acceptedFiles.length) setIsVisible('hidden')
      console.log(acceptedFiles)
    },
    noClick: true,
    accept: 'audio/wav, audio/x-wav'
  })
  return (
    <section className={`${isVisible}`}>
      <div className="h-full">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p className="font-medium font-mono">
            Drag and drop your tracks here
          </p>
          <button className="btn" onClick={open}>
            or choose files to upload
          </button>
        </div>
      </div>
    </section>
  )
}
