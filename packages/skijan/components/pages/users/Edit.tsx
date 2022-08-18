import { css } from '@emotion/react'
import NoSsr from '@mui/material/NoSsr'
import EditForm from 'components/pages/users/edit/EditForm'
import Profile from './view/Profile'

function Edit() {
  return (
    <>
      <Profile
        cssExtend={css`
          margin-top: 51px;
          padding-bottom: 32px;
        `}
      />
      <NoSsr>
        <EditForm />
      </NoSsr>
    </>
  )
}

export default Edit
