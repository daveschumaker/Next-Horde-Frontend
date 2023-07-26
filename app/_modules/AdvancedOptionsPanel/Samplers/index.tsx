import ReactSwitch from 'react-switch'
import { trackEvent } from '../../../../api/telemetry'
import DefaultPromptInput from '../../../../models/DefaultPromptInput'
import PromptInputSettings from '../../../../models/PromptInputSettings'
import { SourceProcessing } from '../../../../utils/promptUtils'
import MaxWidth from 'components/UI/MaxWidth'
import Section from 'app/_components/Section'
import Select from 'app/_components/Select'
import SubSectionTitle from 'app/_components/SubSectionTitle'
import TextTooltipRow from 'app/_components/TextTooltipRow'
import TooltipComponent from 'app/_components/TooltipComponent'
import { samplerOptions } from './samplers.controller'

interface IProps {
  input: DefaultPromptInput
  setInput: (obj: any) => void
  showMultiModel?: boolean
  hideShowAllSamplers?: boolean
}

const Samplers = ({
  input,
  setInput,
  showMultiModel = false,
  hideShowAllSamplers = false
}: IProps) => {
  const samplerValue = samplerOptions(input).filter((option) => {
    return input.sampler === option.value
  })[0]

  const showAllSamplersInput =
    input.source_processing !== SourceProcessing.Img2Img &&
    input.source_processing !== SourceProcessing.InPainting &&
    !input.useAllModels &&
    !input.useFavoriteModels &&
    !showMultiModel &&
    !hideShowAllSamplers

  return (
    <>
      {!input.useAllSamplers && (
        <Section>
          <SubSectionTitle>Sampler</SubSectionTitle>
          {(input.source_processing === SourceProcessing.InPainting &&
            input.models[0] === 'stable_diffusion_inpainting') ||
          (input.source_image && input.control_type !== '') ? (
            <div className="mt-[-6px] text-sm text-slate-500 dark:text-slate-400 font-[600]">
              Note: Sampler disabled when controlnet or inpainting model is
              used.
            </div>
          ) : (
            <MaxWidth
              // @ts-ignore
              width="240px"
            >
              <Select
                options={samplerOptions(input)}
                onChange={(obj: { value: string; label: string }) => {
                  PromptInputSettings.set('sampler', obj.value)
                  setInput({ sampler: obj.value })
                }}
                value={samplerValue}
              />
            </MaxWidth>
          )}
        </Section>
      )}
      {showAllSamplersInput && (
        <Section>
          <SubSectionTitle>
            <TextTooltipRow>
              Use all samplers
              <TooltipComponent tooltipId="use-all-samplers-tooltip">
                Automatically generate an image for sampler
              </TooltipComponent>
            </TextTooltipRow>
          </SubSectionTitle>
          <ReactSwitch
            disabled={
              input.useMultiGuidance || input.useMultiSteps ? true : false
            }
            onChange={() => {
              if (!input.useAllSamplers) {
                trackEvent({
                  event: 'USE_ALL_SAMPLERS_CLICK',
                  context: '/pages/index'
                })
                setInput({
                  numImages: 1,
                  useAllSamplers: true,
                  useAllModels: false,
                  useFavoriteModels: false,
                  useMultiSteps: false
                })

                PromptInputSettings.set('numImages', 1)
                PromptInputSettings.set('useAllSamplers', true)
                PromptInputSettings.set('useAllModels', false)
                PromptInputSettings.set('useFavoriteModels', false)
                PromptInputSettings.set('useMultiSteps', false)
              } else {
                PromptInputSettings.set('useAllSamplers', false)
                setInput({ useAllSamplers: false })
              }
            }}
            checked={input.useAllSamplers}
          />
        </Section>
      )}
    </>
  )
}

export default Samplers
