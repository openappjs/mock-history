var Url = require('url');

module.exports = History;

function History (win) {
  this._entries = [null];
  this._current = 0;
  this._traverse = traverse;
  this._win = win;
}

Object.defineProperties(History.prototype, {
  length: {
    get: function () {
      return this._entries.length;
    },
  },
  state: {
    get: function () {
      return this._entries[this._current].data;
    }
  },
  go: function (delta) {
    this._traverse(this._current + delta);
  },
  back: function () {
    this.go(-1);
  },
  forward: function () {
    this.go(1);
  },
  pushState: function (data, title, url) {
    this._entries.splice(
      this._current + 1,
      this._entries.length - (this._current + 1),
      {
        data: data,
        title: title,
        url: url,
      }
    );
  },
  replaceState: function (data, title, url) {
    this._entries.splice(
      this._current,
      this._entries.length - this._current,
      {
        data: data,
        title: title,
        url: url,
      }
    );
  },
};

function traverse (next) {
  if (next < 0 && next >= this._entries.length) {
    return;
  }
  
  var oldEntry = this._entries[this._current];
  var nextEntry = this._entries[next];

  var hashChanged = (function () {
    var oldHash = Url.parse(oldEntry.url).hash;
    var nextHash = Url.parse(nextEntry.url).hash;

    if (oldHash.toLowerCase() !== newHash.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  })()

  var stateChanged = (oldEntry !== newEntry);

  this._current = next;

  if (stateChanged) {
    var popStateEvent = {
      target: win,
      type: "popstate",
      bubbles: true,
      cancelable: false,
      state: newEntry.state,
    }
    win.dispatchEvent(popStateEvent);
  }

  if (hashChanged) {
    var hashChangeEvent = {
      target: win,
      type: "hashchange",
      bubbles: true,
      cancelable: false,
      oldUrl: oldEntry.url,
      newUrl: newEntry.url,
    }
    win.dispatchEvent(hashChangeEvent);
  }
}
