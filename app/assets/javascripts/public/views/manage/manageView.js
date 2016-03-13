/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.ManageView = Backbone.View.extend({

    events: {

    },

    template: Qvocab.Templates['public/templates/manage/manage'],

    initialize: function() {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      this.listNote = []
      this.getCsv();
    },

    onReady: function() {
      this.render();
      this.bindEvents();
    },

    bindEvents: function() {
      return this;
    },

    unbindEvents: function() {
      this.stopListening();
      return this;
    },

    getContext: function() {
      var context = {};
      context.listNote = this.listNote
      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));
      return this;
    },

    getCsv: function(){

      var _this = this;

      var req = $.ajax({
        contentType: 'application/json',
        type: 'get',
        url: Qvocab.Globals.apiPath('manage')
      });


      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        _this.listNote = e.list_note;
        _this.trigger('ready');
      });

    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
