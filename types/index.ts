import { SourceProcessing } from 'utils/promptUtils'

export enum ArtBotJobTypes {
  Text2Img = 'Text2Img',
  Img2Img = 'Img2Img',
  Drawing = 'Drawing',
  Inpainting = 'Inpainting',
  Upscale = 'Upscale',
  Reroll = 'Reroll',
  CopyPrompt = 'CopiedPrompt',
  SharedPrompt = 'SharedPrompt',
  Variation = 'Variation'
}

export enum Common {
  Empty = ''
}
export interface CreateImageJob {
  id: number
  jobTimestamp?: number
  jobId?: string
  jobStatus?: string
  img2img?: boolean
  prompt: string
  height: number
  width: number
  timestamp?: number
  cfg_scale: number
  karras: boolean
  hires: boolean
  clipskip: number
  steps: number
  sampler: string
  apikey?: string
  seed: string
  numImages?: number
  useTrusted?: boolean
  parentJobId?: string
  models: Array<string>
  negative: string
  allowNsfw?: boolean
  source_image?: string
  source_mask?: string
  stylePreset: string
  denoising_strength?: number
  orientationType?: string
  orientation?: string
  wait_time?: number
  queue_position?: number
  base64String?: string
  initWaitTime?: number
  canvasStore?: any
  tiling: boolean
  post_processing: Array<string>

  has_source_mask?: boolean
  has_source_image?: boolean
}

export interface NewRating {
  dataset_id: string
  id: string
  url: string
}

// TODO: Probably should just extend CreateImageJob?
export interface IImageDetails {
  base64String: string
  favorited: boolean
  id: number
  timestamp: number
  jobId: string
  prompt: string
  shortlink: string
  negative: string
  worker_name: string
  worker_id: string
  sampler: string
  modelVersion: string
  seed: string
  steps: string
  denoising_strength: number
  thumbnail: string
  source_image: string
  imageType: string
  cfg_scale: number
  control_type: string
  image_is_control: boolean
  karras: boolean
  hires: boolean
  clipskip: number
  tiling: boolean
  models: string[]
  model: string
  source_processing: SourceProcessing
  img2img: boolean
}

export interface CreatePendingJob {
  id?: number
  timestamp: number
  jobStatus?: JobStatus
  errorMessage?: string
  groupJobId: string
  jobId?: string
  prompt: string
  img2img?: boolean
  numImages: number
  orientationType: string
  orientation: string
  karras: boolean
  height: number
  width: number
  parentJobId: string
  jobTimestamp: number
  models: Array<string>
  cfg_scale: number
  steps: number
  sampler: string
  jobStartTimestamp: number

  source_processing?: string
  has_source_mask?: boolean
  has_source_image?: boolean
  post_processing: Array<string>
  useAllModels?: boolean
}

export interface DiffusionModel {
  name: string
  count: number
  performance: number
}

export interface GenerateResponse {
  id: string
  message?: string
}

export enum JobStatus {
  Waiting = 'waiting', // waiting to submit to stable horde api
  Requested = 'requested', // Job sent to API, waiting for response.
  Queued = 'queued', // submitted and waiting
  Processing = 'processing', // image has been sent to a worker and is in-process
  Done = 'done', // finished
  Error = 'error' // something unfortunate has happened
}

export interface IBase64String {
  base64String: string
  height: number
  width: number
}

export interface ICanvas {
  cached: boolean
  canvasRef: any
  drawLayer: any
  maskLayer: any
  visibleCanvas: any
  height: any
  width: any
}

export enum ImageMimeType {
  Png = 'image/png',
  WebP = 'image/webp'
}

export interface ImageSize {
  orientation: string
  height: number
  width: number
}

export interface KeypressEvent {
  keyCode: number
  preventDefault: () => {}
  shiftKey: boolean
}

export interface ModelDetails {
  name: string
  count?: number
}
export interface IOrientation {
  value: string
  label: string
  width?: number
  height?: number
}

export enum PromptTypes {
  DefaultNegative = 'defaultNegative',
  Negative = 'negative',
  PromptFavorite = 'promptFavorite',
  PromptHistory = 'promptHistory'
}

export enum ControlTypes {
  None = '',
  Canny = 'canny',
  Hed = 'hed',
  Depth = 'depth',
  Normal = 'normal',
  Openpose = 'openpose',
  Seg = 'seg',
  Scribble = 'scribble',
  FakeScribbles = 'fakescribbles',
  Hough = 'hough'
}
