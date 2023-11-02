import { useEffect, useState } from 'react'
import InputSwitchV2 from '../InputSwitchV2'
import { useInput } from 'app/_modules/InputProvider/context'
const HiresFix = () => {
  const { input, setInput } = useInput()
  const [error, setError] = useState('')

  useEffect(() => {
    if ((input.source_image || input.source_mask) && input.hires) {
      setError('Can only be used for text2img requests')
      setInput({ hires: false })
      return
    }

    if (error && !input.source_image && !input.source_mask) {
      setError('')
    }
  }, [error, input, setInput])

  return (
    <InputSwitchV2
      label="Hires fix"
      tooltip="Partially renders image at a lower resolution before upscaling it and adding more detail. Useful to avoid things like double heads when requesting higher resolution images."
      // @ts-ignore
      moreInfoLink={
        input.source_image && (
          <div className="mt-[-4px] text-xs text-slate-500 dark:text-slate-400 font-[600]">
            <strong>Note:</strong> Cannot be used for img2img requests
          </div>
        )
      }
      disabled={input.source_image || error ? true : false}
      handleSwitchToggle={() => {
        if (!input.hires) {
          setInput({ hires: true })
        } else {
          setInput({ hires: false })
        }
      }}
      checked={input.hires}
    />
  )
}

export default HiresFix
