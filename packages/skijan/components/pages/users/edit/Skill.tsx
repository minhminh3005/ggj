import React from 'react'
import { Collapse } from '@mui/material'
import CreateEditSkill from './CreateEditSkill'
import LabelMaxItem from './LabelMaxItem'
import ButtonAddItem from './ButtonAddItem'
import SkillItem from 'components/pages/users/view/SkillItem'
import {IUserSkill, ns} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {MY_SKILL} from './const'

// MAIN
function Skill() {
  const data:IUserSkill[] = useAppSelector((state) => state[ns]?.mySkills)
  const show: boolean = useAppSelector((state)=>state[ns].showEditForm)
  const disabled = data.length >= 20 || show
  return (
    <div>
      <LabelMaxItem max={20} />
      <ButtonAddItem type={MY_SKILL} disabled={disabled}/>
      <Collapse in={show} timeout={800}><CreateEditSkill/></Collapse>
      {data.map((item,idx) => (
        <SkillItem key={`${item.id}-${idx}`} showEdit={!show} data={item} />
      ))}
    </div>
  )
}

export default React.memo(Skill)
