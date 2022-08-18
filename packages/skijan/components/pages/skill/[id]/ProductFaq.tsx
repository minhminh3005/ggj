import { css } from '@emotion/react'
import {useMemo, useState} from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {useTheme} from '@mui/material/styles'
import {WithConditionalCSSProp} from '@emotion/react/types/jsx-namespace'
import {useTranslation} from 'next-i18next'
import {useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs, State as SkillDetailState} from 'store/skillSlice'
import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'

const LIMIT = 5

export default function ProductFaq(props: WithConditionalCSSProp<'div'>) {
  const {t} = useTranslation(nsTran)
  const rawFaqData = useAppSelector(
    state => ((state[skillDetailSliceNs] as SkillDetailState).apiResObj?.skillFAQs ?? []),
    (left, right) => {
      // is size difference?
      if(left.length !== right.length) return false

      // compare each item
      return !left.some((item, idx) => {
        return (
          item.id !== right[idx].id ||
          item.answer !== right[idx].answer ||
          item.question !== right[idx].question
        )
      })
    }
  )
  const [page, setPage] = useState(1)
  const faqDataShow = useMemo(() => {
    // paging in client
    return rawFaqData.slice(0, LIMIT*page)
  }, [page, rawFaqData])
  const isShowLoadMoreButton = useMemo(() => {
    return rawFaqData.length >= LIMIT && faqDataShow.length < rawFaqData.length
  }, [rawFaqData, faqDataShow])
  return (
    <div css={css`margin-bottom: 16px;`} {...props}>
      <Typography variant="h6" mb={4} key="ProductFaq-title">{t('ProductFaq-1')}</Typography>
      {
        faqDataShow.map(item => (
          <FAQRow key={'FAQRow-'+ item.id} css={css`margin-bottom: 16px;`} uic="Q" question={item.question} answer={item.answer}/>
        ))
      }
      {
        isShowLoadMoreButton && <Button
          variant="outlined"
          size="large"
          fullWidth onClick={() => setPage(page + 1)}
          key="ProductFaq-button-loadmore"
        >{t('ProductFaq-2')}</Button>
      }
    </div>
  )
}



type FAQRowBaseProp = {
  uic: string // user icon character
  question: string
  answer: string
}
function FAQRow(props: WithConditionalCSSProp<'div'> & FAQRowBaseProp) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(!open)
  }
  return (
    <div
      css={css`
        background: ${theme.palette.canvas.light};
        border-radius: 10px;
        overflow: hidden;
      `}
      {...props}
    >
      <ListItemButton
        onClick={handleClick}
        css={css`
          align-items: start;
          padding: 12px 16px;
        `}
        title={props.question}
      >
        <ListItemIcon css={css`min-width: 32px`}>
          <Avatar
            css={css`
              background: ${theme.palette.primary.main};
              width: 24px;
              flex: 0 0 24px;
              height: 24px;
              font-size: 12px;
            `}
          >Q</Avatar>
        </ListItemIcon>
        <ListItemText
          css={css`
            margin: auto;
            word-break: break-word;
          `}
          primary={props.question}
        />
        {open ? <ExpandLess css={css`margin: auto;`}/> : <ExpandMore css={css`margin: auto;`}/>}
      </ListItemButton>
      {open && <Divider css={css`margin: 0 ${theme.spacing(3)}`}/>}
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton
            css={css`
              align-items: start;
              padding: 12px 16px;
            `}
          >
            <ListItemIcon css={css`min-width: 32px`}>
              <Avatar
                css={css`
                  background: ${theme.palette.ruby.main};
                  width: 24px;
                  flex: 0 0 24px;
                  height: 24px;
                  font-size: 12px;
                `}
              >A</Avatar>
            </ListItemIcon>
            <ListItemText
              css={css`margin: auto; white-space: pre-wrap`}
              primary={props.answer}
            />
          </ListItemButton>
        </List>
      </Collapse>
    </div>
  )
}
