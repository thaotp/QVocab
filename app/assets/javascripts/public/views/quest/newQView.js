/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.NewQView = Backbone.View.extend({

    events: {
     'click .js-create': 'pingQ',
    },

    template: Qvocab.Templates['public/templates/quest/new'],

    initialize: function() {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      this.trigger('ready');
    },

    onReady: function() {
      this.render();
      this.initSelect();
      this.subscribePing();
      this.subscribeStart();
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

    initSelect: function(){
      var type = ''
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
       type = 'mobile'
      }
      this.$('.selectpicker-course').selectpicker();
      this.$('.selectpicker-level').selectpicker();
    },

    subscribePing: function(){
      var _this = this;

      Qvocab.channel.bind('ping', function(data) {
        var messages = data.messages
        if(messages.id != Qvocab.currentUser.id && !Qvocab.starting){
          if(messages.is_online){
            _this.startQ(messages.id, messages.course, messages.level);
          }
        }
      });
    },

    subscribeStart: function(){
      var _this = this;
      Qvocab.channel.bind('start', function(data) {
        var messages = data.messages
        // Qvocab.cache.store('user:quests', messages.quests);
        Qvocab.activeQuest = messages
        Qvocab.router.navigate('quest/starting', { trigger: true, replace: false });
      });
    },

    ping: function(params){
      var req = $.ajax({
        data: JSON.stringify(params),
        contentType: 'application/json',
        type: 'post',
        url: Qvocab.Globals.apiPath('ping')
      });
      return req;
    },

    pingQ: function(){
      var level = $('.js-level'). selectpicker('val')
      var course = $('.js-course'). selectpicker('val')
      if(level == "" || course == "") return;

      var req = this.ping({id: Qvocab.currentUser.id, ping: true, level: level, course: course})
      req.always(function() { });
      req.done(_.bind(this.onPingSuccess, this));
      req.fail(_.bind(this.onPingError, this));
    },

    onPingError: function(){

    },

    onPingSuccess: function(){

    },

    startQ: function(user_id, course, level){
      var params = {user_id: user_id, id: Qvocab.currentUser.id, course: course, level: level}
      var req = $.ajax({
        data: JSON.stringify(params),
        contentType: 'application/json',
        type: 'post',
        url: Qvocab.Globals.apiPath('start')
      });
    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
