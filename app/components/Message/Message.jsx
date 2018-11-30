import React from "react"
import classNames from "classnames"
// import { get } from "lodash/object"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Message.scss';


export const MESSAGETYPES = {
  'normal': {
    icon: "exclamation-circle"
  },
  'error': {
    icon: "exclamation-triangle"
  },
  'warning': {
    icon: "question-circle"
  },
  'success': {
    icon: "question-circle"
	},
	'ui': {
    icon: "info-circle"
  }
}

const getIcon = mode => {
  return MESSAGETYPES[mode].icon
}

const Message = ({
  children,
  hasMargin,
	isAnimated = true,
	isLeaving = false,
  isViewer = false,
	position = "bottom",
	hasMessage,
  mode = 'ui',
  text,
  title,
  icon,
	// onClose = () => console.log('remember to handle close button')
	onClose = () => {
		console.log('turning off');
	}
}) => {
	const theIcon = icon || getIcon(mode);
  return (
		<div className={styles.positioner}>
			<div
				className={classNames(styles.Message, styles[position], styles[mode], {
					[styles.hasMargin]: !!hasMargin,
					[styles.hasTitle]: !!title,
					[styles.isVisible]: !!hasMessage,
					[styles.isAnimated]: !!isAnimated,
					[styles.isLeaving]: !!isLeaving,
					[styles.isViewer]: !!isViewer,
				})}
			>
				<div className={styles.prefix}>
					<FontAwesomeIcon
						icon={theIcon}
						color={mode === 'ui' ? "#7A8DA1" : "#fff"}
						size={mode === 'ui' ? '1x' : '1x'}
						/>
				</div>
				<div className={styles.content}>
					{title && <h4>{title}</h4>}
					{text}
					{children}
				</div>
				{onClose && (
					<div className={styles.suffix}>
						<FontAwesomeIcon
							icon="times"
							color={mode === 'ui' ? "#7A8DA1" : "#fff"}
							size="1x"
							onClick={onClose}
						/>
					</div>
				)}
			</div>
		</div>
  )
}

Message.propTypes = {
  text: PropTypes.string,
  mode: PropTypes.oneOf([
		'ui',
		'normal',
		'info',
    'error',
    'warning',
    'success'
  ]),
  hasMargin: PropTypes.bool,
  icon: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func
}

Message.defaultProps = {
  mode: "normal"
}

export default Message
