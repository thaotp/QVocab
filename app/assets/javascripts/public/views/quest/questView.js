/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.QuestView = Backbone.View.extend({

    events: {
      'click .js-answer': 'answerQuest',
    },

    template: Qvocab.Templates['public/templates/quest/quest'],

    initialize: function() {
      this.anwsered = false;
      this.rightAnwser = Math.floor(Math.random() * 4) + 1
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

      context.Qvocab = Qvocab;

      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));

      return this;
    },

    answerQuest: function(e){
      e.preventDefault();
      if(this.anwsered){
        return;
      }
      this.anwsered = true;
      var anwser = $(e.currentTarget).data('position')
      this.timer.conf.onEnd = null;
      
      if(anwser == this.rightAnwser){
        this.$('.js-answer').removeClass('pulse animated')
        $(e.currentTarget).addClass('pulse animated')
        setTimeout(function(){
          Qvocab.events.trigger('end:quest', true);
        }, 1000);
      }else{
        this.$('.js-answer').removeClass('shake animated')
        $(e.currentTarget).addClass('shake animated')
        setTimeout(function(){
          Qvocab.events.trigger('end:quest', false);
        }, 1200);
      }
    },

    timerStart: function(e){
      var _this = this;
      this.timer = new Countdown({
        selector: '.js-timer',
        // msgBefore: "Will start at Christmas!",
        msgAfter: "",
        msgPattern: "{seconds}",
        dateEnd: new Date(new Date().getTime() + 5000),
        onEnd: function() {
          _this.triggerEnd();
        }
      });
    },

    triggerEnd: function(){
      Qvocab.events.trigger('end:quest', false);
    },

    onClose: function() {
      this.$el.remove();
      this.unbindEvents();
    }

  });

});
