import { Injectable } from '@nestjs/common'
import CacheMemory from 'cacheman-memory'
import { DEFAULT_MEM_CACHE_TIME } from '../app.constants'

@Injectable()
export class PubSubService {
  private events
  private readonly cacheInstance

  constructor() {
    this.events = {}
    this.cacheInstance = new CacheMemory()
  }

  initEvent(eventName) {
    this.events[eventName] = []
  }

  subscribe(eventName, data) {
    return this.events[eventName].push(data) - 1
  }

  isExistEvent(evenName) {
    return !!this.events[evenName]
  }

  publishAll(eventName, previousJobData?) {
    //TODO: Trung Pham - Remove all console log below
    const jobs = this.events[eventName] || []
    this.prePushAll(eventName, previousJobData)
    console.log('Jobs length of event %s: ', eventName, jobs.length)
    if (!jobs.length) {
      return
    }
    console.log('Publish all req of event %s', eventName, jobs.length)
    if (Array.isArray(jobs)) {
      jobs.map((fn) => fn(previousJobData))
    }
  }

  prePushAll(eventName, previousJobData) {
    // Cache the refresh token result data
    // in case there are existed request come after event deleted
    this.cacheInstance.set(
      eventName,
      previousJobData,
      DEFAULT_MEM_CACHE_TIME,
      (err) => {
        if (err) {
          console.error('publishAll error', err)
        }
      },
    )
    delete this.events[eventName]
    console.log('Deleted event ', eventName)
  }

  async getCachedEventData(eventName: string): Promise<any> {
    if (!eventName) {
      return {
        success: false,
      }
    }
    return new Promise((resolve) =>
      this.cacheInstance.get(eventName, (err, val) => {
        if (err) {
          resolve(null)
        }
        resolve(val)
      }),
    )
  }

  async deleteEventCache(eventName: string) {
    if (!eventName) {
      return
    }
    return new Promise<void>((resolve) =>
      this.cacheInstance.del(eventName, (err) => {
        if (err) {
          console.log('Delete event cache error ', eventName)
          console.error(err)
          resolve()
        }
        resolve()
      }),
    )
  }
}
