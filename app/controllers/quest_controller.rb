class QuestController < ApplicationController
  def ping
    send_message 'ping', {id: params[:quest][:id], is_online: params[:is_online] || false, ping: params[:ping] || false}
    render json: {}
  end

  def start
    send_message 'start', {quests: Word.take(5)}
    render json: {}
  end

  def quests
    render json: Word.take(5).to_json
  end

  def anwser
    if(params[:quest][:current_anwser] == 5)
      params[:quest][:finished] = true
    end
    send_message 'anwser', params[:quest]
    render json: {}
  end

  private
  def send_message event, messages = {}
    begin
      Pusher.trigger('Qvocab', event, {
        messages: messages
      })
    rescue Pusher::HTTPError => e
      p e
    end
  end
end