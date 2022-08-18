import { VisibilityOff, Visibility } from '@mui/icons-material'
import { OutlinedInput, InputAdornment, IconButton, OutlinedInputProps } from '@mui/material'
import React, { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GgjInputPassword = React.forwardRef((props: OutlinedInputProps, inputRef) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <OutlinedInput
      type={showPassword ? 'text' : 'password'}
      {...props}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
})
GgjInputPassword.displayName = 'GgjInputPassword'

export default GgjInputPassword
