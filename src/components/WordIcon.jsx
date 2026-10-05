import { getIconPath, hasIcon } from '../utils/icons'

function WordIcon({ word, size, alt = '' }) {
  if (!hasIcon(word)) {
    return (
      <div
        className="icon-placeholder"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    )
  }

  return <img src={getIconPath(word)} alt={alt} width={size} height={size} />
}

export default WordIcon
