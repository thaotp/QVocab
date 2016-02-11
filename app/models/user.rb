class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # devise :database_authenticatable, :registerable,
         # :recoverable, :rememberable, :trackable, :validatable

  devise :database_authenticatable, :rememberable, :trackable, :validatable

  def admin?
    has_role? :admin
  end
end
