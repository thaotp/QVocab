/*
 * Main view for the Qvocab home page
 * URI: /
 */
$(function() {

  'use strict';

  Qvocab.Views.HomeView = Backbone.View.extend({

    events: {
      'click .js-create': 'createQ',
    },

    template: Qvocab.Templates['public/templates/home/home'],

    initialize: function() {
      this.setElement(Qvocab.Globals.contentElement);
      this.listenToOnce(this, 'ready', _.bind(this.onReady, this));
      this.trigger('ready');
    },

    onReady: function() {
      this.render();
      if(!Qvocab.currentUser.isAdmin){
        this.subcribePing();
        this.subscribeStart();
      }
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
      context.isAdmin = Qvocab.currentUser.isAdmin;

      return context;
    },

    render: function() {
      this.$el.html(this.template(this.getContext()));
      return this;
    },

    subcribePing: function(){
      var _this = this;
      Qvocab.channel.bind('ping', function(data) {
        var messages = data.messages
        if(messages.id != Qvocab.currentUser.id && !Qvocab.starting){
          if(messages.ping){
            _this.confirmQ();
          }
        } 
      });
    },

    subscribeStart: function(){
      var _this = this;
      Qvocab.channel.bind('start', function(data) {
        var messages = data.messages
        Qvocab.cache.store('user:quests', messages.quests);
        Qvocab.router.navigate('quest/starting', { trigger: true, replace: false });
      });
    },

    confirmQ: function(){
      var _this = this;
      console.log('confirmQ')
      swal({
        title: "",
        text: "Accept the challenge ?",
        type: "",
        showCancelButton: true,
        confirmButtonClass: "btn-outline btn-sm btn-primary",
        confirmButtonText: "Yes",
        cancelButtonClass: "btn-outline btn-sm btn-default",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(isConfirm) {
        if (isConfirm) {
          _this.ping({id: Qvocab.currentUser.id, is_online: true})
        } else {
          console.log('!isConfirm')
        }
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

    createQ: function(e){
      e.preventDefault();
      if(!Qvocab.currentUser.isAdmin) return;
      Qvocab.router.navigate('quest/new', { trigger: true, replace: false });
    },

    onClose: function() {
      this.unbindEvents();
    }

  });

});
