import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import Badges from 'components/pages/users/view/Badges'
import TitleItem from '../edit/TitleItem'
import { ISpecialty } from 'store/usersSlice'
import menu from '../../../layouts/common/menu-data.json'

interface IField {
  showEdit?: boolean | false
  data: ISpecialty
}

const FiledItem = ({ showEdit, data }: IField) => {
  const theme = useTheme()
  const itemTitle = menu.filter(item => item.id == data.serviceCategoryLargeId)[0]
  return (
    <div
      css={css`
        margin-top: 10px;
        padding-bottom: ${theme.spacing(3)};
        border-bottom: solid 1px #f2f2f2;
      `}
    >
      <TitleItem name={itemTitle.name} showEdit={showEdit} data={data} />
      <Badges data={data} />
      <Typography variant="caption" css={css`white-space: pre-wrap;word-break: break-word;`}>
        {data.explain}
      </Typography>
    </div>
  )
}

export default FiledItem
