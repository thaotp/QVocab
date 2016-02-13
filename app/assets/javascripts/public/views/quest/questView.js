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
      this.rightAnwser = ''
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
      context.quest = this.model.toJSON();
      this.rightAnwser = context.quest.right_anwser
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
      var anwser = $(e.currentTarget).data('answer')
      this.timer.conf.onEnd = null;
      var $fieldRight = this.$('.js-answer[data-answer="'+ this.rightAnwser +'"]')
      $fieldRight.addClass('true')

      if(anwser == this.rightAnwser){
        this.$('.js-answer').removeClass('pulse animated')
        $(e.currentTarget).addClass('pulse animated')
        setTimeout(function(){
          Qvocab.events.trigger('end:quest', true);
        }, 1000);
      }else{
        this.$('.js-answer').removeClass('shake animated')
        $(e.currentTarget).addClass('shake animated wrong')
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
      this.timer.conf.onEnd = null;
      this.$el.remove();
      this.unbindEvents();
    }

  });

});
