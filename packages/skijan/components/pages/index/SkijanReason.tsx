import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import skill from 'components/pages/index/skill.png'
import chat from 'components/pages/index/chat.png'
import security from 'components/pages/index/security.png'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Collapse, Stack, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

const nsTran = 'surface@index'

interface DataReasonProps {
  title: string
  content: string
  img: StaticImageData
}

const ItemComponent = ({valuesReason}: {valuesReason: DataReasonProps}) => {
  const theme = useTheme()

  return (
    <Stack css={css`
      width: 100%;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        max-width: calc(50% - 10px);
        justify-content: flex-start;
      }
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        max-width: calc(33% - 10px);
      }
    `}
    justifyContent="center"
    alignItems="center"
    direction="column">
      <Typography css={css`
        color: white;
        width: 100%;
        height: 36px;
        display: flex;
        border-radius: 0.25rem;
        justify-content: center;
        align-items: center;
        background-color: ${theme.palette.jade.dark};`} variant="subtitle1" component="h3">{valuesReason.title}</Typography>
      <Image objectFit='contain' width={240} height={240} src={valuesReason.img} alt='ItemReasonSkjian' unoptimized quality={100}/>
      <Typography css={css`color: ${theme.palette.jade.dark};`}
        variant="subtitle1" component="p">{valuesReason.content}</Typography>
    </Stack>
  )
}
const ItemComponentHOC = memo(ItemComponent)
const SkijanReason = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.values.md}px)`)
  const [seeMore, setSeeMore] = useState<boolean>(false)
  const dataReason: DataReasonProps[] = useMemo(() => [
    {
      title: t('23'),
      content: t('24'),
      img: skill,
    },
    {
      title: t('25'),
      content: t('26'),
      img: chat,
    },
    {
      title: t('27'),
      content: t('28'),
      img: security,
    },
  ], [])
  const themeCustom = useMemo(() => `color:${theme.palette.primary.main};font-size: 1.5rem;`, [])

  return (
    <>
      <Typography
        css={css`
          margin-bottom: 24px;
          margin-top: 64px;
          color: ${theme.palette.jade.dark};
          width: 100%;
        `} variant="h6" component="h2">{t('29')}</Typography>
      <Collapse in={!isMobile || seeMore} collapsedSize={325} css={css`
        .MuiCollapse-wrapperInner {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          justify-content: space-between;
          gap: 10px;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            align-items: flex-start;
          }
        }
      `}>
        {
          dataReason.map((item, i) => <ItemComponentHOC key={i} valuesReason={item} />)
        }
      </Collapse>
      {isMobile && <Stack css={css`
        width: 100%;
        margin-top: 16px;
        cursor: pointer;
      `} justifyContent="flex-end" alignItems="center" direction="row">
        <Typography
          onClick={() => setSeeMore(!seeMore)}
          css={css`color: ${theme.palette.primary.main}`}
          variant="subtitle1">{t(seeMore ? '31' : '30')}</Typography>
        {
          seeMore
            ? <ExpandLessIcon css={css`${themeCustom}`} />
            : <ExpandMoreIcon css={css`${themeCustom}`} />
        }
      </Stack>}
    </>
  )
}
export default memo(SkijanReason)
