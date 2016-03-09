// sentence and word
//   vn to speek
//   en to speek
//   listen to speek
/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.SpeakWordsView = Backbone.View.extend({

    events: {
      'click .js-next': 'nextSpeak',
      'click .js-reset': 'resetSpeak',
      'click .js-word': 'speakWord',
    },

    template: Qvocab.Templates['public/templates/practise/speak'],
    templateSpeak: Qvocab.Templates['public/templates/practise/wordSpeak'],

    initialize: function(options) {
      this.positionWord = 0;
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));

      this.sentence = (!_.isUndefined(options.params) && options.params.type == "sentence")

      this.fetchCollection();

    },

    onReady: function() {

      this.render();
      this.renderWord();
      var _this = this;
      if(annyang){
        annyang.start({ autoRestart: false, continuous: true });
      }

      this.bindEvents();
    },

    bindEvents: function() {
      this.listenTo(Qvocab.events, 'next:speak', _.bind(this.matchSpeech, this));
      return this;
    },

    unbindEvents: function() {
      this.stopListening();
      return this;
    },

    getContext: function() {
      var context = {};
      context.isSentence = this.sentence
      context.word = this.collection.at(this.positionWord).toJSON();
      return context;
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    renderWord: function(){
      this.$('.js-words').append(this.templateSpeak(this.getContext()));
    },

    fetchCollection: function(){

      var _this = this;
      var type = null;
      var req = null;

      if(this.sentence){
        this.collection = new Qvocab.Collections.Sentences();
      }else{
        this.collection = new Qvocab.Collections.Words();
      }

      var req = this.collection.fetch({ data: $.param({ type: type}) });

      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        _this.trigger('ready');
      });

    },

    matchSpeech: function(speeches){
      var model = this.collection.at(this.positionWord);
      var _this = this;

      var results = speeches.join('<br/>')

      this.$('.js-results').html(results);

      _.each(speeches, function(speech){
        if(model.get('name').toLowerCase() == speech.trim().toLowerCase()){
          _this.nextSpeak();
          return;
        }
      });

      console.log(speeches)
    },

    nextSpeak: function(){
      this.positionWord++
      this.$('.js-words').empty();
      this.renderWord();
    },

    resetSpeak: function(){
      if(annyang){
        annyang.abort();
        // annyang.pause();
        setTimeout(function(){
          annyang.resume();
        }, 500)
      }
    },

    speakWord: function(){
      var model = this.collection.at(this.positionWord);
      responsiveVoice.speak(model.get('name'));
    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
