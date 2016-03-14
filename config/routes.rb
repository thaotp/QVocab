Rails.application.routes.draw do
  devise_for :users, only: :sessions
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root to: 'home#public'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  get '/quest/new' => 'home#public'
  get '/quest/starting' => 'home#public'
  get '/words' => 'home#public'
  get '/words/create' => 'home#public'
  get '/practise/speak' => 'home#public'
  get '/manage'  => 'home#public'

  get '/manage/note_csv' => "manage#note_csv", defaults: { format: 'csv' }

  scope "/api/v1" do
    post '/ping', to: 'quest#ping', :defaults => { :format => 'json' }
    post '/start', to: 'quest#start', :defaults => { :format => 'json' }
    get '/quests', to: 'quest#quests', :defaults => { :format => 'json' }
    post '/anwser', to: 'quest#anwser', :defaults => { :format => 'json' }

    resources :manage, :defaults => { :format => 'json' } do

    end

    resources :words, :defaults => { :format => 'json' } do
      get 'generate', on: :collection
      get 'review', on: :collection
      put 'sync', on: :collection
      post 'init', on: :collection
    end

    resources :sentences, :defaults => { :format => 'json' } do

    end
  end
end
