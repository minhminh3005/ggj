import { css } from '@emotion/react'
import { useTheme } from '@mui/material'

export interface ITermData {
  id: number
  title: string
  content: string
}

const Content = ({ data }: { data: ITermData[] }) => {
  const theme = useTheme()
  return (
    <div>
      {data &&
        data.map((item) => (
          <div
            key={item.id}
            css={css`
              a {
                color: ${theme.palette.primary.main};
                text-decoration: none;
              }
            `}
            dangerouslySetInnerHTML={{
              __html: item.content,
            }}
          ></div>
        ))}
    </div>
  )
}

export default Content
