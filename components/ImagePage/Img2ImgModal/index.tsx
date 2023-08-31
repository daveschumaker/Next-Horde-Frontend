/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  uploadImg2Img,
  uploadInpaint
} from '../../../controllers/imageDetailsCommon'
import useComponentState from '../../../hooks/useComponentState'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { setBase64FromDraw } from '../../../store/canvasStore'
import { setInputCache } from '../../../store/inputCache'
import { SourceProcessing } from '../../../utils/promptUtils'
import EyeIcon from '../../icons/EyeIcon'
import { Button } from 'app/_components/Button'
import InteractiveModal from '../../UI/InteractiveModal/interactiveModal'
import PageTitle from 'app/_components/PageTitle'
import styles from './img2imgModal.module.css'

const Img2ImgModal = ({
  handleClose,
  imageDetails
}: {
  handleClose: () => void
  imageDetails: any
}) => {
  const size = useWindowSize()
  const router = useRouter()
  const { source_image, source_mask } = imageDetails

  const ref = useRef<any>(null)

  const [componentState, setComponentState] = useComponentState({
    containerHeight: 512,
    imageMaxHeight: 700,
    viewMask: false
  })

  useEffect(() => {
    if (ref?.current?.clientHeight) {
      setTimeout(() => {
        let containerHeight = ref?.current?.clientHeight ?? 0
        let imageHeight = containerHeight

        if (window.innerHeight <= containerHeight) {
          containerHeight = window.innerHeight - 80
          imageHeight = window.innerHeight - 170
        }

        setComponentState({
          containerHeight: containerHeight,
          imageMaxHeight: imageHeight
        })
      }, 100)
    }
  }, [imageDetails.source_image, setComponentState])

  let isMobile = false
  if (size && size.width) {
    isMobile = size.width < 640 || false
  }

  return (
    <InteractiveModal
      className={styles['styled-modal']}
      handleClose={handleClose}
      setDynamicHeight={componentState.containerHeight}
    >
      <div className={styles['content-wrapper']} ref={ref}>
        <PageTitle>Source image</PageTitle>
        <div className={styles['image-container']}>
          <img
            className={styles['src-img']}
            src={'data:image/webp;base64,' + source_image}
            alt="source image for img2img request"
          />
          {componentState.viewMask && (
            <img
              className={clsx(
                styles['src-img-mask'],
                imageDetails.source_processing === SourceProcessing.Img2Img &&
                  styles['invert-mask']
              )}
              src={'data:image/webp;base64,' + source_mask}
              alt="source image mask for img2img request"
            />
          )}
        </div>
        <div className={styles['options-wrapper']}>
          {source_mask && (
            <Button
              onClick={() => {
                if (componentState.viewMask) {
                  setComponentState({ viewMask: false })
                } else {
                  setComponentState({ viewMask: true })
                }
              }}
              width={isMobile ? '100%' : ''}
            >
              <EyeIcon /> Toggle mask
            </Button>
          )}
          <Button
            onClick={() => {
              // Kinda hacky since it's using the load drawing method.
              setBase64FromDraw({
                base64: imageDetails.source_image,
                height: imageDetails.height,
                width: imageDetails.width
              })

              const inputToSave = {
                loadInputForControlNet: true,
                prompt: imageDetails.prompt,
                negative: imageDetails.negative,
                models: imageDetails.models,
                steps: imageDetails.steps,
                cfg_scale: imageDetails.cfg_scale,
                control_type: imageDetails.control_type
              }

              setInputCache(inputToSave)

              router.push(`/controlnet?drawing=true`)
            }}
            size="small"
            width={isMobile ? '100%' : ''}
          >
            Use for ControlNet
          </Button>
          <Button
            onClick={() => {
              uploadImg2Img(imageDetails, { useSourceImg: true })
              router.push(`/create?panel=img2img&edit=true`)
            }}
            size="small"
            width={isMobile ? '100%' : ''}
          >
            Use for img2img
          </Button>
          <Button
            onClick={() => {
              uploadInpaint(imageDetails, { clone: false, useSourceImg: true })
              router.push(`/create?panel=inpainting&edit=true`)
            }}
            size="small"
            width={isMobile ? '100%' : ''}
          >
            Use for inpaint
          </Button>
          {source_mask && (
            <Button
              onClick={() => {
                uploadInpaint(imageDetails, {
                  clone: true,
                  useSourceImg: true,
                  useSourceMask: true
                })
                router.push(`/create?panel=inpainting&edit=true`)
              }}
              size="small"
              width={isMobile ? '100%' : ''}
            >
              Clone mask
            </Button>
          )}
        </div>
      </div>
    </InteractiveModal>
  )
}

export default Img2ImgModal
