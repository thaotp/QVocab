$(function() {

  'use strict';

  Qvocab.Collections.Sentences = Backbone.Collection.extend({

    model: Qvocab.Models.Sentence,

    url: Qvocab.Globals.apiPath('sentences')

  });

});