/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.WordsView = Backbone.View.extend({

    events: {
      'click .js-answer': 'answerWord',
    },

    template: Qvocab.Templates['public/templates/word/index'],

    initialize: function() {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));

      this.collection = new Qvocab.Collections.Words()
      var req = this.collection.fetch();
      var _this = this;
      req.fail(function() {
        console.log("fail")
      });

      req.done(function() {
        _this.trigger('ready');
      });
    },

    onReady: function() {
      this.render();
      this.startWord();
      this.bindEvents();
    },

    bindEvents: function() {
      this.listenTo(Qvocab.events, 'next:word', _.bind(this.nextWord, this));
      return this;
    },

    unbindEvents: function() {
      this.stopListening();
      return this;
    },

    getContext: function() {
      var context = {};
      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));
      return this;
    },

    startWord: function(){
      var model = this.collection.first();
      this.positionWord = 0;
      this.currentWordView = this.initWordView(model);
    },

    nextWord: function(){
      this.positionWord++
      if(this.currentWordView != null){
        this.currentWordView.close();
        this.currentWordView = null;
      }
      var model = this.getModelNextWord(this.positionWord);
      this.currentWordView = this.initWordView(model);
    },

    initWordView: function(model){
      if(_.isUndefined(model)){
        model = this.collection.first();
        this.positionWord = 0;
      }

      var wordView = new Qvocab.Views.EditWordView({
        model: model
      });
      this.$('.js-word-wrap').append(wordView.render().el);
      wordView.focusWord();
      wordView.speakWord();
      return wordView;
    },

    getModelNextWord: function(position){
      return this.collection.at(position);
    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
