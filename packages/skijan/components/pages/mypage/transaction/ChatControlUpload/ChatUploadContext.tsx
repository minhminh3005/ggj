import {cloneDeep} from 'lodash'
import {FileTypes, OptFileTypes} from './const'
import {createContext, Dispatch, ReactNode, useMemo, useReducer} from 'react'
import {checkExtension, checkFileSize, convertByteToMB, formatBytes} from '../../../../../common/common-files'

type StateType = {
  isShowPopup: boolean,
  isShowPopupMaxFiles: boolean,
  isShowPopupInvalidFiles?: boolean,
  listFiles: Array<FileTypes>,
  errorFiles: Array<any>,
}

const initialState: StateType = {
  isShowPopup: false,
  isShowPopupMaxFiles: false,
  isShowPopupInvalidFiles: false,
  listFiles: [],
  errorFiles: []
}

export enum Action {
  AddFiles = 'AddFiles',
  UpdateListFiles = 'UpdateListFiles',
  RemoveFile = 'RemoveFile',
  ClosePopupMaxFiles = 'ClosePopupMaxFiles',
  CloseUploadModal = 'CloseUploadModal'
}

type ActionType = {
  type: Action,
  payload?: any,
};

const reducer = (state: StateType, {type, payload}: ActionType) => {
  switch (type) {
  case Action.AddFiles: {
    const {files, maxFiles, acceptType, maxSize, totalSize} = payload

    // VALIDATE TOTAL FILES
    if (state.listFiles.length + files.length > maxFiles) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: []
      }
    }

    // VALIDATE TOTAL SIZE
    const arr = [...state.listFiles, ...files]
    const sum = arr.reduce((n, {size}) => n + size, 0)

    if(convertByteToMB(sum) > totalSize) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: []
      }
    }

    // VALIDATE TYPE AND SIZE PER FILE
    const errorImgs = []
    for (let i = 0; i < files.length; i++) {
      if (
        !checkExtension(files[i], acceptType.trim().split(/,\s*/)) ||
        !checkFileSize(files[i], maxSize)
      ) {
        errorImgs.push(files[i])
      }
    }

    if (errorImgs.length > 0) {
      return {
        ...state,
        isShowPopupMaxFiles: true,
        errorFiles: errorImgs.map((p) => ({
          name: p.name,
          size: formatBytes(p.size),
          extension: p.name ? p.name.split('.').pop() : '',
        }))
      }
    }

    const fileListAsArray = Array.from(files as FileList)
    const listFiles: Array<FileTypes> = []
    for (const file of fileListAsArray) {
      const newFile: FileTypes = file
      if(file.type.includes('image')) {
        const img = new Image()
        newFile.fileUrl = img.src = URL.createObjectURL(file)
        img.onload = function()
        {
          newFile.width = img.width || 0
          newFile.height = img.height || 0
        }
        img.remove()
      }
      newFile.fileName = file.name
      newFile.number = undefined
      newFile.extension = file.name ? file.name.split('.').pop() : ''
      listFiles.push(newFile)
    }
    const newArray = [...state.listFiles, ...listFiles]
    return {
      ...state,
      listFiles: newArray
    }
  }
  case Action.UpdateListFiles: {
    const newState = [...payload]
    return {
      ...state,
      listFiles: newState
    }
  }
  case Action.RemoveFile: {
    const {index, item} = payload
    const array = cloneDeep(state.listFiles)
    array.splice(index, 1)
    const newState = {
      listFiles: [...array],
    }

    if (item.fileUrl && item.fileUrl.includes('blob')) {
      URL.revokeObjectURL(item.fileUrl)
    }
    return newState
  }
  case Action.ClosePopupMaxFiles:
    return {
      ...state,
      isShowPopupMaxFiles: false,
      errorFiles: []
    }
  case Action.CloseUploadModal: {
    const array: Array<any> = cloneDeep(state.listFiles)
    for ( let i = 0; i < array.length; i++) {
      if (array[i].type.includes('image') && array[i].fileUrl.includes('blob')) {
        URL.revokeObjectURL(array[i].fileUrl)
      }
    }
    return {
      ...state,
      listFiles: []
    }
  }
  default:
    return state
  }
}

const optFile: OptFileTypes = {
  maxSize: 1,
  maxFiles: 1,
  totalSize: 5,
  acceptType: '',
}

export const StateContext = createContext(initialState)
export const IsShowPopupErrorContext = createContext(false)
export const IsShowPopupContext = createContext(false)
export const OptFileContext = createContext<OptFileTypes>(optFile)
export const DispatchContext = createContext<Dispatch<ActionType>>((action: ActionType) => action)
export const ErrorFileContext = createContext([])

interface Props {
  children: ReactNode
  optFile: OptFileTypes
}

export function UploadImagesOrFilesProvider({children, optFile}: Props) {
  const initState: StateType = initialState
  initState.listFiles = []

  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initState)
  const isShowPopupError = state.isShowPopupMaxFiles
  const isShowPopupErrorMemo = useMemo(() => isShowPopupError, [isShowPopupError])
  const isShowPopup = state.isShowPopup
  const isShowPopupMemo = useMemo(() => isShowPopup, [isShowPopup])
  const errorFiles = state.errorFiles
  const errorFilesMemo = useMemo(() => errorFiles, [errorFiles])
  return (
    <IsShowPopupContext.Provider value={isShowPopupMemo}>
      <DispatchContext.Provider value={dispatch}>
        <OptFileContext.Provider value={optFile}>
          <IsShowPopupErrorContext.Provider value={isShowPopupErrorMemo}>
            <ErrorFileContext.Provider value={errorFilesMemo}>
              <StateContext.Provider value={state}>
                {children}
              </StateContext.Provider>
            </ErrorFileContext.Provider>
          </IsShowPopupErrorContext.Provider>
        </OptFileContext.Provider>
      </DispatchContext.Provider>
    </IsShowPopupContext.Provider>
  )
}
