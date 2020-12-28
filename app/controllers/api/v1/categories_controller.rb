class Api::V1::CategoriesController < ApplicationController
  before_action :set_default, only: [:index]
  before_action :set_category, only: [:show, :update, :destroy]

  # GET /categories/:user
  def index
    @categories = @category

    render json: @categories
  end

  # GET /categories/:user/1
  def show
    render json: @category
  end

  # POST /categories/:user
  def create
    @category = Category.new(category_params)
    
    if Category.where(user_id: @category.user_id, name: @category.name).count == 0
      if @category.save
        render json: @category, status: :created, location: api_v1_categories_path(@category)
      else
        render json: @category.errors, status: :unprocessable_entity
      end
    else
      #I have to put this in an array to match the way I handled error messages for other errors
      render json: {name: ['already exists']}, status: :unprocessable_entity
    end

  end

  # PATCH/PUT /categories/:user/1
  def update
    if @category.update(category_params)
      render json: @category
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /categories/:user/1
  def destroy
    #find user_id of category being deleted so we can make sure a user always has a 'Default' category
    curr_user_id = @category.user_id
    

    #Need to also find category_id of a category of the user that is called 'Default' 
    default_category = Category.find_by name: 'Default', user_id: curr_user_id
    default_category_id = default_category.id

    #find all todos with category_id of category being deleted
    todos_associated_to_category = Todo.where(['category_id = ?', @category.id])

    if @category.name == 'Default'
      temp = Category.new(name: 'Default', user_id: curr_user_id)
      if temp.save
        render json: temp, status: :created, location: api_v1_categories_path(temp), msg: 'Must Have Default'
      else
        render json: temp.errors, status: :unprocessable_entity, msg: 'Default creation failed'
      end
      #Since Default could be destroyed here, we simply take the id of temp category which is the new 'Default'
      todos_associated_to_category.update_all category_id: temp.id
      @category.destroy
    else
      
      #best part is update_all does not edit the timestamp fields
      todos_associated_to_category.update_all category_id: default_category_id
      @category.destroy
    end
    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
    end

    def set_default
      @category = Category.where(['user_id = ?', params[:user]])
    end

    # Only allow a trusted parameter "white list" through.
    def category_params
      params.require(:category).permit(:name, :user, :user_id)
    end
end
