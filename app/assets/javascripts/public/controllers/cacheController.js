/*
 * An object store for temporary client side FG data.
 * All data is lost on hard reload.
 */
$(function() {

  Qvocab.Controllers.CacheController = Backbone.View.extend({

    cache: {},
    expiration: {},
    persisted: {},
    viewBindings: {},

    initialize: function() {
      var _this = this;

      this.router = Qvocab.router;
      this.eventsController = Qvocab.events;
      this.preloadImages();
      // this.bindEvents();

      // this.listenTo(this.eventsController, 'login', this.updateCache);
      // this.listenTo(this.eventsController, 'logout', this.clearCache);
    },

    // bind any events for invalidating cache items, fetching, etc.
    bindEvents: function() {},

    /*
     * Check to see if a key exists in the cache
     *
     * @param (string) -> the key to look for
     *
     * @returns boolean
     */
    hasKey: function(key) {
      return typeof this.cache[key] !== 'undefined';
    },

    /*
     * Get a cached object or 'false' if it doesn't exist
     *
     * @param (string) -> the key to look for
     *
     * @returns the object or 'false' if the key doesn't exist
     */
    getCachedObject: function(key) {
      if (!this.hasKey(key)) { return false; }
      if (this.isExpired(key, true)) { return false; }
      return this.cache[key];
    },

    // shortcut to this.getCachedObject
    get: function(key) {
      return this.getCachedObject(key);
    },

    /*
     * Gets the cached object for a given key or stores one instead.
     *
     * @param (string) -> the key to look for
     * @param (object) -> the object to store if one doesn't exist
     *
     * @returns the object
     */
    getOrStore: function(key, obj) {
      if (this.getCachedObject(key)) { return this.getCachedObject(key); }

      this.store(key, obj);
      return this.getCachedObject(key);
    },

    /*
     * Check to see if a key is expired yet and optionally force it's expiration
     *
     * @param (string) -> the key to look for
     * @param (boolean), optional -> clears the key if it's expired
     *
     * @returns (boolean)
     */
    isExpired: function(key, clear) {
      if (typeof this.expiration[key] === 'undefined') { return false; }
      if (this.expiration[key] === false) { return false; }

      var isExpired = (new Date() - this.expiration[key].ttl) > this.expiration[key].setAt;
      clear = typeof clear === 'undefined' ? false : clear;

      if (isExpired && clear) { delete this.cache[key]; this.cache[key] = {}; }

      return isExpired;
    },

    /*
     * Set an expiration on a key after which point 'expired:[key]' will be trigged.
     * Expired keys are cleared during getCachedObject calls
     *
     * @param (string) -> the key to set an expiration for
     * @param (int) -> time to live in seconds
     */
    setExpiration: function(key, ttl) {
      this.expiration[key] = {
        ttl: ttl * 1000,
        setAt: new Date(),
        timeout: setTimeout(_.bind(function() {
          this.eventsController.trigger('expired:' + key);
        }, this), ttl * 1000)
      };
    },

    /*
     * Binds a cached object to the life of a view. When the view is closed
     * (determined by listening to the view's "onClose" event), we clear the cached object.
     *
     * @param (string) -> the key of the cached object
     * @param (object) -> a Backbone view
     */
    bindKeyToView: function(key, view) {
      var _this = this;

      if (!this.hasKey(key)) { return; }

      if (_.has(this.viewBindings, view.cid)) {
      // if the view is already being listened to, push this key to this.viewBindings
        this.viewBindings[view.cid].push(key);
      } else {
      // otherwise, instantiate this.viewBindings with "key"
        this.viewBindings[view.cid] = [key];

        // remove each key when the view closes
        this.listenToOnce(view, 'onClose', _.bind(function() {
          _.each(this.viewBindings[view.cid], function(key) {
            _this.deleteKey(key);
          });
        }, this));
      }
    },

    // Refresh the expiration on a cache key
    refresh: function(key) {
      this.expiration[key].setAt = new Date();
    },

    /*
     * Stores an object in the cache. Optionally set an expiration.
     *
     * @param (string) -> the key to store an object
     * @param (object) -> the object to store
     * @param (integer), optional -> time to live in seconds
     */
    store: function(key, obj, ttl) {
      this.cache[key] = obj;
      this.eventsController.trigger('store:' + key);

      if (typeof ttl !== 'undefined') { this.setExpiration(key, ttl); }
    },

    /*
     * Persists an object that won't be cleared by this.clearCache.
     *
     * @param (string) -> the key to store an object
     * @param (object) -> the object to store
     */
    persist: function(key, obj) {
      this.persisted[key] = obj;
      this.eventsController.trigger('persisted:' + key);
    },

    /*
     * Check to see if a key exists in the persisted cache
     *
     * @param (string) -> the key to look for
     *
     * @returns boolean
     */
    hasPersisted: function(key) {
      return typeof this.persisted[key] !== 'undefined';
    },

    /*
     * Get a persisted object or return false if it doesn't exist
     *
     * @param (string) -> the key to look for
     *
     * @returns the object or 'false' if the key doesn't exist
     */
    getPersistedObject: function(key) {
      if (!this.hasPersisted(key)) { return false; }
      return this.persisted[key];
    },

    /*
     * Calls Backbone.Model.fetch for the given key and calls a given callback
     *
     * @param (string) -> the key to fetch
     * @param (function) -> the callback
     */
    fetch: function(key, cb) {
      this.cache[key].fetch({
        success: function(collection, resp, opts) {
          cb.call(collection, resp, opts);
        }
      });
    },

    /*
     * Clears a cache key, emptying it but not deleting it.
     *
     * @param (key) -> the key of the object to clear
     */
    clearKey: function(key) {
      if (this.hasKey(key)) {
        if (typeof(this.cache[key]) === 'object') {
          for (var member in this.cache[key]) delete this.cache[key][member];
        } else {
          this.cache[key] = null;
        }
      }
    },

    /*
     * Deletes a key from the cache.
     *
     * @param (string) -> the key of the object to delete
     */
    deleteKey: function(key) {
      if (this.hasKey(key)) {
        delete this.cache[key];
        if (typeof this.expiration[key] !== 'undefined') { clearTimeout(this.expiration[key]); delete this.expiration[key]; }
      }
    },

    /*
     * Clears the cache and expirations
     */
    clearCache: function() {
      // clear the cache
      delete this.cache;
      this.cache = {};

      // clear expirations
      _.each(this.expiration, function(e) {
        clearTimeout(e.timeout);
      });
      delete this.expiration;
      this.expiration = {};

      this.trigger('cacheCleared', this.cache);
    },

    preloadImages: function(){
      // $.preloadImages("/assets/banner-browse-card.png","/assets/banner-browse-gift.jpg");
    },

  });

  // initialize the controller
  Qvocab.cache = new Qvocab.Controllers.CacheController();

});