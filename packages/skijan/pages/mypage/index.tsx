import {MypageLayout, nsTranMypageLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import emptyChatPNG from 'components/pages/mypage/transaction/Images/presentSkillIllustration.png'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material'

export default function IndexPage() {
  const theme = useTheme()

  return (
    <div css={css`
      height: 100%;
      text-align: center;
    `}>
      <img
        src={emptyChatPNG.src}
        alt="Empty Chat"
        css={css`
          max-width: 320px;
          width: 50%;
          height: auto;
          margin-top: ${theme.spacing(3)};
        `}
      />
    </div>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const props = {
    props: {
      ...(await ggjServerSideTranslations(
        req as NextRequest,
        [],
        nsTranMypageLayout
      )),
    },
  }
  return { ...props }
}
IndexPage.Layout = MypageLayout
