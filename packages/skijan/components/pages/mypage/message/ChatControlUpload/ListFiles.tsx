import { memo, useContext } from 'react'
import { FileTypes } from './const'
import arrayMove from 'array-move'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import WrapperFilesBox from './WrapperFilesBox'
import SortableList, { SortableItem } from 'react-easy-sort'
import { Action, DispatchContext, StateContext } from './ChatUploadContext'

const ListFiles = () => {
  const theme = useTheme()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const arr = arrayMove(state.listFiles, oldIndex, newIndex)
    dispatch({ type: Action.UpdateListFiles, payload: arr })
  }

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="list"
      lockAxis={'y'}
      css={css`
        margin-top: ${theme.spacing(2)};
        background: ${theme.palette.canvas.light};
        min-height: 200px;
        border: 1px solid ${theme.palette.divider};
        border-radius: 10px;
        padding: ${theme.spacing(2)} 0;
        position: relative;
      `}
    >
      {state.listFiles.map((item: FileTypes, index) => (
        <SortableItem key={`${item.fileName}-${index}`}>
          <div
            css={css`
              padding: ${theme.spacing(2)} ${theme.spacing(1)}
                ${theme.spacing(2)} ${theme.spacing(3)};
              z-index: 1301;
            `}
          >
            <WrapperFilesBox item={item} index={index} />
          </div>
        </SortableItem>
      ))}
    </SortableList>
  )
}

export default memo(ListFiles)
