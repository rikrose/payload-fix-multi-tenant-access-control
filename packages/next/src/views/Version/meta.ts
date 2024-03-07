import type { Metadata } from 'next'

import { getTranslation } from '@payloadcms/translations'
import { formatDate } from '@payloadcms/ui'

import type { GenerateEditViewMetadata } from '../Document/getMetaBySegment.js'

import { meta } from '../../utilities/meta.js'

export const generateMetadata: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  i18n,
}): Promise<Metadata> => {
  const { t } = i18n

  let title: string = ''
  let description: string = ''
  const keywords: string = ''

  const doc: any = {} // TODO: figure this out

  const formattedCreatedAt = doc?.createdAt
    ? formatDate(doc.createdAt, config?.admin?.dateFormat, i18n?.language)
    : ''

  if (collectionConfig) {
    const useAsTitle = collectionConfig?.admin?.useAsTitle || 'id'
    const entityLabel = getTranslation(collectionConfig.labels.singular, i18n)
    const titleFromData = doc?.[useAsTitle]
    title = `${t('version:version')}${formattedCreatedAt ? ` - ${formattedCreatedAt}` : ''}${titleFromData ? ` - ${titleFromData}` : ''} - ${entityLabel}`
    description = t('version:viewingVersion', { documentTitle: doc[useAsTitle], entityLabel })
  }

  if (globalConfig) {
    const entityLabel = getTranslation(globalConfig.label, i18n)
    title = `${t('version:version')}${formattedCreatedAt ? ` - ${formattedCreatedAt}` : ''}${entityLabel}`
    description = t('version:viewingVersionGlobal', { entityLabel })
  }

  return meta({
    config,
    description,
    keywords,
    title,
  })
}
