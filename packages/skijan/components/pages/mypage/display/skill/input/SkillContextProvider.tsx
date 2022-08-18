import {createContext, Dispatch, ReactNode, RefObject, useReducer, useRef} from 'react'

interface IStateReducer {
  thumbImage: File | null
  thumbRef: RefObject<HTMLDivElement> | null
}
interface IAction {
  type: Action,
  payload?: any
}
export enum Action {
  UPDATE_THUMB_IMAGE = 'updateThumbImage'
}
const initialState : IStateReducer = {
  thumbImage: null,
  thumbRef: null,
}
export const ThumbImageContext = createContext<IStateReducer>(initialState)
export const DispatchContext = createContext<Dispatch<IAction>>((action: IAction) => action)
export const EditorContext = createContext<RefObject<HTMLDivElement> | null>(null)

const reducer = (state : IStateReducer, {type, payload} : IAction) => {
  switch (type) {
  case Action.UPDATE_THUMB_IMAGE: {
    return {
      ...state,
      thumbImage: payload
    }
  }
  default:
    return state
  }
}

export const SkillContextProvider = ({children}: {
  children: ReactNode
}) => {
  initialState.thumbRef = useRef<HTMLDivElement>(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <DispatchContext.Provider value={dispatch}>
      <ThumbImageContext.Provider value={state}>
        <EditorContext.Provider value={editorRef}>
          {children}
        </EditorContext.Provider>
      </ThumbImageContext.Provider>
    </DispatchContext.Provider>
  )
}
