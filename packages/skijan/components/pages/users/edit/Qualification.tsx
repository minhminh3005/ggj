import React from 'react'
import {Collapse} from '@mui/material'
import CreateEditQualification from './CreateEditQualification'
import LabelMaxItem from './LabelMaxItem'
import ButtonAddItem from './ButtonAddItem'
import QualificationItem from 'components/pages/users/view/QualificationItem'
import {IUserQualification, ns} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {QUALIFICATION} from './const'

// MAIN
function Qualification() {
  const data: IUserQualification[] = useAppSelector(state => state[ns]?.qualifications)
  const show: boolean = useAppSelector((state)=>state[ns].showEditForm)
  const disabled = data.length >= 10 || show

  return (
    <div>
      <LabelMaxItem max={10} />
      <ButtonAddItem type={QUALIFICATION} disabled={disabled}/>
      <Collapse in={show} timeout={800}><CreateEditQualification /></Collapse>
      {
        data.map((item, idx) => (
          <QualificationItem key={`${item.id}-${idx}`} showEdit={!show} data={item} />
        ))
      }
    </div>
  )
}

export default React.memo(Qualification)
