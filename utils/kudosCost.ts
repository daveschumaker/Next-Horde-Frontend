// Modified from Litnine on Discord
// https://github.com/evguu/AI-Horde/blob/faq-edit/kudos/kudos_standalone.js
// and from AqualXX method on StableUI:
// https://github.com/aqualxx/stable-ui/blob/a685761440cd9ff55f86e6ee694adc147cd1971d/src/stores/generator.ts#L278

import AppSettings from '../models/AppSettings'

interface IKudosCostParams {
  width: number
  height: number
  steps: number
  samplerName: string
  hasSourceImage: boolean
  denoisingStrength: number
  postProcessors: string[]
  usesControlNet: boolean
  prompt: string
  numImages: number
}

export const kudosCostV2 = ({
  width,
  height,
  steps,
  samplerName,
  hasSourceImage,
  denoisingStrength,
  postProcessors,
  usesControlNet,
  prompt,
  numImages
}: IKudosCostParams) => {
  const result =
    Math.pow(height * width - 64 * 64, 1.75) /
    Math.pow(1024 * 1024 - 64 * 64, 1.75)

  const accurateSteps = getAccurateSteps(
    steps,
    samplerName,
    hasSourceImage,
    denoisingStrength
  )

  let kudos = 0.1232 * accurateSteps + result * (0.1232 * accurateSteps * 8.75)
  for (let i = 0; i < postProcessors.length; i++) kudos *= 1.2
  kudos *= usesControlNet && hasSourceImage ? 3 : 1
  kudos += countWeights(prompt)
  kudos *= hasSourceImage ? 1.5 : 1
  kudos *= postProcessors.includes('RealESRGAN_x4plus') ? 1.3 : 1
  kudos *= postProcessors.includes('CodeFormers') ? 1.3 : 1
  kudos += AppSettings.get('shareImagesExternally') === true ? 1 : 3
  kudos *= numImages

  return (Math.round(kudos * 100) / 100) * numImages
}

export const getAccurateSteps = (
  steps: number,
  samplerName: string,
  hasSourceImage: boolean,
  denoisingStrength: number
) => {
  const samplerAccurateSteps = () => {
    if (['k_dpm_adaptive'].includes(samplerName)) {
      return 50
    }

    if (
      ['k_heun', 'k_dpm_2', 'k_dpm_2_a', 'k_dpmpp_2s_a'].includes(samplerName)
    ) {
      return steps * 2
    }
    return steps
  }

  steps = samplerAccurateSteps()

  if (hasSourceImage) {
    steps *= denoisingStrength || 0.8
  }

  return steps
}

function countWeights(prompt: string = '') {
  let open = false
  let count = 0
  for (const char of prompt) {
    if (char == '(') {
      open = true
    }

    if (char == ')' && open) {
      open = false
      count++
    }
  }
  return count
}
