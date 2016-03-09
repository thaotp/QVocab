/* */

$(function() {

  'use strict';

  Qvocab.Models.Sentence = Backbone.Model.extend({

    toJSON: function() {
      var attrs = _.clone(this.attributes);

      return attrs;
    },

    urlRoot: Qvocab.Globals.apiPath('sentences')

  });

});