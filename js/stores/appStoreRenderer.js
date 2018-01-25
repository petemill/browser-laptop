/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const Immutable = require('immutable')
const EventEmitter = require('events').EventEmitter
const debounce = require('../lib/debounce')

let lastEmittedState
const CHANGE_EVENT = 'app-state-change'

class AppStoreRenderer extends EventEmitter {
  constructor () {
    super()
    this.appState = new Immutable.Map()
  }
  emitChanges () {
    if (lastEmittedState !== this.appState) {
      lastEmittedState = this.appState
      this.emit(CHANGE_EVENT)
    }
  }
  set state (appState) {
    this.appState = appState
    emitChanges()
  }
  get state () {
    return this.appState
  }
  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback)
  }
  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
}

const appStoreRenderer = new AppStoreRenderer()
window.pmAppStore = appStoreRenderer
const emitChanges = debounce(appStoreRenderer.emitChanges.bind(appStoreRenderer), 5)
module.exports = appStoreRenderer
