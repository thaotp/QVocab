class HomeController < ApplicationController
  before_action :authenticate_user!
  layout 'public'

  def public
    # p Pusher.channel_users('Qvocab')
  end
end
