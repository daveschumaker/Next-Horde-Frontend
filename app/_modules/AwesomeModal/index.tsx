/**
 * I'm tired of all the different modal implementations around this web app.
 * This will be the final, one true modal to use everywhere.
 *
 * Hopefully...
 */

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Overlay from 'app/_components/Overlay'
import useLockedBody from 'hooks/useLockedBody'
import React, { useEffect, useState } from 'react'
import styles from './awesomeModal.module.css'
import useModalHeight from './useModalHeight'
import { IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import ModalContentWrapper from './modalContentWrapper'
import TooltipComponent from 'app/_components/TooltipComponent'

interface Props {
  children?: React.ReactNode
  className?: string
  disableBackground?: boolean
  handleClose?(): any
  label?: string
  subtitle?: string
  tooltip?: string
}

function AwesomeModal({
  children,
  className,
  disableBackground = false,
  handleClose = () => {},
  label,
  subtitle,
  tooltip
}: Props) {
  const modal = useModal()
  const [locked, setLocked] = useLockedBody(false)
  const [maxModalHeight] = useModalHeight()
  const [contentHeight, setContentHeight] = useState(100)

  const onClose = () => {
    modal.remove()
    handleClose()
  }

  // Handle modal content height
  useEffect(() => {}, [contentHeight])

  // Handle lock body
  useEffect(() => {
    if (modal.visible && !locked) {
      setLocked(true)
    }
  }, [locked, modal.visible, setLocked])

  // Listen for keypress
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      setLocked(false)
      window.removeEventListener('keydown', handleKeyPress)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!modal.visible) {
    return null
  }

  const getContentHeight = (height: number) => {
    setContentHeight(height)
  }

  return (
    <>
      <Overlay
        blurBackground
        disableBackground={disableBackground}
        handleClose={onClose}
      />
      <div
        className={clsx(styles.ModalWrapper, className)}
        style={{
          height: `${contentHeight}px`,
          maxHeight: `${maxModalHeight}px`
        }}
      >
        <div className={styles.CloseButton} onClick={onClose}>
          <IconX stroke={1.5} size={28} />
        </div>
        {label && (
          <div className={styles.ModalLabel}>
            {label}
            {tooltip && (
              <TooltipComponent tooltipId="sdxl-beta-tooltip-modal">
                {tooltip}
              </TooltipComponent>
            )}
          </div>
        )}
        {subtitle && <div className={styles.ModalSubtitle}>{subtitle}</div>}
        <div
          className={clsx(
            styles.ModalContent,
            subtitle && styles.ModalContentSubtitleOffset
          )}
          id="modal_content"
          style={{
            height: `${contentHeight}px`,
            maxHeight: `calc(${maxModalHeight}px - ${subtitle ? 72 : 56}px)`
          }}
        >
          <ModalContentWrapper getContentHeight={getContentHeight}>
            {children}
          </ModalContentWrapper>
        </div>
      </div>
    </>
  )
}

export default NiceModal.create(AwesomeModal)
