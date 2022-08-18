import { useState } from 'react'
import { GgjEditor } from './commons'
import {
  handleReplaceImageInEditor,
  validateEditorHTML,
  uploadImages,
} from '../common/replaceImageEdior'
// import { useTranslation } from 'next-i18next'

// const nsTran = 'common@editor'

const toolbar = [
  ['font', ['bold', 'italic', 'underline', 'strikethrough']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['insert', ['link']],
  ['misc', ['undo', 'redo']],
  ['countbutton', ['countText']],
]
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Form() {
  // const { t } = useTranslation(nsTran)

  const [content1, setContent1] = useState()
  const [content2, setContent2] = useState()
  const handleSetContent1 = (content: any) => {
    setContent1(content)
  }
  const handleSetContent2 = (content: any) => {
    setContent2(content)
  }
  const handleReplaceImg = async () => {
    const response = await validateEditorHTML()
    if (response.some((p: boolean) => !p)) {
      ///TODO: Thao, Need show notify error
      return
    }
    const results = await handleReplaceImageInEditor(1234, uploadImages)
    if (results.some((p: { error: object }) => p.error)) {
      ///TODO: Thao, Need show error alert and turn off display loading
      ///TODO: Thao, Need translate error code before display
      return
    }
    console.log('Call api update data')
  }
  return (
    <>
      Editor
      <p> content 1:{JSON.stringify(content1)}</p>
      <p> content 2:{JSON.stringify(content2)}</p>
      <button onClick={handleReplaceImg}>Replace</button>
      <GgjEditor value={content1} onChange={handleSetContent1} toolbar={toolbar} />
      <GgjEditor value={content2} onChange={handleSetContent2} />
    </>
  )
}
