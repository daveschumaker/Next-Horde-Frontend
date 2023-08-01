'use client'

import { initPendingJobService } from 'controllers/pendingJobsController'
import { useEffectOnce } from 'hooks/useEffectOnce'
import { initAppSettings } from 'utils/appSettings'
import { initDb } from 'utils/db'
import { initializePrimaryWindowOnLoad } from 'utils/primaryWindow'
import AppTheme from '../AppTheme'

export default function AppInit() {
  useEffectOnce(() => {
    initAppSettings()
    initDb()
    initPendingJobService()
    initializePrimaryWindowOnLoad()
  })

  return <AppTheme />
}
