import React from 'react'
import { Collapse } from '@mui/material'
import CreateEditCareer from './CreateEditCareer'
import LabelMaxItem from './LabelMaxItem'
import ButtonAddItem from './ButtonAddItem'
import CareerItem from '../view/CareerItem'
import {IUserCareer, ns} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {CAREER} from './const'

// MAIN
function Career() {
  const data: IUserCareer[] = useAppSelector((state) => state[ns]?.careers)
  const show: boolean = useAppSelector((state)=>state[ns].showEditForm)
  const disabled = data.length == 5 || show
  return (
    <div>
      <LabelMaxItem max={5}/>
      <ButtonAddItem type={CAREER} disabled={disabled}/>
      <Collapse in={show} timeout={800}><CreateEditCareer /></Collapse>
      {data.map((item, idx) => (
        <CareerItem key={`${item.id}-${idx}`} showEdit={!show} data={item}/>
      ))}
    </div>
  )
}

export default React.memo(Career)
