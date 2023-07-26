/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'

import Overlay from 'components/UI/Overlay'
import ImageDetails from 'components/ImageDetails'
import { IImageDetails } from 'types'
import ImageNavigation from './imageNavigation'
import CloseIcon from 'components/icons/CloseIcon'
import { useSwipeable } from 'react-swipeable'

import styles from './imageModal.module.css'
import clsx from 'clsx'
import useLockedBody from 'hooks/useLockedBody'

interface Props {
  disableNav?: boolean
  imageDetails: IImageDetails
  handleClose: () => any
  handleDeleteImageClick?: () => any
  handleLoadNext?: () => any
  handleLoadPrev?: () => any
  handleReloadImageData?: () => any
  onDeleteCallback?: () => any
}

const ImageModal = ({
  disableNav = false,
  handleClose = () => {},
  handleDeleteImageClick = () => {},
  handleLoadNext = () => {},
  handleLoadPrev = () => {},
  handleReloadImageData = () => {},
  onDeleteCallback = () => {},
  imageDetails
}: Props) => {
  const modal = useModal()
  const [, setLocked] = useLockedBody(false)
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (disableNav) return
      handleLoadNext()
    },
    onSwipedRight: () => {
      if (disableNav) return
      handleLoadPrev()
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 25
  })

  const onClose = useCallback(() => {
    handleClose()
    modal.remove()
  }, [handleClose, modal])

  const closeSwipe = useSwipeable({
    onSwipedDown: () => {
      onClose()
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 150
  })

  const [showTiles, setShowTiles] = useState(false)

  const handleTiling = (bool: boolean) => {
    setShowTiles(bool)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopImmediatePropagation()

      if (e.key === 'Escape') {
        if (showTiles) {
          return
        }

        onClose()
      }

      if (e.key === 'ArrowLeft') {
        handleLoadPrev()
      }

      if (e.key === 'ArrowRight') {
        handleLoadNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onClose, handleLoadNext, handleLoadPrev, showTiles])

  useEffect(() => {
    setLocked(true)

    return () => {
      setLocked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Overlay handleClose={onClose} />
      <div
        id="image-modal"
        className={clsx(styles['image-modal'])}
        {...handlers}
        style={{ maxWidth: '1280px' }}
      >
        <div
          className="flex flex-row justify-end w-full pr-2 mb-2"
          {...closeSwipe}
        >
          <div className={styles['close-btn']} onClick={onClose}>
            <CloseIcon size={28} />
          </div>
        </div>
        {!showTiles && !disableNav && (
          <ImageNavigation
            handleLoadNext={handleLoadNext}
            handleLoadPrev={handleLoadPrev}
          />
        )}
        <div
          id="image-details-content"
          className={styles['scrollable-content']}
        >
          <ImageDetails
            handleClose={onClose}
            handleDeleteImageClick={() => {
              onDeleteCallback()
              handleDeleteImageClick()
            }}
            handleReloadImageData={handleReloadImageData}
            imageDetails={imageDetails}
            isModal={true}
            handleTiling={handleTiling}
          />
        </div>
      </div>
    </>
  )
}

export default NiceModal.create(ImageModal)
