/*
 * Extends Backbone.js with some additional functionality for ScoreStreak.
 */
$(function() {
  _.extend(Backbone.Router.prototype, Backbone.Events, {
    before: function(){},
    after : function(){},
    route : function(route, name, callback) {

      if (!callback) callback = this[name];

      Backbone.history || (Backbone.history = new Backbone.History);

      if (!_.isRegExp(route)) route = this._routeToRegExp(route);

      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);

        if( _(this.before).isFunction() ) { this.before.apply(this, args); }

        if (_(this.authenticate).isFunction()) {
          if (this.authenticate.apply(this, args) && this.authorize.apply(this, args)) {
            callback.apply(this, args);
            if( _(this.after).isFunction() ){
              this.after.apply(this, args);
            }
            this.trigger('route', name, args);
            this.trigger.apply(this, ['route:' + name].concat(args));
          }
        }
      }, this));
    }
  });


  Backbone.View.prototype.close = function(opts) {
    opts = opts ? opts : {};
    opts = _.extend({
      remove: true
    }, opts);

    if (this.onClose) {
      this.trigger('onClose');
      this.onClose();
    }

    this.undelegateEvents();
    this.off();
  };

});