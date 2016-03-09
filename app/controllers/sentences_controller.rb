class SentencesController < ApplicationController
  def index
    sentences = Sentence.in_day.order(id: :desc)
    sentences = Sentence.all if sentences.blank?
    render json: sentences
  end
end