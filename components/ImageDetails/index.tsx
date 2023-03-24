/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import CodeDotsIcon from 'components/icons/CodeDots'
import ListIcon from 'components/icons/ListIcon'
import PhotoUpIcon from 'components/icons/PhotoUpIcon'
import PlaylistXIcon from 'components/icons/PlaylistXIcon'
import SettingsIcon from 'components/icons/SettingsIcon'
import Linker from 'components/UI/Linker'
import ImageParamsForApi from 'models/ImageParamsForApi'
import { useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { IImageDetails } from 'types'
import { SourceProcessing } from 'utils/promptUtils'
import ImageSquare from 'components/ImageSquare'

import styles from './imageDetails.module.css'
import ImageOptionsWrapper from './ImageOptionsWrapper'
import Img2ImgModal from 'components/ImagePage/Img2ImgModal'

interface Props {
  imageDetails: IImageDetails
  isModal?: boolean
  handleClose?: () => any
  handleDeleteImageClick?: () => any
  handleTiling?: (bool: any) => any
}

const ImageDetails = ({
  imageDetails,
  isModal = false,
  handleClose = () => {},
  handleDeleteImageClick,
  handleTiling = () => {}
}: Props) => {
  const showFullScreen = useFullScreenHandle()
  const [fullscreen, setFullscreen] = useState(false)
  const [showImg2ImgModal, setShowImg2ImgModal] = useState(false)
  const [showTiles, setShowTiles] = useState(false)
  const [showRequestParams, setShowRequestParams] = useState(false)

  if (!imageDetails || imageDetails.id === 0) {
    return null
  }

  const handleFullScreen = () => {
    setFullscreen(true)
    showFullScreen.enter()
  }

  const handleOnTilingClick = (bool: boolean) => {
    handleTiling(bool)
    setShowTiles(bool)
  }

  const cleanData = () => {
    // @ts-ignore
    const params = new ImageParamsForApi(imageDetails)

    // @ts-ignore

    if (params.source_image) {
      // @ts-ignore
      params.source_image = '[true]'
    }

    // @ts-ignore
    if (params.source_mask) {
      // @ts-ignore
      params.source_mask = '[true]'
    }

    return params
  }

  const modelName =
    imageDetails && (imageDetails?.models[0] || imageDetails?.model)
  const isImg2Img =
    imageDetails.source_processing === SourceProcessing.Img2Img ||
    imageDetails.img2img

  const imgStyle: any = {}

  return (
    <>
      <FullScreen
        handle={showFullScreen}
        onChange={(isFullscreen) => setFullscreen(isFullscreen)}
      >
        {fullscreen && (
          <div
            className="w-full h-screen flex flex-row items-center justify-center"
            onClick={() => {
              showFullScreen.exit()
            }}
          >
            <img
              className={clsx(styles.img, 'max-h-screen max-w-full')}
              src={'data:image/webp;base64,' + imageDetails.base64String}
              alt={imageDetails.prompt}
            />
          </div>
        )}
      </FullScreen>
      {showImg2ImgModal && (
        <div className="z-[101] relative">
          <Img2ImgModal
            handleClose={() => setShowImg2ImgModal(false)}
            imageDetails={imageDetails}
          />
        </div>
      )}
      <div
        id="image-src"
        className={clsx(
          {
            loading: styles['img-loading']
          },
          'w-full flex justify-center'
        )}
      >
        <div className="max-w-[1400px] h-[512px] flex flex-row justify-center items-center">
          <img
            className={clsx(styles.img)}
            src={'data:image/webp;base64,' + imageDetails.base64String}
            alt={imageDetails.prompt}
            style={{ ...imgStyle }}
          />
        </div>
      </div>
      <ImageOptionsWrapper
        isModal={isModal}
        handleClose={handleClose}
        handleDeleteImageClick={handleDeleteImageClick}
        imageDetails={imageDetails}
        showTiles={showTiles}
        setShowTiles={handleOnTilingClick}
        handleFullScreen={handleFullScreen}
      />
      <div
        id="image-prompt-wrapper"
        className="mt-3 flex flex-col w-full justify-start items-center"
      >
        <div className="text-[16px] tablet:text-[18px] px-4 w-full max-w-[768px]">
          <div className="text-sm font-bold flex flex-row gap-2 items-center mb-[4px]">
            <PlaylistXIcon hideCross/>
            Prompt
          </div>
          <div className="w-full text-sm ml-[8px]">
            {imageDetails.prompt}
          </div>
        </div>
      </div>
      {imageDetails.negative && (
        <div
          id="image-negative-prompt-wrapper"
          className="mt-3 flex flex-col w-full justify-start items-center"
        >
          <div className="text-[16px] tablet:text-[18px] px-4 w-full max-w-[768px]">
            <div className="text-sm font-bold flex flex-row gap-2 items-center mb-[4px]">
              <PlaylistXIcon />
              Negative prompt
            </div>
            <div className="w-full text-sm ml-[8px]">
              {imageDetails.negative}
            </div>
          </div>
        </div>
      )}
      <div
        id="image-params-wrapper"
        className="mt-3 flex flex-col w-full justify-start items-center"
      >
        <div className="text-[16px] tablet:text-[18px] px-4 w-full max-w-[768px]">
          <div className="text-sm font-bold flex flex-row gap-2 items-center">
            <SettingsIcon />
            Image details
          </div>
          <div
            className={clsx([
              'bg-slate-800',
              'font-mono',
              'text-white',
              'text-sm',
              'overflow-x-auto',
              'mt-2',
              'mx-4',
              'rounded-md',
              'p-4',
              'w-full'
            ])}
          >
            {showRequestParams && (
              <pre>{JSON.stringify(cleanData(), null, 2)}</pre>
            )}
            {!showRequestParams && (
              <ul>
                <li>
                  <strong>Worker ID:</strong> {imageDetails.worker_id}
                </li>
                <li>
                  <strong>Worker name:</strong> {imageDetails.worker_name}
                </li>
                <li>&zwnj;</li>
                <li>
                  <strong>Sampler:</strong> {imageDetails.sampler}
                </li>
                {modelName ? (
                  <li>
                    <strong>Model:</strong>{' '}
                    <Linker
                      href={`/images?model=${modelName}`}
                      passHref
                      className="text-cyan-500"
                    >
                      {modelName}
                    </Linker>
                  </li>
                ) : null}
                {imageDetails.modelVersion && (
                  <li>
                    <strong>Model version:</strong> {imageDetails.modelVersion}
                  </li>
                )}
                <li>&zwnj;</li>
                <li>
                  <strong>Seed:</strong> {imageDetails.seed}
                </li>
                <li>
                  <strong>Steps:</strong> {imageDetails.steps}
                </li>
                <li>
                  <strong>Guidance / cfg scale:</strong>{' '}
                  {imageDetails.cfg_scale}
                </li>
                {isImg2Img && imageDetails.denoising_strength && (
                  <li>
                    <strong>Denoise:</strong>{' '}
                    {Number(imageDetails.denoising_strength).toFixed(2)}
                  </li>
                )}
                <li>&zwnj;</li>
                <li>
                  <strong>Karras:</strong>{' '}
                  {imageDetails.karras ? 'true' : 'false'}
                </li>
                <li>
                  <strong>Hi-res fix:</strong>{' '}
                  {imageDetails.hires ? 'true' : 'false'}
                </li>
                <li>
                  <strong>CLIP skip:</strong>{' '}
                  {imageDetails.clipskip ? imageDetails.clipskip : 1}
                </li>
                <li>
                  <strong>tiled:</strong>{' '}
                  {imageDetails.tiling ? 'true' : 'false'}
                </li>
                <li>&zwnj;</li>
                {imageDetails.control_type && (
                  <li>
                    <strong>Control type:</strong> {imageDetails.control_type}
                  </li>
                )}
                {imageDetails.image_is_control && (
                  <li>
                    <strong>Control map:</strong>{' '}
                    {imageDetails.image_is_control}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-2 w-full flex flex-row justify-end max-w-[768px]">
          <div
            className="text-sm cursor-pointer flex flex-row gap-2 items-center"
            onClick={() => {
              setShowRequestParams(!showRequestParams)
            }}
          >
            {showRequestParams ? <ListIcon /> : <CodeDotsIcon />}
            {showRequestParams
              ? 'show image details'
              : 'show request parameters'}
          </div>
        </div>
      </div>
      <div
        id="image-params-wrapper"
        className="mt-3 flex flex-col w-full justify-start items-center"
      >
        <div className="text-[16px] tablet:text-[18px] px-4 w-full max-w-[768px] gap-4 flex flex-row">
          {/* <div className="flex flex-col gap-2">
                <div className="text-sm font-bold flex flex-row gap-2 items-center mb-[4px]">
                  <PhotoUpIcon />
                  Parent image
                </div>
                <div>
                  <ImageSquare
                    imageDetails={{ base64String: imageDetails.source_image }}
                    imageType={imageDetails.imageType}
                    size={140}
                  />
                </div>
              </div> */}
          {imageDetails.source_image && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold flex flex-row gap-2 items-center mb-[4px]">
                <PhotoUpIcon />
                Source image
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setShowImg2ImgModal(true)}
              >
                <ImageSquare
                  imageDetails={{
                    base64String: imageDetails.source_image
                  }}
                  imageType={imageDetails.imageType}
                  size={140}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ImageDetails
