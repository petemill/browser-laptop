/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ReduxComponent = require('../../reduxComponent')

// State helpers
const titleState = require('../../../../common/state/tabContentState/titleState')
const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabUIState = require('../../../../common/state/tabUIState')
const tabState = require('../../../../common/state/tabState')

// Utils
const platformUtil = require('../../../../common/lib/platformUtil')
const isWindows = platformUtil.isWindows()
const isDarwin = platformUtil.isDarwin()

// Styles
const globalStyles = require('../../styles/global')
const {theme} = require('../../styles/theme')

class TabTitle extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const tabId = ownProps.tabId
    const frameKey = frameStateUtil.getFrameKeyByTabId(currentWindow, tabId)

    const props = {}
    props.isWindows = isWindows
    props.isDarwin = isDarwin
    props.isPinned = tabState.isTabPinned(state, tabId)
    props.showTabTitle = titleState.showTabTitle(currentWindow, frameKey)
    props.displayTitle = titleState.getDisplayTitle(currentWindow, frameKey)
    props.addExtraGutter = tabUIState.addExtraGutterToTitle(currentWindow, frameKey)
    props.isTextWhite = tabUIState.checkIfTextColor(currentWindow, frameKey, 'white')
    props.tabId = tabId

    return props
  }

  render () {
    if (this.props.isPinned || !this.props.showTabTitle) {
      return null
    }
    return <div data-test-id='tabTitle'
      className={css(
        styles.tab__title,
        this.props.addExtraGutter && styles.tab__title_extraGutter,
        (this.props.isDarwin && this.props.isTextWhite) && styles.tab__title_isDarwin,
        // Windows specific style
        this.props.isWindows && styles.tab__title_isWindows
      )}>
      {this.props.displayTitle}
    </div>
  }
}

module.exports = ReduxComponent.connect(TabTitle)

const styles = StyleSheet.create({

  tab__title: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 1,
    userSelect: 'none',
    fontSize: globalStyles.fontSize.tabTitle,
    lineHeight: '1',
    minWidth: 0, // see https://stackoverflow.com/a/36247448/4902448
    marginLeft: '6px',
    overflow: 'hidden',
    // relative position is required for background-clip
    position: 'relative',
    transition: `background ${theme.tab.transitionDurationOut} ${theme.tab.transitionEasingOut}`,
    // fade text color to transparent if it's too long,
    // whilst preserving ability to animate the color with a second background layer
    background: `linear-gradient(to left, var(--tab-background) 0, var(--tab-color) 9px) right top / 9px 100% no-repeat, var(--tab-color)`,
    WebkitBackgroundClip: 'text !important', // !important is neccessary because aphrodite will put this at top of ruleset :-(
    color: 'transparent'
  },

  tab__title_isDarwin: {
    fontWeight: '400'
  },

  tab__title_isWindows: {
    fontWeight: '500',
    fontSize: globalStyles.fontSize.tabTitle
  },

  tab__title_extraGutter: {
    margin: '0 2px'
  }
})
