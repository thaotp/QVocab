class QuestController < ApplicationController
  def ping
    send_message 'ping', {id: params[:quest][:id], is_online: params[:is_online] || false, ping: params[:ping] || false, course: params[:course], level: params[:level]}
    render json: {}
  end

  def start
    #Create Quest At Here
    quest = Quest.create(user_id: params[:user_id], owner_id: params[:id], starting: true, course: params[:course], level: params[:level], word_number: WORD_NUMBER)
    send_message 'start', quest
    render json: {}
  end

  def quests
    active_quest = Quest.active(current_user.id).last

    quests = if active_quest.present?
      active_quest.take_quests
    end || {}

    if quests.blank?
      active_quest.update(starting: false) if active_quest.present?
      render json: {}, status: 404
    else
      render json: quests.to_json, status: 200
    end

  end

  def anwser
    active_quest = Quest.select(:id,:starting).find(params[:quest_id])
    if(params[:current_anwser] == WORD_NUMBER && active_quest.starting)
      active_quest.update(starting: false)
    end

    finished = !active_quest.starting

    send_message 'anwser', {"right_answer"=>params[:right_answer], "current_anwser"=>params[:current_anwser], "user_id"=>params[:user_id], finished: finished}
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