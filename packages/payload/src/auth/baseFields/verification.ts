import type { Field, FieldHook } from '../../fields/config/types.js'

import { extractTranslations } from '../../translations/extractTranslations.js'

const labels = extractTranslations(['authentication:verified'])

const autoRemoveVerificationToken: FieldHook = ({ data, operation, originalDoc, value }) => {
  // If a user manually sets `_verified` to true,
  // and it was `false`, set _verificationToken to `null`.
  // This is useful because the admin panel
  // allows users to set `_verified` to true manually

  if (operation === 'update') {
    if (data?._verified === true && originalDoc?._verified === false) {
      return null
    }
  }

  return value
}

export default [
  {
    name: '_verified',
    type: 'checkbox',
    access: {
      create: ({ req: { user } }) => Boolean(user),
      read: ({ req: { user } }) => Boolean(user),
      update: ({ req: { user } }) => Boolean(user),
    },
    admin: {
      components: {
        Field: () => null,
      },
    },
    label: labels['authentication:verified'],
  },
  {
    name: '_verificationToken',
    type: 'text',
    hidden: true,
    hooks: {
      beforeChange: [autoRemoveVerificationToken],
    },
  },
] as Field[]
