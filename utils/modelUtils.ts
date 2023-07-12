import { modelStore } from '../store/modelStore'
import { SourceProcessing } from './promptUtils'

export const getModelVersion = (modelName: string) => {
  if (modelStore.state.modelDetails[modelName]) {
    return modelStore.state.modelDetails[modelName].version || ''
  }

  return ''
}

// Hide things like inpainting models and other things we don't care for.
export const validModelsArray = ({
  imageParams = {
    source_image: '',
    source_mask: '',
    source_processing: SourceProcessing.Prompt
  },
  sort = 'workers',
  filterNsfw = false
} = {}) => {
  const modelDetails = modelStore.state.modelDetails
  const img2img =
    imageParams.source_processing === SourceProcessing.Img2Img ||
    imageParams.source_processing === SourceProcessing.InPainting
  const inpainting = imageParams.source_mask ? true : false

  const modelsArray: any = []
  const availableModels =
    JSON.parse(JSON.stringify(modelStore.state.availableModels)) || {}

  for (const key in availableModels) {
    const modelName = availableModels[key].name
    if (
      filterNsfw &&
      modelDetails &&
      modelDetails[modelName] &&
      modelDetails[modelName]?.nsfw === true
    ) {
      continue
    }

    // Temporarily (permanently) removing this. We should go ahead and show all models.
    // Show a relevant warning in the UI when selected and user is missing a source mask
    // https://github.com/daveschumaker/artbot-for-stable-diffusion/issues/65
    // if (
    //   availableModels[key].name === 'stable_diffusion_inpainting' &&
    //   inpainting === false
    // ) {
    //   continue
    // }

    // pix2pix cannot do txt2img.
    if (availableModels[key].name === 'pix2pix' && !imageParams.source_image) {
      continue
    }

    // Per Discord, stable_diffusion_2.0 cannot do img2img.
    if (
      availableModels[key].name === 'stable_diffusion_2.0' &&
      (img2img !== false || inpainting !== false)
    ) {
      continue
    }

    // Depth2Image cannot do text2img
    if (
      availableModels[key].name === 'Stable Diffusion 2 Depth' &&
      img2img !== true
    ) {
      continue
    }

    // Per Discord, stable_diffusion_2.1 cannot do inpainting.
    if (
      availableModels[key].name === 'stable_diffusion_2.1' &&
      inpainting !== false
    ) {
      continue
    }

    // This model is borked and we should never ever show it.
    if (availableModels[key].name === 'stable_diffusion_1.4') {
      continue
    }

    let displayName = availableModels[key].name
    if (availableModels[key].name === 'stable_diffusion_inpainting') {
      displayName = 'Stable Diffusion v1.5 Inpainting'
    }

    modelsArray.push({
      name: availableModels[key].name,
      value: availableModels[key].name,
      label: `${displayName} (${availableModels[key].count})`,
      count: availableModels[key].count
    })

    if (sort === 'workers') {
      modelsArray.sort((a: any, b: any) => {
        if (typeof a.count === 'undefined' || isNaN(a.count)) {
          return 0
        }

        if (typeof b.count === 'undefined' || isNaN(b.count)) {
          return 0
        }

        if (a.count < b.count) {
          return 1
        }
        if (a.count > b.count) {
          return -1
        }
        return 0
      })
    }
  }

  return modelsArray
}
