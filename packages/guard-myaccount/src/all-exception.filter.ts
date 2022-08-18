import { Request, Response } from 'express'
import slack from '@ggj/utils/utils/slack'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

const SEND_SLACK_ENV = ['production', 'staging']
const IGNORE_STATUS_CODE_ERROR = [
  HttpStatus.BAD_REQUEST,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
]

/**
 * All unhandled exception will be handled here
 * It includes special treatment for BusinessException
 * */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = exception.response || {}

    if (
      IGNORE_STATUS_CODE_ERROR.includes(status) ||
      (
        exceptionResponse.message && exceptionResponse.message.match(
          /Unexpected token . in JSON at position/
        )
      )
    ) {
      return response
        .status(
          status == HttpStatus.NOT_FOUND ? HttpStatus.NOT_FOUND : HttpStatus.OK,
        )
        .json({
          error: exceptionResponse.error,
          message: exceptionResponse.message || 'Internal error',
        } as TBaseError)
    }

    const error = exceptionResponse.message || exceptionResponse.error
    const slackPreContent = `:boom:
    Request url: \`${request.url || 'empty'}\`
    Method: \`${request.method || 'empty'}\`
    Referer: \`${request.headers.referer || 'empty'}\`
    User agent: \`${request.headers['user-agent'] || 'empty'}\`
    `

    // HttpException of nestjs sometime generate error stack:  Error: [object Object]
    const slackMessage = (exception.stack || '').replace(
      '[object Object]',
      error,
    )

    if (SEND_SLACK_ENV.includes(process.env.ENV || 'local')) {
      slack.sendV2(
        slackPreContent,
        slackMessage,
        process.env.ERROR_SLACK_CHANNEL,
      )
    } else {
      Logger.error(slackMessage)
    }

    response.status(HttpStatus.OK).json({
      error: exceptionResponse.error ,
      message: exceptionResponse.message || 'Internal error',
    } as TBaseError)
  }
}
