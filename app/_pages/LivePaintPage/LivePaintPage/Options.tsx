import ControlNetOptions from 'app/_modules/AdvancedOptionsPanel/ControlNetOptions'
import NumericInputSlider from 'app/_modules/AdvancedOptionsPanel/NumericInputSlider'
import SelectSampler from 'app/_modules/AdvancedOptionsPanel/SelectSampler'
import SelectModel from 'app/_modules/AdvancedOptionsPanel/SelectModel'
import { Button } from 'components/UI/Button'
import FlexRow from 'components/UI/FlexRow'
import Input from 'components/UI/Input'
import MaxWidth from 'components/UI/MaxWidth'
import Section from 'app/_components/Section'
import SubSectionTitle from 'app/_components/SubSectionTitle'
import TextTooltipRow from 'app/_components/TextTooltipRow'
import ArrowBarLeftIcon from 'components/icons/ArrowBarLeftIcon'
import GrainIcon from 'components/icons/GrainIcon'
import { Tooltip } from 'react-tooltip'
import { useStore } from 'statery'
import { userInfoStore } from 'store/userStore'
import { maxSteps } from 'utils/validationUtils'
import PromptInput from 'app/_pages/CreatePage/PromptInput'

export const LivePaintOptions = ({ input, setInput }: any) => {
  const userState = useStore(userInfoStore)
  const { loggedIn } = userState

  return (
    <div className="flex flex-col w-full gap-2">
      <PromptInput input={input} setInput={setInput} />
      <FlexRow>
        <SelectSampler input={input} setInput={setInput} />
      </FlexRow>
      <FlexRow>
        <NumericInputSlider
          label="Steps"
          tooltip="Fewer steps generally result in quicker image generations.
              Many models achieve full coherence after a certain number
              of finite steps (60 - 90). Keep your initial queries in
              the 30 - 50 range for best results."
          from={1}
          to={maxSteps({
            sampler: input.sampler,
            loggedIn: loggedIn === true ? true : false,
            isSlider: true
          })}
          step={1}
          input={input}
          setInput={setInput}
          fieldName="steps"
          fullWidth
          enforceStepValue
        />
      </FlexRow>
      <FlexRow>
        <NumericInputSlider
          label="Guidance"
          tooltip="Higher numbers follow the prompt more closely. Lower
                numbers give more creativity."
          from={1}
          to={30}
          step={0.5}
          input={input}
          setInput={setInput}
          fieldName="cfg_scale"
          fullWidth
        />
      </FlexRow>

      <FlexRow>
        <NumericInputSlider
          label="Denoise"
          tooltip="Amount of noise added to input image. Values that
                  approach 1.0 allow for lots of variations but will
                  also produce images that are not semantically
                  consistent with the input. Only available for img2img."
          from={0.0}
          to={1.0}
          step={0.05}
          input={input}
          setInput={setInput}
          fieldName="denoising_strength"
          disabled={
            input.models &&
            input.models[0] &&
            input.models[0].indexOf('_inpainting') >= 0
          }
        />
      </FlexRow>

      <FlexRow>
        <ControlNetOptions
          forceDisplay
          hideControlMap
          input={input}
          setInput={setInput}
        />
      </FlexRow>

      <FlexRow>
        <Section>
          <SubSectionTitle>
            <TextTooltipRow>
              Seed
              <Tooltip
                // @ts-expect-error
                tooltipId="seed-tooltip"
              >
                Leave seed blank for random.
              </Tooltip>
            </TextTooltipRow>
          </SubSectionTitle>
          <MaxWidth
            // @ts-ignore
            width="240px"
          >
            <div className="flex flex-row gap-2">
              <Input
                // @ts-ignore
                className="mb-2"
                type="text"
                name="seed"
                onChange={(e: any) => {
                  setInput({ seed: e.target.value })
                }}
                // @ts-ignore
                value={input.seed}
                width="100%"
              />
              <Button
                title="Insert random seed"
                onClick={() => {
                  const value = Math.abs((Math.random() * 2 ** 32) | 0)
                  setInput({ seed: value })
                }}
              >
                <GrainIcon />
              </Button>
              <Button
                theme="secondary"
                title="Clear"
                onClick={() => {
                  setInput({ seed: '' })
                }}
              >
                <ArrowBarLeftIcon />
              </Button>
            </div>
          </MaxWidth>
        </Section>
      </FlexRow>

      <FlexRow>
        <SelectModel input={input} setInput={setInput} />
      </FlexRow>

      <FlexRow>
        <NumericInputSlider
          label="CLIP skip"
          tooltip="Determine how early to stop processing a prompt using CLIP. Higher
          values stop processing earlier. Default is 1 (no skip)."
          from={1}
          to={12}
          step={1}
          input={input}
          setInput={setInput}
          fieldName="clipskip"
          enforceStepValue
        />
      </FlexRow>
    </div>
  )
}
