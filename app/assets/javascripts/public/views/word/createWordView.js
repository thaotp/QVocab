/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.CreateWordView = Backbone.View.extend({

    events: {
      'click .js-generate': 'generateWords',
      'click .js-create': 'createWords',
    },

    template: Qvocab.Templates['public/templates/word/create'],

    initialize: function() {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      this.trigger('ready');
    },

    onReady: function() {
      this.stopG = false;
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
      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));
      return this;
    },

    generateWords: function(e){
      e.preventDefault();
      console.log(this.stopG)
      if(this.$('.js-string').val() == null || this.stopG ) return;

      var _this = this;
      var params = {string: this.$('.js-string').val()}
      var req = $.ajax({
        data: params,
        contentType: 'application/json',
        type: 'get',
        url: Qvocab.Globals.apiPath('words/generate')
      });

      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        _this.stopG = true;
        _this.listName(e.names)
      });
    },

    listName: function(names){
      var $element = this.$('.js-word-group')
      _.each(names, function(name){
        var n = $element.clone().appendTo( ".js-words" );
        n.removeClass('hidden');
        n.find('input').val(name);
      });
    },

    createWords: function(e){
      e.preventDefault();
      var _this = this;
      var values = []
      $('.js-word-group').find('input:visible').each(function(index, el) {
        var val = $(el).val();
        if(val != null){
          values.push(val)
        }
      });

      if(values == []) return;

      var _this = this;
      var params = {words: values, note: this.$('.js-note').val()}

      var req = $.ajax({
        data: JSON.stringify(params),
        contentType: 'application/json',
        type: 'post',
        url: Qvocab.Globals.apiPath('words')
      });

      req.fail(function() {
        console.log("fail")
      });

      req.done(function(e) {
        $('.js-string').val('');
        _this.$('.js-word-group:visible').remove();
        _this.stopG = false
      });
    },


    onClose: function() {
      this.unbindEvents();
    }

  });

});
