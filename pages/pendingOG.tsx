import Head from 'next/head'
import { trackEvent } from '../api/telemetry'
import PendingPageComponent from '../components/PendingPage'
import { useEffectOnce } from '../hooks/useEffectOnce'

const PendingPage = () => {
  useEffectOnce(() => {
    trackEvent({
      event: 'PAGE_VIEW',
      context: '/pages/pending'
    })
  })

  return (
    <>
      <Head>
        <title>Pending images - ArtBot for Stable Diffusion</title>
      </Head>
      <PendingPageComponent />
    </>
  )
}

export default PendingPage
