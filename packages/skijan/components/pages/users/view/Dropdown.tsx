import { css, SerializedStyles } from '@emotion/react'
import { MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material'

const Dropdown = ({
  options,
  selected,
  handler,
  cssInput,
}: {
  options: string[]
  selected: string
  handler: (e: SelectChangeEvent) => void
  cssInput?: SerializedStyles
}) => {
  const theme = useTheme()

  return (
    <Select
      css={css`
        font-size: 12px;
        width: 170px;
        ${cssInput}
      `}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selected}
      displayEmpty
      onChange={handler}
    >
      {options.map((item) => (
        <MenuItem
          key={item}
          css={css`
            font-size: 12px;
            height: 48px;
            &.Mui-selected {
              color: ${theme.palette.primary.main};
            }
            &:hover {
              color: ${theme.palette.primary.main};
              background-color: rgba(73, 108, 220, 0.08);
            }
          `}
          value={item}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  )
}

export default Dropdown
