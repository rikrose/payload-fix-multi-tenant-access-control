import { URL } from 'url'

import type { Collection } from '../collections/config/types.js'
import type { EmailOptions, SanitizedConfig } from '../config/types.js'
import type { Payload } from '../index.js'
import type { PayloadRequest } from '../types/index.js'
import type { User, VerifyConfig } from './types.js'

type Args = {
  collection: Collection
  config: SanitizedConfig
  disableEmail: boolean
  emailOptions: EmailOptions
  req: PayloadRequest
  sendEmail: Payload['sendEmail']
  token: string
  user: User
}

async function sendVerificationEmail(args: Args): Promise<void> {
  // Verify token from e-mail
  const {
    collection: { config: collectionConfig },
    config,
    disableEmail,
    emailOptions,
    req,
    sendEmail,
    token,
    user,
  } = args

  if (!disableEmail) {
    const protocol = new URL(req.url).protocol
    const serverURL =
      config.serverURL !== null && config.serverURL !== ''
        ? config.serverURL
        : `${protocol}://${req.headers.get('host')}`

    const verificationURL = `${serverURL}${config.routes.admin}/${collectionConfig.slug}/verify/${token}`

    let html = `${req.t('authentication:newAccountCreated', {
      serverURL: config.serverURL,
      verificationURL,
    })}`

    const verify = collectionConfig.auth.verify as VerifyConfig

    // Allow config to override email content
    if (typeof verify.generateEmailHTML === 'function') {
      html = await verify.generateEmailHTML({
        req,
        token,
        user,
      })
    }

    let subject = req.t('authentication:verifyYourEmail')

    // Allow config to override email subject
    if (typeof verify.generateEmailSubject === 'function') {
      subject = await verify.generateEmailSubject({
        req,
        token,
        user,
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sendEmail({
      from: `"${emailOptions.fromName}" <${emailOptions.fromAddress}>`,
      html,
      subject,
      to: user.email,
    })
  }
}

export default sendVerificationEmail
