import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import toast from 'react-hot-toast'
import axios from 'axios'

export const InfoForm = ({
  droppedFiles,
  index,
  loaded,
  setDroppedFiles,
  ...props
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [genres, setGenres] = useState([])
  const [isLocked, setLocked] = useState(false)
  const [status, setStatus] = useState({
    uploading: false,
    success: false,
    error: false
  })

  const TagInput = ({ field, form, ...props }) => {
    const autoSuggestRenderInput = ({ addTag, ...props }) => {
      const handleOnChange = (e, { newValue, method }) => {
        if (method == 'enter' || method == 'space') {
          e.preventDefault()
        } else {
          props.onChange(e)
        }
      }
      let tags = []
      if (suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
          tags.push(suggestions[i].name)
        }
      }

      const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
      const inputLength = inputValue.length

      let testTags = ['Building', 'Suspense', 'Grand']

      let suggest = testTags.filter((suggestion) => {
        return suggestion.toLowerCase().slice(0, inputLength) === inputValue
      })

      return (
        <Autosuggest
          ref={props.ref}
          suggestions={suggest}
          shouldRenderSuggestions={(value) => value && value.trim().length > 0}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => <span>{suggestion}</span>}
          inputProps={{ ...props, onChange: handleOnChange }}
          onSuggestionSelected={(e, { suggestion }) => {
            addTag(suggestion)
          }}
          onSuggestionsClearRequested={() => {}}
          onSuggestionsFetchRequested={() => {}}
        />
      )
    }
    return (
      <TagsInput renderInput={autoSuggestRenderInput} {...field} {...props} />
    )
  }

  useEffect(() => {
    setSuggestions(['Building', 'Suspense', 'Grand'])
  }, [droppedFiles, loaded])

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const upload = (formData, formikHelpers) => {
    setLocked(true)
    const file = formData.files[index]
    let name
    if (formData.name) {
      name = formData.name
    } else {
      name = file.name.split('.')[0]
    }
    console.log(name)
    console.log('FD', formData)
    const urlQuery = axios
      .post('#', {
        name: name + '.' + file.name.split('.')[1],
        type: '.' + file.name.split('.')[1]
      })
      .then((urlQuery) => {
        console.log(urlQuery)
        const uploadFile = fetch(urlQuery.data.signedURL, {
          method: 'PUT',
          body: file
        })
        toast.promise(
          uploadFile,
          {
            loading: () => {
              sleep(1000).then(setStatus({ ...status, uploading: true }))
              return `Uploading ${file.name}`
            },
            success: (data) => {
              sleep(5000).then(
                setStatus({ ...status, uploading: false, success: true })
              )
              const transcode = axios.post('#', {
                tags: formData.tags,
                genre: formData.genre,
                name: name,
                type: '.' + file.name.split('.')[1],
                artistName: formData.artistName
              })
              toast.promise(
                transcode,
                {
                  loading: 'transcoding...',
                  success: (data) =>
                    `Success! ${file.name} has been transcoded`,
                  error: (err) => {
                    setLocked(false)
                    return `This just happened: ${err.toString()}`
                  }
                },
                {
                  style: {
                    minWidth: '250px'
                  },
                  success: {
                    duration: 5000,
                    icon: '🔥'
                  }
                }
              )
              return `Success! ${file.name} uploaded`
            },
            error: (err) => {
              sleep(5000).then(
                setStatus({ ...status, uploading: false, error: true })
              )
              setLocked(false)
              return `This just happened: ${err.toString()}`
            }
          },
          {
            style: {
              minWidth: '250px'
            },
            success: {
              duration: 10000,
              icon: '🔥'
            },
            id: file.name
          }
        )
      })
      .catch()
    console.log(urlQuery)
    toast.promise(
      urlQuery,
      {
        loading: 'Fetching signed url',
        success: 'Preparing to upload',
        error: (err) => {
          setLocked(false)
          return `This just happened: ${err.toString()}`
        }
      },
      { id: file.name }
    )
  }

  const validate = (values) => {
    return sleep(1000).then(() => {
      const errors = {}
      if (values.genre.length === 0) {
        errors.genre = 'A genre is required.'
      }
      if (values.tags.length === 0) {
        errors.tags = 'At least one tag is required.'
      }
      return errors
    })
  }

  return (
    <section className="col-span-2">
      <Formik
        initialValues={{
          files: [...droppedFiles],
          tags: [],
          name: '',
          artistName: '',
          genre: '',
          desc: ''
        }}
        onSubmit={upload}
        validate={validate}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          resetForm,
          values,
          errors,
          touched,
          initialErrors,
          initialTouched,
          isInitialValid,
          setSubmitting,
          setFieldTouched,
          isSubmitting,
          dirty,
          ...props
        }) => (
          <Form>
            <div className="space-y-5 border rounded p-5 my-5 w-min">
              <h5 className="text-left text-parchment mt-3 mb-3 font-semibold">
                {`${values.files[index].name}`}
                {status.uploading ? (
                  <span className="ml-5 text-blue-500">Uploading...</span>
                ) : status.success ? (
                  <span className="ml-5 text-green-500">
                    Successfully uploaded
                  </span>
                ) : status.error ? (
                  <span className="ml-5 text-red-500">Failed to upload</span>
                ) : null}
              </h5>
              <div className="block">
                <div className="flex space-x-4">
                  <div>
                    <Field
                      className="inline-block border p-1 w-32 h-10 rounded"
                      name="name"
                      placeholder={values.files[index].name}
                    />
                  </div>
                  <div>
                    <Field
                      className="inline-block border w-42 p-1 h-10 rounded"
                      name="artistName"
                      placeholder={
                        values.files[index].artist || "Enter the artist's name"
                      }
                    />
                  </div>
                  <div>
                    <Field
                      className="inline-block border p-1 h-10 w-auto rounded"
                      as="select"
                      name="genre"
                      placeholder="Enter a Genre"
                    >
                      <option value="" disabled defaultValue hidden>
                        Select a genre
                      </option>
                      <option>a</option>
                      <option>b</option>
                      <option>c</option>
                      <option>d</option>
                    </Field>
                    {touched.genre && errors.genre && (
                      <div className="text-red-500 text-sm">{errors.genre}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="block">
                <Field
                  name="tags"
                  onlyUnique={true}
                  addOnPaste={true}
                  component={TagInput}
                  value={values.tags}
                  addKeys={[9, 13, 32]}
                  onChange={(tags, e) => {
                    setFieldTouched('tags', true, true)
                    setFieldValue('tags', tags)
                  }}
                />
                {touched.tags && errors.tags && (
                  <div className="text-red-500 text-sm">{errors.tags}</div>
                )}
              </div>
              <div className="block">
                {!isLocked ? (
                  <button
                    name="submit"
                    type="button"
                    className="btn w-full mt-5"
                    onClick={() => {
                      handleSubmit()
                      if (!errors) {
                        setSubmitting(true)
                        resetForm()
                      }
                    }}
                    disabled={isLocked}
                  >
                    Upload This Track
                  </button>
                ) : (
                  <button
                    name="submit"
                    type="button"
                    className="btn-disabled w-full mt-5"
                    disabled
                  >
                    Submitted
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  )
}
