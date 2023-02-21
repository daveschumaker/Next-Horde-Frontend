import { useState } from 'react'
import { HexAlphaColorPicker } from 'react-colorful'
import { ORIENTATION_OPTIONS } from '../../../../constants'
import { IOrientation } from '../../../../types'
import CloseIcon from '../../../icons/CloseIcon'
import { Button } from '../../../UI/Button'
import InteractiveModal from '../../../UI/InteractiveModal/interactiveModal'
import PageTitle from '../../../UI/PageTitle'
import SelectComponent from '../../../UI/Select'
import SubSectionTitle from '../../../UI/SubSectionTitle'

const NewCanvas = ({
  handleClose = () => {},
  handleOnCreateClick = () => {}
}: {
  handleClose: () => void
  handleOnCreateClick: (obj: {
    height: number
    width: number
    bgColor: string
  }) => void
}) => {
  const [color, setColor] = useState('#ffffff')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [orientationValue, setOrientationValue] = useState<IOrientation>({
    value: 'square',
    label: 'Square',
    height: 1,
    width: 1
  })

  const filterOrientations = ORIENTATION_OPTIONS.filter((obj) => {
    return obj.value !== 'custom' && obj.value !== 'random'
  })

  return (
    <InteractiveModal
      handleClose={handleClose}
      maxWidth="480px"
      setDynamicHeight={340}
    >
      <div className="px-4">
        <PageTitle>New canvas</PageTitle>
        <div>
          <SubSectionTitle>
            Select orientation
            <div className="mb-2 text-sm font-[400]">
              Note: Image size will be scaled to your device&apos;s current
              viewport.
            </div>
          </SubSectionTitle>
          <SelectComponent
            className="z-30"
            options={filterOrientations}
            onChange={(obj: IOrientation) => {
              setOrientationValue(obj)
            }}
            value={orientationValue}
            isSearchable={false}
          />
        </div>
        <div className="mt-2 flex flex-row gap-2 items-center">
          <div className="font-[700]">Background color</div>
          <div
            className="w-[50px] h-[30px] rounded border border-black cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => {
              if (showColorPicker) {
                setShowColorPicker(false)
              } else {
                setShowColorPicker(true)
              }
            }}
          ></div>
        </div>
        {showColorPicker && (
          <div className="mt-4 flex flex-row w-full justify-center gap-2">
            <HexAlphaColorPicker
              color={color}
              onChange={(value: string) => {
                setColor(value)
              }}
            />
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowColorPicker(false)
              }}
            >
              <CloseIcon />
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-row items-center justify-center gap-2">
          <Button
            onClick={() => {
              if (orientationValue.height && orientationValue.width) {
                handleOnCreateClick({
                  height: orientationValue.height,
                  width: orientationValue.width,
                  bgColor: color
                })
              }
            }}
            width="280px"
          >
            Create
          </Button>
        </div>
      </div>
    </InteractiveModal>
  )
}

export default NewCanvas
