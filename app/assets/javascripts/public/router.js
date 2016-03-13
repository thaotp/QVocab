/*
 *
 */
/*
 * Backbone Router for Qvocab.
 * This file should be loaded last in application.js so Backbone.history.start()
 * can properly setup and trigger the corresponding view.
 */

$(function() {

  'use strict';

  Qvocab.Router = Backbone.Router.extend({

    routes: {
      // home
      '': 'homeRoute',
      '/': 'homeRoute',
      'quest/new/': 'newQRoute',
      'quest/new': 'newQRoute',
      'quest/starting': 'startingQRoute',
      'quest/starting/': 'startingQRoute',
      'words': 'wordsView',
      'words/': 'wordsView',
      'words/create': 'createWordsView',
      'words/create/?:review': 'createWordsView',
      'practise/speak':'speakWordView',
      'practise/speak/':'speakWordView',
      'manage':'manageView',
      'manage/':'manageView'
    },

    initialize: function() {
      var _this = this;

      this.listenTo(this, 'route', function (route, params) {
        routeStore.push(Backbone.history.fragment);
      });

      this.listenTo(Qvocab.state, 'change:loading', function() {
        if (Qvocab.state.get('loading')) {

        } else {

        }
      });
      this.htmlClasses = $('html').attr('class');
    },

    // Called before the route function
    before: function(route) {
      // clean up old view)
      if (typeof this.currentView !== 'undefined') {
        this.currentView.close();
        delete this.currentView;
      }
      Qvocab.state.set('loading', true)
      $('html').attr('class', this.htmlClasses);
    },

    // Called after the route function
    after: function(route) {

    },

    authenticate: function() {
      // Authenticate is called after 'before' and if it returns false, the callstack ends.
      var startingRoute = Backbone.history.fragment.match(/quest\/starting/i) != null
      if(Qvocab.activeQuest.starting && !startingRoute){
        this.navigate('quest/starting', true);
        return false;
      }

      if(!Qvocab.activeQuest.starting && startingRoute){
        this.navigate('/', true);
        return false;
      }
      return true;
    },

    authorize: function() {
      var authorized = true,
          _this = this;

      return authorized;
    },

    errorRoute: function(errorPage) {
      errorPage = errorPage ? errorPage : '404';
      this.currentView = new Qvocab.Views.ErrorView({
        errorPage: errorPage
      });
    },



    homeRoute: function() {
      this.currentView = new Qvocab.Views.HomeView();
    },

    newQRoute: function(){
      this.currentView = new Qvocab.Views.NewQView();
    },

    startingQRoute: function(){
      this.currentView = new Qvocab.Views.StartingQView();
    },

    wordsView: function(params){
      this.currentView = new Qvocab.Views.WordsView({
        params: params
      });
    },

    createWordsView: function(){
      this.currentView = new Qvocab.Views.CreateWordView();
    },

    reviewWordsView: function(){
      this.currentView = new Qvocab.Views.ReviewWordsView();
    },

    speakWordView: function(params){
      this.currentView = new Qvocab.Views.SpeakWordsView({
        params: params
      });
    },

    manageView: function(){
      this.currentView = new Qvocab.Views.ManageView();
    },

    previousUrl: function() {
      return routeStore[routeStore.length-2];
    },

    previousUrlFromPosition: function(number) {
      return routeStore[routeStore.length-1-number];
    }

  });

});
