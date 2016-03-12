/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.WordView = Backbone.View.extend({

    events: {
      'click .js-submit': 'insertWord',
      'click .js-next': 'nextWord',
      'click .js-show-photo':'setPhotoUrl',
    },

    tagName: 'article',

    templateUpdate: Qvocab.Templates['public/templates/word/edit'],
    templateReview: Qvocab.Templates['public/templates/word/review'],
    template: Qvocab.Templates['public/templates/word/show'],

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

    renderReview: function(){
      this.$el.html(this.templateReview(this.getContext()));
      return this;
    },

    renderUpdate: function(){
      this.$el.html(this.templateUpdate(this.getContext()));
      return this;
    },

    focusWord: function(){
      this.$('.js-means').focus();
    },

    insertWord: function(e){
      e.preventDefault();
      var value = this.$('.js-means').val();
      var photoUrl = this.$('.js-photo').val();
      if(!_.isUndefined(value)){
        this.model.set('means', value)
        this.model.set('photo_url', photoUrl)
        this.model.save();
      }
      Qvocab.events.trigger('next:word');
    },

    nextWord: function(e){
      e.preventDefault();
      Qvocab.events.trigger('next:word');
    },

    speakWord: function(e){
      responsiveVoice.speak(this.model.get('name'));
    },

    loadPhotos: function(show){
      if(show === undefined && this.model.get('photo_url')){
        // return;
      }
      var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a828a6571bb4f0ff8890f7a386d61975&per_page=50&content_type=7&format=json&jsoncallback=?&tags='+this.model.get('name');
      var sources = []
      var _this = this;
      $.getJSON(url, function(data){
        $.each(data.photos.photo, function(i,item){
          var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
          sources.push(src)
        });
        _this.jsonFlickrApi(sources)
      });
    },

    jsonFlickrApi: function(sources) {
      var images = ""
      _.each(sources, function(source){
        images += "<img class='js-show-photo -word-show-photo'src='" + source + "' border='0' style='padding: 3px;' />";
      })
      this.$('.js-photos').append(images)
    },

    setPhotoUrl: function(e){
      var src = $(e.currentTarget).attr('src')
      this.$('.js-current-photo').attr("src", src)
      this.$('.js-photo').val(src)
    },

    onClose: function() {
      this.remove();
      this.unbindEvents();
    }

  });

});
