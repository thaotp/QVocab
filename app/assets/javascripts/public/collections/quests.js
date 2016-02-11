$(function() {

  'use strict';

  Qvocab.Collections.Quests = Backbone.Collection.extend({

    model: Qvocab.Models.Quest,

    url: Qvocab.Globals.apiPath('quests')

  });

});