import { send } from '@ggj/utils/utils/slackv2'
function errorHandler(code: number, error: any | string, isSendSlack = true) {
  console.error(error)
  isSendSlack &&
    send(
      { message: error.stack || error || '' },
      process.env.ERROR_SLACK_CHANNEL
    )
  return {
    error,
    code,
    data: null,
  }
}

function isLocal(): boolean {
  return process.env.ENV == 'local'
}

export { errorHandler, isLocal }
