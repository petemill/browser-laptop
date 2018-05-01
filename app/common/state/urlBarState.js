/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const Immutable = require('immutable')

const api = {

  /**
   * Selects the portion of state related to the urlbar configuration
   * for the current window's active frame
   */
  getActiveFrameUrlBarState: (activeFrame) =>
    activeFrame.getIn(['navbar', 'urlbar'], Immutable.Map()),

  /**
   * Selects either the default search provider or the one overriden by
   * the current frame
   */
  getSearchData: function (state, activeFrame) {
    // TODO: don't have activeFrame param when reselect is used for state retrieval memoization
    const urlbar = api.getActiveFrameUrlBarState(activeFrame)
    const activeFrameIsPrivate = activeFrame.get('isPrivate')
    const urlbarSearchDetail = urlbar && urlbar.get('searchDetail')
    const appSearchDetail = state.get('searchDetail')
    const activateSearchEngine = urlbarSearchDetail && urlbarSearchDetail.get('activateSearchEngine')

    // get default search provider from app state
    let searchURL =
      (activeFrameIsPrivate && appSearchDetail.has('privateSearchURL'))
        ? appSearchDetail.get('privateSearchURL')
        : appSearchDetail.get('searchURL')
    let searchShortcut = ''
    // change search url if overrided by active frame state or shortcut
    if (activateSearchEngine) {
      const provider = urlbarSearchDetail
      searchShortcut = new RegExp('^' + provider.get('shortcut') + ' ', 'g')
      searchURL =
        (activeFrame.get('isPrivate') && provider.has('privateSearch'))
          ? provider.get('privateSearch')
          : provider.get('search')
    }
    return {
      searchURL,
      searchShortcut
    }
  }

}

module.exports = api
