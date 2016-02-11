/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.StartingQView = Backbone.View.extend({

    events: {
      
    },

    template: Qvocab.Templates['public/templates/quest/starting'],

    initialize: function() {
      this.currentQuestView = null;
      this.positionQuest = 0;
      this.collectionQuestViews = []
      this.rightQ = 0;
      this.finishedQ = false;
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      
      var _this  = this;
      this.collection = new Qvocab.Collections.Quests(Qvocab.cache.get('user:quests'))
      console.log(Qvocab.cache.get('user:quests'))
      if( !Qvocab.cache.get('user:quests') ) {
        var req = this.collection.fetch();
        Qvocab.cache.store('user:quests', this.collection);
        req.done(function() {
          _this.trigger('ready');
        });
      }else{
        _this.trigger('ready');
      }
    },

    onReady: function() {
      this.render();
      this.waitDisplay();
      this.bindEvents();
    },

    bindEvents: function() {
      this.subcribeAnwser();
      this.listenTo(Qvocab.events, 'end:quest', _.bind(this.nextQuest, this));
      return this;
    },

    unbindEvents: function() {
      this.stopListening();
      return this;
    },

    getContext: function() {
      var context = {};

      context.Qvocab = Qvocab;
      context.quests = this.collection.toJSON()
      return context;
    },

    render: function() {

      this.$el.html(this.template(this.getContext()));

      return this;
    },

    waitDisplay: function(){
      var _this = this;
      var count = 1;
      var timer = setInterval(function(e){
        switch(count) {
        case 1:
          _this.showWaiter(count)
          ++count
          break;
        case 2:
          _this.showWaiter(count)
          ++count
          break;
        case 3:
          _this.showWaiter(count)
          ++count
          break;
        case 4:
          _this.showWaiter(count)
          clearInterval(timer);
          break;
        default:
          break;
        }
      }, 1000);
    },

    showWaiter: function(count){
      if(count != 1){
        this.$('.js-waiter-'+(count - 1)).addClass('hidden').removeClass('zoomIn animated')
      }
      if(count == 4){
        this.$('.js-panel-heading').addClass('hidden')
        this.$('.js-progresses').removeClass('hidden')
        this.$('.js-numbers').removeClass('hidden')
        this.startQuest();
      }else{
        this.$('.js-waiter-'+ count).removeClass('hidden').addClass('zoomIn animated')
      }
    },

    startQuest: function(){
      var model = this.collection.first();
      this.positionQuest = 0;
      this.currentQuestView = this.initQuestView(model);
    },

    nextQuest: function(isAnwser){
      this.anwserQ(isAnwser);
      this.currentQuestView.close();
      this.positionQuest++
      var model = this.getModelNextQuest(this.positionQuest);
      this.currentQuestView = this.initQuestView(model);
    },

    initQuestView: function(model){
      if(_.isUndefined(model) || this.finishedQ){
        this.finishQuest();
        return this.currentQuestView;
      }
      var questView = new Qvocab.Views.QuestView({
        model: model
      });
      this.$('.js-quest-wrap').append(questView.render().el);
      questView.timerStart();
      this.collectionQuestViews.push(questView);
      this.qNumber();
      return questView;
    },

    getModelNextQuest: function(position){
      return this.collection.at(position);
    },

    finishQuest: function(){
      console.log('finishQuest')
      this.$('.js-point').addClass('hidden')
      // var params = {right_answer: this.rightQ, current_anwser: this.positionQuest + 1, user_id: Qvocab.currentUser.id, finished: true}
      // this.aJaxTo(params)
    },

    anwserQ:function(isAnwser){
      isAnwser ? this.rightAnwser() : this.wrongAnwser();
      var params = {right_answer: this.rightQ, current_anwser: this.positionQuest + 1, user_id: Qvocab.currentUser.id}
      this.aJaxTo(params);
    },

    aJaxTo: function(params){
      var req = $.ajax({
        data: JSON.stringify(params),
        contentType: 'application/json',
        type: 'post',
        url: Qvocab.Globals.apiPath('anwser')
      });
      return req;
    },

    rightAnwser: function(){
      this.qNumber(true)
      this.displayPoint(true)
      ++this.rightQ
      this.qProgressOwner()
      console.log('rightAnwser')
    },

    wrongAnwser: function(){
      this.qNumber(false)
      this.displayPoint(false)
      this.qProgressOwner()
      console.log('wrongAnwser')
    },

    qNumber: function(setColor){
      this.$('.js-number').removeClass('q-current');
      var $field = this.$('.js-number[data-number="' + this.positionQuest + '"]');
      if(setColor === true){
        $field.addClass('q-true')
      }else if( setColor === false){
        $field.addClass('q-false')
      }else{
        $field.addClass('q-current')
      }
    },

    displayPoint: function(isAnwser){
      this.$('.q-point').addClass('fadeOut animated')
      setTimeout(function(){
        this.$('.q-point').removeClass('fadeOut animated').removeClass('true false')
      }, 800)
      
      if(isAnwser){
        this.$('.q-point').html("+5")
        this.$('.q-point').addClass('true')
      }else{
        this.$('.q-point').html("-5")
        this.$('.q-point').addClass('false')
      }

    },

    qProgress: function(qClass, currentAnwser){
      var total = this.$(qClass).parent().width();
      var current = this.$(qClass).width();

      var alpha = 100 / this.collection.length * total / 100
      if(currentAnwser == this.collection.length){
        this.$(qClass).width('100%')
      }else{
        this.$(qClass).width(current + alpha)
      }
    },

    qProgressOwner: function(){
      this.qProgress('.js-progress-owner', this.positionQuest + 1);
      this.$('.js-progress-owner').html(this.rightQ + '/' + (this.positionQuest + 1))
    },

    qProgressUser: function(user){
      this.qProgress('.js-progress-user', user.current_anwser);
      this.$('.js-progress-user').html(user.right_answer + '/' + user.current_anwser)
    },

    subcribeAnwser: function(){
      var _this = this;
      Qvocab.channel.bind('anwser', function(data) {
        var messages = data.messages
        if(messages.finished){
          if(messages.user_id != Qvocab.currentUser.id){
            // console.log('finished',messages)
            // _this.currentQuestView.close();
          }
          if(_this.currentQuestView){
            _this.currentQuestView.close();
          }
          _this.finishedQ = true
        }
        if(messages.user_id != Qvocab.currentUser.id){
          _this.qProgressUser(messages)
        }
      });
    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
