import { IconSettings } from '@tabler/icons-react'
import FlexRow from 'app/_components/FlexRow'
import Select from 'app/_components/Select'
import SubSectionTitle from 'app/_components/SubSectionTitle'
import DropdownOptions from 'app/_modules/DropdownOptions'
import { Button } from 'app/_components/Button'
import Checkbox from 'app/_components/Checkbox'
import Samplers from 'app/_data-models/Samplers'
import { useState } from 'react'
import { SourceProcessing } from '_types/horde'
import { useInput } from 'app/_modules/InputProvider/context'
import DefaultPromptInput from 'app/_data-models/DefaultPromptInput'

interface SelectSamplerProps {
  hideOptions?: boolean
}

export default function SelectSampler({
  hideOptions = false
}: SelectSamplerProps) {
  const { input, setInput } = useInput()
  const [showDropdown, setShowDropdown] = useState(false)

  const multiSamplerOptions = input?.multiSamplers.map((value) => {
    return { value, label: value }
  })

  return (
    <div style={{ marginBottom: '12px' }}>
      <SubSectionTitle>Sampler</SubSectionTitle>
      {(input.source_processing === SourceProcessing.InPainting &&
        input.models[0] === 'stable_diffusion_inpainting') ||
      (input.source_image && input.control_type !== '') ? (
        <div className="mt-[-6px] text-sm text-slate-500 dark:text-slate-400 font-[600]">
          Note: Sampler disabled when controlnet or inpainting model is used.
        </div>
      ) : (
        <>
          <FlexRow gap={4} style={{ position: 'relative' }}>
            <Select
              isDisabled={input.useAllSamplers}
              options={Samplers.dropdownOptions({
                model: input.models[0],
                isImg2Img: input.source_image
              })}
              onChange={(obj: { value: string; label: string }) => {
                if (input.useMultiSamplers) {
                  // @ts-ignore
                  const updateObject = obj.map((sampler) => sampler.value)
                  setInput({ multiSamplers: updateObject })
                } else {
                  setInput({ sampler: obj.value })
                }
              }}
              isMulti={input.useMultiSamplers}
              // @ts-ignore
              value={
                input.useMultiSamplers
                  ? multiSamplerOptions
                  : input.useAllSamplers
                  ? { label: 'Use all samplers', value: '' }
                  : Samplers.dropdownValue(input.sampler)
              }
            />
            {showDropdown && (
              <DropdownOptions
                handleClose={() => setShowDropdown(false)}
                title="Sampler options"
                top="46px"
              >
                <div style={{ padding: '8px 0' }}>
                  <Checkbox
                    label="Use multiple samplers?"
                    checked={input.useMultiSamplers}
                    onChange={(bool: boolean) => {
                      const updateObject: Partial<DefaultPromptInput> = {
                        useMultiSamplers: bool
                      }

                      if (bool) {
                        updateObject.useAllSamplers = false
                      }

                      setInput(updateObject)
                    }}
                  />
                </div>
                <div style={{ padding: '8px 0' }}>
                  <Checkbox
                    label="Use all samplers?"
                    checked={input.useAllSamplers}
                    onChange={(bool: boolean) => {
                      const updateObject: Partial<DefaultPromptInput> = {
                        useAllSamplers: bool
                      }

                      if (bool) {
                        updateObject.useMultiSamplers = false
                      }

                      setInput(updateObject)
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
          </FlexRow>
          {input.useAllSamplers && (
            <div style={{ fontSize: '12px', paddingTop: '4px' }}>
              Note: Disabled when &quot;use all samplers&quot; is selected
            </div>
          )}
        </>
      )}
    </div>
  )
}
