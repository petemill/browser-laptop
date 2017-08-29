/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const ImmutableComponent = require('../immutableComponent')
const {StyleSheet, css} = require('aphrodite/no-important')
const globalStyles = require('../styles/global')
/**
 * Represents an on/off switch control
 */
class SwitchControl extends ImmutableComponent {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.props.onClick({
      target: {
        value: !this.props.checkedOn
      }
    })
  }

  render () {
    const { large, small, compact, wide, disabled, primary, offTextL10nId, onTextL10nId, titleTextL10nId } = this.props
    const isChecked = this.props.checkedOn
    const hasTitle = !!titleTextL10nId
    return (
      <label
        data-test-id={this.props.testId}
        data-switch-status={this.props.checkedOn}
        className={css(
            styles.switchControl,
            large && styles.switchControl_large,
            small && styles.switchControl_small,
            disabled && styles.switchControl_disabled,
            primary && styles.switchControl_primary,
            compact && styles.switchControl_compact,
            wide && styles.switchControl_wide,
            hasTitle && styles.switchControl_withTitle
        ) + (this.props.className ? ` ${this.props.className}` : '')
        }>

        <input onChange={!disabled && this.onClick.bind(this)} className={css(styles.switchControl__control)} type='checkbox' />

        <span className={css(styles.switchControl__title)}>

          { titleTextL10nId &&
            <span
              className={css(
                styles.switchControl__titleText
              )}
              data-l10n-id={titleTextL10nId} />
          }

          <span className={css(
              styles.switchControl__indicator,
              isChecked && styles.switchControl__indicator_checked
            )} />

        </span>

        { offTextL10nId &&
          <span
            className={css(styles.switchControl__textOff)}
            data-l10n-id={offTextL10nId} />
        }

        {
          onTextL10nId &&
            <span
              className={css(styles.switchControl__textOn)}
              data-l10n-id={onTextL10nId} />
        }

      </label>
    )
  }
}

const transitionTime = '.1s'
const transitionType = 'ease-in-out'
const styles = StyleSheet.create({

  switchControl: {
    '--horizontal-label-spacing': '1ch',
    '--vertical-label-spacing': '3.75px',
    '--nub-size': '12px',
    '--indicator-width': '45px',
    '--indicator-height': '16px',
    '--indicator-bg': '#ccc',
    '--indicator-bg-checked': '#ff6000',
    '--indicator-padding': '2px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: 'max-content',
    maxWidth: '100%',
    padding: '5px',
    color: 'inherit',
    boxSizing: 'border-box',
  },

  switchControl_large: {
    '--indicator-bg': '#adadad',
    '--nub-size': '22px',
    '--indicator-width': '60px',
    '--indicator-height': '26px'
  },

  switchControl_small: {
    '--indicator-bg': '#adadad',
    '--nub-size': '10px',
    '--indicator-width': '30px',
    '--indicator-height': '12px',
    '--indicator-padding': '1px',
    fontSize: 'smaller'
  },

  switchControl_primary: {
    '--on-text-color': globalStyles.color.braveOrange,
    color: '#999',
    fontWeight: 'bold'
  },

  switchControl_compact: {
    '--horizontal-label-spacing': '.75ch',
    '--vertical-label-spacing': 'var(--vertical-label-spacing) * .75',
    lineHeight: 1
  },

  switchControl_wide: {
    '--horizontal-label-spacing': 'calc(1ch + 15px)'
  },

  switchControl_disabled: {
    opacity: '0.3',
    '--indicator-bg-checked': 'var(--indicator-bg)'
  },

  switchControl_withTitle: {
    '--label-bottom-margin': 'calc((var(--indicator-height) / 2) - .5rem)',
    alignItems: 'flex-end'
  },

  // native input is visually hidden
  switchControl__control: {
    boxSizing: 'border-box',
    opacity: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0
  },

  switchControl__title: {
    boxSizing: 'border-box',
    order: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  switchControl__titleText: {
    boxSizing: 'border-box',
    marginBottom: 'var(--vertical-label-spacing)',
    textAlign: 'center',
    color: '#bbb'
  },

  switchControl__textOff: {
    boxSizing: 'border-box',
    order: 1,
    color: 'inherit',
    marginRight: 'var(--horizontal-label-spacing)',
    marginBottom: 'var(--label-bottom-margin)',
    fontWeight: 'inherit'
  },

  switchControl__textOn: {
    boxSizing: 'border-box',
    order: 3,
    marginLeft: 'var(--horizontal-label-spacing)',
    color: 'inherit',
    color: 'var(--on-text-color)',
    marginBottom: 'var(--label-bottom-margin)',
    fontWeight: 'inherit'
  },

  switchControl__indicator: {
    boxSizing: 'border-box',
    display: 'block',
    position: 'relative',
    padding: 'var(--indicator-padding)',
    width: 'var(--indicator-width)',
    height: 'var(--indicator-height)',
    background: 'var(--indicator-bg)',
    borderRadius: 'calc(var(--indicator-height) / 2)',
    boxShadow: 'inset 0 1px calc(var(--indicator-padding) * 2) rgba(0, 0, 0, 0.35)',
    transition: `background ${transitionTime} ${transitionType}`,

    // nub
    ':before': {
      display: 'block',
      position: 'absolute',
      left: 'var(--indicator-padding)',
      content: '""',
      width: 'var(--nub-size)',
      height: 'var(--nub-size)',
      borderRadius: '100%',
      background: 'white',
      boxShadow: '1px 1px calc(var(--indicator-padding) * 2) calc(var(--indicator-padding * -1)) black',
      transition: `left ${transitionTime} ${transitionType}`
    }
  },

  // aphrodite does not support repeated long selectors, i.e. ':checked ~ switchControl__indicator' so we have to add a class in JS instead of relying on css state
  switchControl__indicator_checked: {
    background: 'var(--indicator-bg-checked)',

    // nub
    ':before': {
      left: 'calc(100% - var(--nub-size) - var(--indicator-padding))'
    }
  }
})

module.exports = SwitchControl
