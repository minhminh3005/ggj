import React from 'react'
import { css } from '@emotion/react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'

interface FaqAccordionProps {
  title?: string
  questionList?: {
    question: string
    id: number
    answer: string
  }[]
  expanded?: boolean
  onChange?: (isExpanded: boolean) => void
}

const FaqItem = ({ question, id }: { question?: string; id?: number }) => {
  const theme = useTheme()

  return (
    <Link href={`/faq/${id}`} passHref>
      <a
        target="_blank"
        css={css`
          text-decoration: none;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            border-top: 1px solid ${theme.palette.smoke.light};
            padding: 14px 0;
            align-items: center;
            cursor: pointer;
          `}
        >
          <Typography
            variant="body2"
            css={css`
              max-width: 255px;
              text-decoration: none;
              color: ${theme.palette.text.primary};
            `}
          >
            {question}
          </Typography>

          <ArrowForwardIosIcon
            css={css`
              font-size: 14.5px;
              margin-right: 4px;
              color: black;
            `}
          />
        </div>
      </a>
    </Link>
  )
}

const FaqItemMemo = React.memo(FaqItem)

const FaqAccordion = ({
  title,
  questionList,
  expanded,
  onChange,
}: FaqAccordionProps) => {
  function handleChange(_: any, isExpanded: boolean) {
    onChange && onChange(isExpanded)
  }

  return (
    <div
      css={css`
        border-radius: 10px;
        overflow: hidden;
        height: fit-content;
        background-color: white;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
      `}
    >
      <Accordion
        css={css`
          box-shadow: none;
        `}
        expanded={expanded}
        onChange={handleChange}
      >
        <AccordionSummary
          sx={{
            margin: '0px',
          }}
          css={css`
            padding: 0 16px;
          `}
          expandIcon={
            <ExpandMoreIcon
              css={css`
                color: black;
              `}
            />
          }
        >
          <Typography variant="button">{title}</Typography>
        </AccordionSummary>

        <AccordionDetails
          css={css`
            padding: 0 16px;
          `}
        >
          {questionList?.map((item) => (
            <FaqItemMemo key={item?.id} {...item} />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

function skipRerender(
  prevProps: FaqAccordionProps,
  nextProps: FaqAccordionProps
) {
  return prevProps.expanded === nextProps.expanded
}

export default React.memo(FaqAccordion, skipRerender)
