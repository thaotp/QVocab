/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.WordsView = Backbone.View.extend({

    events: {
      'click .js-answer': 'answerWord'
    },

    template: Qvocab.Templates['public/templates/words/index'],

    initialize: function(options) {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));


      this.isReview = (!_.isUndefined(options.params) && options.params.type == "review")
      this.isUpdate = (!_.isUndefined(options.params) && options.params.type == "update")
      this.modelName = !_.isUndefined(options.params) ? options.params.model : ""

      this.fetchCollection();

    },

    onReady: function() {

      this.render();
      this.listView = []
      if(this.isReview || this.isUpdate ){
        this.startWord();
      }else{
        this.listWord();
      }

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

    ajaxCollection: function(){

      var _this = this;
      this.collection = new Qvocab.Collections.Words()

      var req = $.ajax({
        contentType: 'application/json',
        type: 'get',
        url: Qvocab.Globals.apiPath('words/review')
      });


      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        _this.collection = new Qvocab.Collections.Words(e)
        _this.trigger('ready');
      });

    },

    fetchCollection: function(){

      var _this = this;
      var type = null;

      if(this.isReview){
        type = "review"
      }else if(this.isUpdate){
        type = "update"
      }

      this.collection = new Qvocab.Collections.Words();
      var req = this.collection.fetch({ data: $.param({ type: type, model: _this.modelName })});

      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        _this.trigger('ready');
      });

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
        if(this.isReview){
          location.reload();
          return;
        }
        model = this.collection.first();
        this.positionWord = 0;
      }

      var wordView = new Qvocab.Views.WordView({
        model: model
      });
      if(this.isReview){
        this.$('.js-word-wrap').append(wordView.renderReview().el);
      }else if(this.isUpdate){
        this.$('.js-word-wrap').append(wordView.renderUpdate().el);
      }


      wordView.focusWord();
      wordView.speakWord();
      wordView.loadPhotos();
      return wordView;
    },

    listWord: function(){
      var _this = this;
      _.each(this.collection.models, function(model){

        var wordView = new Qvocab.Views.WordView({
          model: model
        });
        _this.$('.js-word-wrap').append(wordView.render().el);
        wordView.$el.css({
         'display': 'inline-block'
        });
        _this.listView.push(wordView);
      });
    },

    getModelNextWord: function(position){
      return this.collection.at(position);
    },

    onClose: function() {
      _.each(this.listView, function(view){
        view.close();
      });
      this.listView = [];

      this.unbindEvents();
    }

  });

});
