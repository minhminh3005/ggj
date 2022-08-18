import React from 'react'
import { Collapse } from '@mui/material'
import CreateEditFields from './CreateEditFields'
import LabelMaxItem from './LabelMaxItem'
import ButtonAddItem from './ButtonAddItem'
import FiledItem from '../view/FieldItem'
import {ISpecialty, ns} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {SPECIALTY} from './const'

// MAIN
function CorrespondenceFields() {
  const data: ISpecialty[] = useAppSelector((state) => state[ns].specialty)
  const show: boolean = useAppSelector((state)=>state[ns].showEditForm)
  const disabled = data.length == 5 || show

  return (
    <div>
      <LabelMaxItem max={5}/>
      <ButtonAddItem disabled={disabled} type={SPECIALTY}/>
      <Collapse in={show} timeout={800}><CreateEditFields/></Collapse>
      {
        data.map((item, idx) => (
          <FiledItem key={`${item.id}-${idx}`} showEdit={!show} data={item}/>
        ))
      }
    </div>
  )
}

export default React.memo(CorrespondenceFields)
