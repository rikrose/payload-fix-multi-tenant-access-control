'use client'

import type { FieldType, Options, UploadInputProps } from '@payloadcms/ui'

import {
  UploadInput,
  useAllFormFields,
  useConfig,
  useDocumentInfo,
  useField,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback } from 'react'

import type { GenerateImage } from '../types.js'

import { Pill } from '../ui/Pill.js'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type MetaImageProps = UploadInputProps & {
  hasGenerateImageFn: boolean
}

export const MetaImage: React.FC<MetaImageProps> = (props) => {
  const { Label, hasGenerateImageFn, path, relationTo, required } = props || {}

  const field: FieldType<string> = useField(props as Options)

  const { t } = useTranslation()

  const locale = useLocale()
  const [fields] = useAllFormFields()
  const docInfo = useDocumentInfo()

  const { errorMessage, setValue, showError, value } = field

  const regenerateImage = useCallback(async () => {
    if (!hasGenerateImageFn) return

    const genImageResponse = await fetch('/api/plugin-seo/generate-image', {
      body: JSON.stringify({
        ...docInfo,
        doc: { ...fields },
        locale: typeof locale === 'object' ? locale?.code : locale,
      } satisfies Parameters<GenerateImage>[0]),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { result: generatedImage } = await genImageResponse.json()

    setValue(generatedImage || '')
  }, [fields, setValue, hasGenerateImageFn, locale, docInfo])

  const hasImage = Boolean(value)

  const config = useConfig()

  const { collections, routes: { api } = {}, serverURL } = config

  const collection = collections?.find((coll) => coll.slug === relationTo) || undefined

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div className="plugin-seo__field">
          {Label}

          {required && (
            <span
              style={{
                color: 'var(--theme-error-500)',
                marginLeft: '5px',
              }}
            >
              *
            </span>
          )}

          {hasGenerateImageFn && (
            <React.Fragment>
              &nbsp; &mdash; &nbsp;
              <button
                onClick={regenerateImage}
                style={{
                  background: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'currentcolor',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
                type="button"
              >
                {t('plugin-seo:autoGenerate')}
              </button>
            </React.Fragment>
          )}
        </div>
        {hasGenerateImageFn && (
          <div
            style={{
              color: '#9A9A9A',
            }}
          >
            {t('plugin-seo:imageAutoGenerationTip')}
          </div>
        )}
      </div>
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
        <UploadInput
          Error={errorMessage} // TODO: Fix
          api={api}
          collection={collection}
          filterOptions={{}}
          label={undefined}
          onChange={(incomingImage) => {
            if (incomingImage !== null) {
              const { id: incomingID } = incomingImage
              setValue(incomingID)
            } else {
              setValue(null)
            }
          }}
          relationTo={relationTo}
          required={required}
          serverURL={serverURL}
          showError={showError}
          style={{
            marginBottom: 0,
          }}
          value={value}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <Pill
          backgroundColor={hasImage ? 'green' : 'red'}
          color="white"
          label={hasImage ? t('plugin-seo:good') : t('plugin-seo:noImage')}
        />
      </div>
    </div>
  )
}
