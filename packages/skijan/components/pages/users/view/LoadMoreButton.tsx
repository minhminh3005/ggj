import {css} from '@emotion/react'
import {Button, Collapse, Typography, useTheme} from '@mui/material'
import {KeyboardArrowUp} from '@mui/icons-material'
import {SerializedStyles} from '@emotion/react'
import React, {useState} from 'react'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'
import {EmotionJSX} from '@emotion/react/types/jsx-namespace'

interface ILoadMoreButtonProps {
  name: string
  collapsedSize?: number
  children: EmotionJSX.Element[] | EmotionJSX.Element
  cssCustom?: SerializedStyles
}

const LoadMoreButton = ({name, children, collapsedSize, cssCustom}: ILoadMoreButtonProps) => {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(true)
  const {t} = useTranslation(nsUserProfile)

  return (
    <>
      <div css={css`position: relative; margin-top: 0!important;`}>
        <Collapse in={!collapsed} collapsedSize={collapsedSize}>
          {children}
        </Collapse>
        <div
          css={css`
                    background: transparent linear-gradient(180deg, #FFFFFF59 0%, #FFFFFFF2 100%) 0 0 no-repeat padding-box;
                    position: absolute;
                    height: 80%;
                    bottom: 0;
                    width: 100%;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity .${theme.transitions.duration.standard}s;

                    &.collapsed {
                      opacity: 1;
                      visibility: visible;
                    }
                  `}
          className={collapsed ? 'collapsed' : ''}
        />
      </div>
      <div
        css={css`
                    display: flex;
                    justify-content: center;
                    ${cssCustom}
                  `}
      >
        <Button
          startIcon={
            <KeyboardArrowUp
              css={css`
                          transition: transform .3s;
                          transition-delay: .${theme.transitions.duration.standard}s;
                          transform: rotate(0);
                          color: ${theme.palette.primary.light};
                          &.collapsed {
                            transform: rotate(180deg);
                          }
                        `}
              className={collapsed ? 'collapsed' : ''}

            />
          }
          onClick={() => {
            setCollapsed(!collapsed)
          }}
        >
          <Typography
            css={css`
                        color: ${theme.palette.smoke.dark};
                      `}
            variant="caption"
          >
            {collapsed ? name: t('fold')}
          </Typography>
        </Button>
      </div>
    </>
  )
}

export default LoadMoreButton
