import crypto from 'crypto'

import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { Where } from '../../exports/types.js'
import type { AuthStrategyFunction, User } from '../index.js'

export const APIKeyAuthentication =
  (collectionConfig: SanitizedCollectionConfig): AuthStrategyFunction =>
  async ({ headers, payload }) => {
    const authHeader = headers.get('Authorization')

    if (authHeader?.startsWith(`${collectionConfig.slug} API-Key `)) {
      const apiKey = authHeader.replace(`${collectionConfig.slug} API-Key `, '')
      const apiKeyIndex = crypto.createHmac('sha1', payload.secret).update(apiKey).digest('hex')

      try {
        const where: Where = {}
        if (collectionConfig.auth?.verify) {
          where.and = [
            {
              apiKeyIndex: {
                equals: apiKeyIndex,
              },
            },
            {
              _verified: {
                not_equals: false,
              },
            },
          ]
        } else {
          where.apiKeyIndex = {
            equals: apiKeyIndex,
          }
        }

        const userQuery = await payload.find({
          collection: collectionConfig.slug,
          depth: collectionConfig.auth.depth,
          overrideAccess: true,
          where,
        })

        if (userQuery.docs && userQuery.docs.length > 0) {
          const user = userQuery.docs[0]
          user.collection = collectionConfig.slug
          user._strategy = 'api-key'

          return user as User
        }
      } catch (err) {
        return null
      }
    }

    return null
  }
