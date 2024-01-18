import { SavedLora } from '_types/artbot'
import { SourceProcessing } from 'app/_utils/promptUtils'
import AppSettings from './AppSettings'
import { CONTROL_TYPES, Lora, TextualInversion } from '_types/horde'
import { castTiInject } from 'app/_utils/hordeUtils'
import CreateImageRequest from './CreateImageRequest'

export interface IApiParams {
  prompt: string
  params: ParamsObject
  nsfw: boolean
  censor_nsfw: boolean
  trusted_workers: boolean
  models: Array<string>
  source_image?: string
  source_processing?: string
  source_mask?: string
  r2?: boolean
  replacement_filter?: boolean
  shared?: boolean
  workers?: Array<string>
  slow_workers?: boolean
  worker_blacklist?: boolean
  dry_run?: boolean
}

interface ParamsObject {
  sampler_name?: string // Optional due to ControlNet
  cfg_scale: number
  height: number
  width: number
  seed?: string
  steps: number
  denoising_strength?: number
  control_type?: string
  image_is_control?: boolean
  return_control_map?: boolean
  facefixer_strength?: number
  karras: boolean
  hires_fix: boolean
  clip_skip: number
  tiling: boolean
  post_processing: string[]
  n: number
  loras?: Lora[]
  tis?: TextualInversion[]
}

interface IOptions {
  hasError?: boolean
}

class ImageParamsForApi {
  constructor(imageDetails: CreateImageRequest, options: IOptions = {}) {
    const useTrusted =
      typeof AppSettings.get('useTrusted') === 'undefined'
        ? true
        : AppSettings.get('useTrusted')
    const allowNsfw = AppSettings.get('allowNsfwImages') || false

    // Temporarily (?) disabled as rating of user generated AI images is no longer supported by the AI Horde
    // const shareImage = AppSettings.get('shareImagesExternally') || false
    const shareImage = false

    const useAllowedWorkers = AppSettings.get('useAllowedWorkers') || false
    const useBlockedWorkers = AppSettings.get('useBlockedWorkers') || false
    const allowedWorkers = AppSettings.get('allowedWorkers') || []
    const blockedWorkers = AppSettings.get('blockedWorkers') || []

    const {
      cfg_scale,
      clipskip = 1,
      control_type,
      denoising_strength,
      dry_run = false,
      facefixer_strength,
      height,
      hires = false,
      image_is_control,
      karras = false,
      loras = [],
      models,
      negative,
      numImages = 1,
      post_processing = [],
      prompt,
      return_control_map,
      sampler,
      seed = '',
      source_image,
      source_mask,
      source_processing,
      steps,
      tiling = false,
      tis = [],
      width
    } = imageDetails

    const { hasError = false } = options

    // explicitly check if prompt-replacement filter is disabled by user. Otherwise, set to true.
    let replacement_filter =
      AppSettings.get('useReplacementFilter') === false ? false : true

    if (replacement_filter && prompt.length >= 1000) {
      replacement_filter = false
    }

    const apiParams: IApiParams = {
      prompt: negative ? `${prompt} ### ${negative}` : prompt,
      params: {
        cfg_scale: Number(cfg_scale),
        seed: String(seed),
        sampler_name: sampler,
        height: Number(height),
        width: Number(width),
        post_processing: [...post_processing],
        steps: Number(steps),
        tiling,
        karras,
        hires_fix: hires,
        clip_skip: clipskip,
        n: numImages
      },
      nsfw: allowNsfw, // Use workers that allow NSFW images
      censor_nsfw: !allowNsfw, // Show user NSFW images if created
      trusted_workers: useTrusted,
      models,
      r2: true,
      replacement_filter,
      worker_blacklist: false,
      shared: shareImage,
      slow_workers: AppSettings.get('slow_workers') === false ? false : true,
      dry_run
    }

    if (useBlockedWorkers && blockedWorkers.length > 0) {
      const blocked = blockedWorkers.map(
        (worker: { value: string }) => worker.value
      )
      apiParams.workers = [...blocked]
      apiParams.worker_blacklist = true
    }

    if (!useBlockedWorkers && useAllowedWorkers && allowedWorkers.length > 0) {
      const allowed = allowedWorkers.map(
        (worker: { value: string }) => worker.value
      )
      apiParams.workers = [...allowed]

      // Potential ArtBot / AI Horde API interface issue.
      // If we're explicitly choosing a worker, we probably don't care, delete them.
      // Somehow, this seems to allow jobs to be processed again.
      delete apiParams.worker_blacklist
      delete apiParams.slow_workers
      delete apiParams.replacement_filter

      apiParams.shared = false
      apiParams.trusted_workers = false
    }

    if (!useAllowedWorkers && !useBlockedWorkers) {
      delete apiParams.worker_blacklist
      delete apiParams.workers
    }

    // If user has enabled forceSelectedWorker, override any other worker preference setting.
    const worker = sessionStorage.getItem('forceSelectedWorker')
    if (worker) {
      const workerId = JSON.parse(worker).value
      apiParams.workers = [workerId]
      delete apiParams.worker_blacklist
      delete apiParams.slow_workers

      apiParams.shared = false
      apiParams.trusted_workers = false
    }

    if (source_processing === SourceProcessing.Img2Img) {
      apiParams.params.denoising_strength = Number(denoising_strength) || 0.75
      apiParams.source_image = source_image
      apiParams.source_processing = 'img2img'

      if (source_mask) {
        apiParams.source_mask = source_mask
      }
    }

    if (loras && Array.isArray(loras) && loras.length > 0) {
      apiParams.params.loras = loras.map((lora: SavedLora) => {
        const loraObj: Lora = {
          name: String(lora.name),
          model: lora.model,
          clip: lora.clip
        }

        if (lora.parentModelId && lora.parentModelId !== lora.name) {
          loraObj.is_version = true
        } else {
          delete loraObj.is_version
        }

        return loraObj
      })
    }

    if (tis && Array.isArray(tis) && tis.length > 0) {
      apiParams.params.tis = castTiInject(tis)
    }

    if (
      source_processing ===
      (SourceProcessing.InPainting || SourceProcessing.OutPainting)
    ) {
      apiParams.params.denoising_strength = Number(denoising_strength) || 0.75
      apiParams.source_image = source_image
      apiParams.source_processing = source_processing
      apiParams.source_mask = source_mask
    }

    if (control_type !== CONTROL_TYPES.empty && source_image) {
      apiParams.params.control_type = control_type
      apiParams.params.image_is_control = image_is_control
      apiParams.params.return_control_map = return_control_map
    }

    if (control_type === CONTROL_TYPES.none) {
      // Handle a very poor decision on my part
      apiParams.params.control_type = ''
      delete apiParams.params.image_is_control
      delete apiParams.params.return_control_map
    }

    // Strip source_image and _source mask from object if we want to show request details if error occurred.
    if (hasError === true) {
      if (apiParams.source_image) {
        apiParams.source_image = '[true] (string removed for log output)'
      }

      if (apiParams.source_mask) {
        apiParams.source_mask = '[true] (string removed for log output)'
      }
    }

    if (facefixer_strength) {
      apiParams.params.facefixer_strength = facefixer_strength
    }

    if (control_type !== CONTROL_TYPES.empty && source_image) {
      // Fields removed before sending request to API.
      delete apiParams.params.sampler_name
    }

    if (loras && loras.length === 0) {
      delete apiParams.params.loras
    }

    return apiParams
  }
}

export default ImageParamsForApi
