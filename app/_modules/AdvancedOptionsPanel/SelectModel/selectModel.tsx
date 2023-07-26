/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useStore } from 'statery'
import PromptInputSettings from 'models/PromptInputSettings'

import { modelStore } from 'store/modelStore'
import AlertTriangleIcon from 'components/icons/AlertTriangle'
import Linker from 'components/UI/Linker'
import MaxWidth from 'components/UI/MaxWidth'
import ModelWarning from 'components/UI/ModelWarning'
import Section from 'app/_components/Section'
import Select from 'app/_components/Select'
import SubSectionTitle from 'app/_components/SubSectionTitle'
import TextTooltipRow from 'app/_components/TextTooltipRow'
import TooltipComponent from 'app/_components/TooltipComponent'
import { MODEL_LIMITED_BY_WORKERS } from '_constants'

interface IProps {
  input: any
  modelerOptions: (data: any) => Array<any>
  setInput: (data: any) => void
}

const SelectModel = ({ input, setInput, modelerOptions }: IProps) => {
  const router = useRouter()
  const modelState = useStore(modelStore)
  const { availableModels, modelDetails } = modelState

  const modelsValue = modelerOptions(input).filter((option) => {
    return input?.models?.indexOf(option.value) >= 0
  })

  return (
    <Section>
      <SubSectionTitle>
        <TextTooltipRow>
          Model
          <TooltipComponent tooltipId="model-dropdown-tooltip">
            Models currently available within the horde. Numbers in parentheses
            indicate number of works. Generally, these models will generate
            images quicker.
          </TooltipComponent>
        </TextTooltipRow>
      </SubSectionTitle>
      <MaxWidth
        // @ts-ignore
        width="480px"
      >
        <Select
          menuPlacement={'top'}
          //@ts-ignore
          options={modelerOptions(input)}
          onChange={(obj: { value: string; label: string }) => {
            if (router.query.model) {
              router.push(
                {
                  pathname: '/'
                },
                undefined,
                { scroll: false }
              )
            }

            if (obj.value === 'stable_diffusion_2.0') {
              setInput({
                models: [obj.value],
                sampler: 'dpmsolver'
              })

              PromptInputSettings.set('models', [obj.value])
              PromptInputSettings.set('sampler', 'dpmsolver')
            } else if (
              input.sampler === 'dpmsolver' &&
              obj.value !== 'stable_diffusion_2.0'
            ) {
              setInput({ models: [obj.value], sampler: 'k_euler_a' })
              PromptInputSettings.set('models', [obj.value])
              PromptInputSettings.set('sampler', 'k_euler_a')
            } else {
              PromptInputSettings.set('models', [obj.value])
              setInput({ models: [obj.value] })
            }
          }}
          // @ts-ignore
          value={modelsValue}
          isSearchable={true}
        />
        <div className="mt-2 text-xs">
          <Linker
            href={`/info/models${
              input.models[0] !== 'random' ? `#${input.models[0]}` : ''
            }`}
          >
            [ View detailed model info ]
          </Linker>
        </div>
      </MaxWidth>
      {availableModels[input.models[0]]?.count <= MODEL_LIMITED_BY_WORKERS && (
        <div className="mb-2">
          <ModelWarning>
            <AlertTriangleIcon size={32} /> This model has limited availability.
            Images may take a long time to generate.
          </ModelWarning>
        </div>
      )}
      {modelDetails[input.models[0]]?.showcases && (
        <MaxWidth
          // @ts-ignore
          width="240px"
          className="mt-2"
        >
          <div className="mb-2 text-sm">
            Example output using {input.models[0]}
          </div>
          <img
            src={modelDetails[input.models[0]]?.showcases[0]}
            alt="Model example"
            width="240"
            height="240"
            // loading="lazy"
          />
        </MaxWidth>
      )}
      <MaxWidth
        // @ts-ignore
        width="480px"
      >
        {modelDetails[input.models[0]] && (
          <div className="mt-2 text-xs">
            {modelDetails[input.models[0]].description &&
              `${modelDetails[input.models[0]].description}`}
            <br />
            {modelDetails[input.models[0]].style &&
              `Style: ${modelDetails[input.models[0]].style}`}{' '}
            {modelDetails[input.models[0]].nsfw && ` (nsfw)`}
            {Array.isArray(modelDetails[input.models[0]]?.trigger) &&
            modelDetails[input.models[0]].trigger?.length === 1 ? (
              <>
                <br />
                Trigger words: &quot;
                {
                  //@ts-ignore
                  modelDetails[input.models[0]]?.trigger[0]
                }
                &quot;
              </>
            ) : null}
          </div>
        )}
      </MaxWidth>
    </Section>
  )
}

export default SelectModel
