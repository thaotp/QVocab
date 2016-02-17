$(function() {

  'use strict';

  Qvocab.Collections.Words = Backbone.Collection.extend({

    model: Qvocab.Models.Word,

    url: Qvocab.Globals.apiPath('words')

  });

});