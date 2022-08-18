import { Stack, Stepper, Step, StepLabel } from '@mui/material'
import { memo } from 'react'
import { css } from '@emotion/react'
import { ListSteps } from './const'
import { styled } from '@mui/material/styles'
import { StepIconProps } from '@mui/material/StepIcon'
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import { useTranslation } from 'next-i18next'
const nsTran = 'surface@payment'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ns, actions } from 'store/paymentSlice'
import { Steps } from './const'


const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; step?: number | null , icon?: number |null}
}>(({ theme, ownerState }) => ({
  backgroundColor: '#496CDC3D',
  zIndex: 1,
  fontSize: '12px',
  color: theme.palette.jade.light,
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: '50%',
  display: 'flex',
  cursor: ownerState.step == Steps.Step2 && ownerState.icon == 1  ? 'pointer' : '',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
  }),
}))

const StepIcon = (props: StepIconProps) => {
  const { active, completed, className, icon } = props
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  return (
    <StepIconRoot
      ownerState={{ completed, active, step: currentStep ,icon:icon == 1 ? 1 : null }}
      className={className}
    >
      {icon}
    </StepIconRoot>
  )
}

const ColorlibConnector = styled(StepConnector)(() => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#496CDC3D',
  },
}))

const CustomizedStepper = () => {
  const step = useAppSelector((state) => state[ns]?.currentStep)
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const handleSetStep = () => {
    if (currentStep != Steps.Step2) return
    dispatch(actions.handleSetCurrentStep(Steps.Step1))
  }

  return (
    <Stack
      css={css`
        max-width: 450px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      `}
    >
      <Stepper
        activeStep={step}
        alternativeLabel
        css={css`
          width: 100%;
        `}
        connector={<ColorlibConnector />}
      >
        {ListSteps.map((item) => {
          if (item.step == Steps.Step1) {
            return (
              <Step key={item.step}>
                <StepLabel StepIconComponent={StepIcon} onClick={handleSetStep}>
                  {t(item.label)}
                </StepLabel>
              </Step>
            )
          } else {
            return (
              <Step key={item.step}>
                <StepLabel StepIconComponent={StepIcon}>
                  {t(item.label)}
                </StepLabel>
              </Step>
            )
          }
        })}
      </Stepper>
    </Stack>
  )
}

export default memo(CustomizedStepper)
