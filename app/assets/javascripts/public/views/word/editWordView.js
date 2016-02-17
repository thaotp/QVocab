/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.EditWordView = Backbone.View.extend({

    events: {
      'click .js-submit': 'insertWord',
    },

    template: Qvocab.Templates['public/templates/word/edit'],

    initialize: function() {

      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      this.trigger('ready');
    },

    onReady: function() {
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
      context.word = this.model.toJSON();
      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));
      return this;
    },

    focusWord: function(){
      this.$('.js-means').focus();
    },

    insertWord: function(e){
      e.preventDefault();
      var value = this.$('.js-means').val();
      if(!_.isUndefined(value)){
        this.model.set('means', value)
        this.model.save();
      }

      Qvocab.events.trigger('next:word');
    },

    speakWord: function(e){
      responsiveVoice.speak(this.model.get('name'));
    },

    onClose: function() {
      this.remove();
      this.unbindEvents();
    }

  });

});
