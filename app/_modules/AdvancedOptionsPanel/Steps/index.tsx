import { GetSetPromptInput } from 'types'
import FlexRow from 'app/_components/FlexRow'
import { Button } from 'components/UI/Button'
import { IconSettings } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import DropdownOptions from 'app/_modules/DropdownOptions'
import Checkbox from 'components/UI/Checkbox'
import Input from 'components/UI/Input'
import SubSectionTitle from 'app/_components/SubSectionTitle'
import TextTooltipRow from 'app/_components/TextTooltipRow'
import TooltipComponent from 'app/_components/TooltipComponent'
import { maxSteps } from 'utils/validationUtils'
import { useStore } from 'statery'
import { userInfoStore } from 'store/userStore'
import NumberInput from 'app/_components/NumberInput'

interface StepsOptions extends GetSetPromptInput {
  hideOptions?: boolean
}

export default function Steps({
  hideOptions = false,
  input,
  setInput
}: StepsOptions) {
  const userState = useStore(userInfoStore)
  const { loggedIn } = userState

  const [showDropdown, setShowDropdown] = useState(false)
  const [step, setStep] = useState(1)

  const handleChangeStep = useCallback(() => {
    if (step === 1) {
      setStep(5)
    } else if (step === 5) {
      setStep(10)
    } else {
      setStep(1)
    }
  }, [step])

  const MAX_STEPS = maxSteps({
    sampler: input.sampler,
    loggedIn: loggedIn === true ? true : false,
    isSlider: true
  })

  return (
    <FlexRow
      style={{ alignItems: 'flex-end', columnGap: '4px', position: 'relative' }}
    >
      {input.useMultiSteps && (
        <div className="w-full">
          <SubSectionTitle>
            <TextTooltipRow>
              Steps
              <span
                className="text-xs w-full font-[400]"
                style={{ paddingRight: '4px', width: 'auto' }}
              >
                &nbsp;(1 -{' '}
                {maxSteps({
                  sampler: input.sampler,
                  loggedIn: loggedIn === true ? true : false
                })}
                )
              </span>
              <TooltipComponent tooltipId="multi-steps-tooltip">
                Comma separated values to create a series of images using
                multiple steps. Example: 16, 20, 25, 40
              </TooltipComponent>
            </TextTooltipRow>
          </SubSectionTitle>
          <Input
            // @ts-ignore
            type="text"
            name="multiSteps"
            onChange={(e: any) => {
              setInput({ multiSteps: e.target.value })
            }}
            placeholder="16, 20, 25, 40"
            // @ts-ignore
            value={input.multiSteps}
            width="100%"
          />
        </div>
      )}
      {!input.useMultiSteps && (
        <div style={{ width: '100%' }}>
          <SubSectionTitle>
            <TextTooltipRow>
              Steps
              <span style={{ fontSize: '12px', fontWeight: '400' }}>
                &nbsp;(1 - {MAX_STEPS})
              </span>
              <TooltipComponent tooltipId="steps-tooltip">
                Fewer steps generally result in quicker image generations. Many
                models achieve full coherence after a certain number of finite
                steps (60 - 90). Keep your initial queries in the 30 - 50 range
                for best results.
              </TooltipComponent>
            </TextTooltipRow>
          </SubSectionTitle>
          <FlexRow gap={4}>
            <NumberInput
              min={1}
              max={MAX_STEPS}
              // disabled={disabled}
              onInputChange={(e) => {
                setInput({ steps: Number(e.target.value) })
              }}
              onMinusClick={() => {
                if (input.steps - step < 1) {
                  return
                }

                setInput({ steps: input.steps - step })
              }}
              onPlusClick={() => {
                if (input.steps + step > MAX_STEPS) {
                  return
                }

                setInput({ steps: input.steps + step })
              }}
              onChangeStep={handleChangeStep}
              step={step}
              value={input.steps}
              width="100%"
            />
          </FlexRow>
        </div>
      )}
      <div>
        <div
          className="label_padding"
          style={{ height: '16px', width: '1px' }}
        />
        {showDropdown && (
          <DropdownOptions
            handleClose={() => setShowDropdown(false)}
            title="Step options"
            top="80px"
          >
            <div style={{ padding: '8px 0' }}>
              <Checkbox
                label="Use multi steps?"
                checked={input.useMultiSteps}
                onChange={(bool: boolean) => {
                  setInput({ useMultiSteps: bool })
                }}
              />
            </div>
          </DropdownOptions>
        )}
        {!hideOptions && (
          <Button onClick={() => setShowDropdown(true)}>
            <IconSettings stroke={1.5} />
          </Button>
        )}
      </div>
    </FlexRow>
  )
}
