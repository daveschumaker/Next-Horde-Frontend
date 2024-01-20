import status, { StatusSuccessResponse } from 'app/_api/horde/status'
import download, {
  DownloadErrorResponse,
  DownloadSuccessResponse
} from 'app/_api/horde/download'
import { addImageToDexie, getImageByHordeId } from 'app/_db/image_files'
import ImageModel, { ImageStatus } from 'app/_data-models/v2/ImageModel'
import { getPendingJob, updatePendingJobV2 } from '../pendingJobsCache'
import { JobStatus } from '_types'
import { addCompletedJobToDexie } from 'app/_utils/db'

export const completedImageJob = async (jobId: string) => {
  const job = getPendingJob(jobId)

  // Handle potential race condition
  if (job.jobStatus === JobStatus.Done) {
    return false
  }

  const data = await status(jobId)

  if (data.success) {
    const successData = data as StatusSuccessResponse

    const downloadPromises = successData.generations.map(async (img) => {
      const imageExists = await getImageByHordeId(img.id)

      if (imageExists) {
        return { status: 'fulfilled', value: img.id }
      }

      if (img.censored) {
        const imageData = new ImageModel({
          jobId,
          hordeId: img.id,
          status: ImageStatus.CENSORED,
          message:
            'The GPU worker was unable to complete this request. Try again? (Error code: X)',
          model: img.model,
          worker_id: img.worker_id,
          worker_name: img.worker_name
        })

        await addImageToDexie(imageData)

        return { status: 'fulfilled', value: 'image censored' }
      }

      try {
        const payload: DownloadSuccessResponse | DownloadErrorResponse =
          await download(img.img)
        if (payload.success) {
          const successData = payload as DownloadSuccessResponse
          const imageData = new ImageModel({
            jobId,
            hordeId: img.id,
            blob: successData.blob,
            model: img.model,
            worker_id: img.worker_id,
            worker_name: img.worker_name
          })

          await addImageToDexie(imageData)
        } else {
          console.log(`Error in downloading payload`)
          console.log(payload)

          const imageData = new ImageModel({
            jobId,
            hordeId: img.id ?? '',
            status: ImageStatus.ERROR,
            message: 'Unable to download image',
            model: img.model ?? '',
            worker_id: img.worker_id ?? '',
            worker_name: img.worker_name ?? ''
          })

          await addImageToDexie(imageData)

          return { status: 'fulfilled', value: 'unknown error' }
        }
      } catch (error) {
        console.error(`Error in downloading image: ${img.img}`, error)

        const imageData = new ImageModel({
          jobId,
          hordeId: img.id ?? '',
          status: ImageStatus.ERROR,
          message: 'Unable to download image',
          model: img.model ?? '',
          worker_id: img.worker_id ?? '',
          worker_name: img.worker_name ?? ''
        })

        await addImageToDexie(imageData)

        return { status: 'rejected', reason: error }
      }
    })

    await Promise.allSettled(downloadPromises)

    if (successData.done === true) {
      await updatePendingJobV2(
        Object.assign({}, job, {
          finished: job.numImages,
          jobStatus: JobStatus.Done
        })
      )

      await addCompletedJobToDexie(
        Object.assign({}, job, {
          finished: job.numImages,
          jobStatus: JobStatus.Done
        })
      )
    }
  }
}
