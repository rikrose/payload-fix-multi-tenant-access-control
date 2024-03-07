import type { StorageOptions } from '@google-cloud/storage'

import { Storage } from '@google-cloud/storage'

import type { Adapter, GeneratedAdapter } from '../../types.js'

import { getGenerateURL } from './generateURL.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'

export interface Args {
  acl?: 'Private' | 'Public'
  bucket: string
  options: StorageOptions
}

export const gcsAdapter =
  ({ acl, bucket, options }: Args): Adapter =>
  ({ collection, prefix }): GeneratedAdapter => {
    let storageClient: Storage | null = null

    const getStorageClient = (): Storage => {
      if (storageClient) return storageClient
      storageClient = new Storage(options)
      return storageClient
    }

    return {
      generateURL: getGenerateURL({ bucket, getStorageClient }),
      handleDelete: getHandleDelete({ bucket, getStorageClient }),
      handleUpload: getHandleUpload({
        acl,
        bucket,
        collection,
        getStorageClient,
        prefix,
      }),
      staticHandler: getHandler({ bucket, collection, getStorageClient }),
    }
  }
