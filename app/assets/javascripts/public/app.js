/*
 * Bootstrapping the main Fountain Greetings application.
 */
$(function() {

  var Qvocabolary = function() {
    this.initialize.apply(this, arguments);
  };

  Qvocabolary.prototype = {

    initialize: function() {
      var _this = this;

      Qvocab.events.listenToOnce(Qvocab.events, 'appLoaded', function() {

        var pusher = new Pusher(Qvocab.pusherKey, {
          encrypted: true
        });
        Qvocab.channel = pusher.subscribe('Qvocab');
        // create a model for managing some global states
        Qvocab.state = new (Backbone.Model.extend({}))();

        // Initialize the router and start the Backbone app
        Qvocab.router = new Qvocab.Router();

        // run the initialize method to bootstrap the app, then start backbone history
        _this.bootstrap(function(done) {
          // start backbone pushstate
          Backbone.history.start({ pushState: true });
          Qvocab.events.trigger('bootstrap:done');
        });
      });
    },

    bootstrap: function(done) {
      done();
      return true
    }
  };

  new Qvocabolary();


});