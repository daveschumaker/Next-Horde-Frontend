import ImageDetails from 'components/ImageDetails'
// import styles from './imageModal.module.css'
import CreateImageRequest from 'models/CreateImageRequest'

interface Props {
  handleClose?: () => any
  onDeleteCallback?: () => any
  handleDeleteImageClick?: () => any
  onCloseCallback?: () => any
  handleReloadImageData?: () => any
  imageDetails: CreateImageRequest
  handleTiling?: () => any
}

export default function ImageModalV2({
  handleClose = () => {},
  onDeleteCallback = () => {},
  handleDeleteImageClick = () => {},
  onCloseCallback = () => {},
  handleReloadImageData = () => {},
  imageDetails,
  handleTiling = () => {}
}: Props) {
  return (
    <div id="image-details-content" style={{ margin: '0 auto', width: '100%' }}>
      <ImageDetails
        handleClose={handleClose}
        handleDeleteImageClick={() => {
          onDeleteCallback()
          handleDeleteImageClick()
          onCloseCallback()
        }}
        handleReloadImageData={handleReloadImageData}
        imageDetails={imageDetails}
        isModal={true}
        handleTiling={handleTiling}
      />
    </div>
  )
}
