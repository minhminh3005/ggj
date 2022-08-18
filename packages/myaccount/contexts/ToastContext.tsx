import {
  ComponentType,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  SnackbarProvider,
  useSnackbar,
  SnackbarKey,
  VariantType,
} from 'notistack'
import {css as css1} from '@emotion/css'
import {
  Button,
  Fade,
  IconButton,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Close} from '@mui/icons-material'
import {useTranslation} from 'next-i18next'

type Props = {
  children: ReactNode
}

export interface IToast {
  message?: string
  type: VariantType
  callbackObj?: ICallbackObj
}

export interface ICallbackObj {
  name: string,
  callback: () => void
}

export interface IToastContext {
  type: VariantType
  callbackObj?: ICallbackObj
}

const toastDefaultValues: IToastContext = {
  type: 'default',
}

const ToastContext = createContext<IToastContext>(toastDefaultValues)

const ToastProvider = ({children}: Props) => {
  const theme = useTheme()
  const [type, setType] = useState<VariantType>('default')
  const [callbackObj, setCallbackObj] = useState<ICallbackObj>({name: '', callback: () => true})
  const providerRef = useRef<SnackbarProvider>(null)
  const onClickDismiss = (key: SnackbarKey) => () => {
    providerRef.current?.closeSnackbar(key)
  }
  return (
    <ToastContext.Provider value={{type, callbackObj}}>
      <SnackbarProvider
        ref={providerRef}
        action={(key) => (
          <>
            {callbackObj.name && <Button onClick={() => {
              callbackObj.callback()
            }}
            >{callbackObj.name}</Button>}
            <IconButton onClick={onClickDismiss(key)}>
              <Close/>
            </IconButton>
          </>
        )}
        classes={{
          containerRoot: css1({
            top: '0px !important',
            width: '100% !important',
            wordBreak: 'break-all',
            [theme.breakpoints.up('lg')]: {
              top: '65px !important',
              width: 'auto !important',
            },
          }),
          variantSuccess: css1({
            backgroundColor: `${theme.palette.success.light} !important`,
            color: `${theme.palette.success.main} !important`,
          }),
          variantError: css1({
            backgroundColor: `${theme.palette.error.contrastText} !important`,
            color: `${theme.palette.error.main} !important`,
          }),
        }}
        hideIconVariant
        autoHideDuration={type !== 'error' ? 10000 : null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        maxSnack={3}
        TransitionComponent={Fade as ComponentType}
      >
        <ToastAction typeHandler={setType} callbackHandler={setCallbackObj}/> {children}
      </SnackbarProvider>
    </ToastContext.Provider>
  )
}

const ToastAction = ({typeHandler, callbackHandler}: { typeHandler: (type: VariantType) => void, callbackHandler: (callbackObj: ICallbackObj) => void }) => {
  const {t} = useTranslation('common@common-error')
  const {enqueueSnackbar} = useSnackbar()
  const toastHandler = ((e: CustomEvent<IToast>) => {
    const data: IToast = e.detail
    !data.message && (data.message = 'ECI500')
    data.message = t(data.message)

    if (data.callbackObj && Object.keys(data.callbackObj).length !== 0) {
      callbackHandler(data.callbackObj)
    }

    typeHandler(data.type)
    enqueueSnackbar(data.message, {
      persist: false,
      variant: data.type,
    })
  }) as EventListener

  useEffect(() => {
    document.addEventListener('toastOn', toastHandler)
    return () => {
      document.removeEventListener('toastOn', toastHandler)
    }
  })
  return <></>
}

export const toastHandler = (data: IToast) => {
  document.dispatchEvent(new CustomEvent('toastOn', {detail: data}))
}

export default ToastProvider
