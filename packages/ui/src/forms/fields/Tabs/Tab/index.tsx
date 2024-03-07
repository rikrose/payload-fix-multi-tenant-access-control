'use client'
import { getTranslation } from '@payloadcms/translations'
import React, { useState } from 'react'

import type { MappedTab } from '../../../../utilities/buildComponentMap/types.js'

import { ErrorPill } from '../../../../elements/ErrorPill/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { WatchChildErrors } from '../../../WatchChildErrors/index.js'
import './index.scss'

const baseClass = 'tabs-field__tab-button'

type TabProps = {
  isActive?: boolean
  parentPath: string
  setIsActive: () => void
  tab: MappedTab
}

export const TabComponent: React.FC<TabProps> = ({ isActive, parentPath, setIsActive, tab }) => {
  const { name, label } = tab

  const { i18n } = useTranslation()
  const [errorCount, setErrorCount] = useState(undefined)
  const hasName = 'name' in tab

  const path = `${parentPath ? `${parentPath}.` : ''}${'name' in tab ? name : ''}`
  const fieldHasErrors = errorCount > 0

  return (
    <React.Fragment>
      <WatchChildErrors fieldMap={tab.subfields} path={path} setErrorCount={setErrorCount} />
      <button
        className={[
          baseClass,
          fieldHasErrors && `${baseClass}--has-error`,
          isActive && `${baseClass}--active`,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={setIsActive}
        type="button"
      >
        {label ? getTranslation(label, i18n) : hasName && name}
        {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} />}
      </button>
    </React.Fragment>
  )
}
