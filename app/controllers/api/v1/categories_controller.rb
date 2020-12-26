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

    if @category.save
      render json: @category, status: :created, location: api_v1_categories_path(@category)
    else
      render json: @category.errors, status: :unprocessable_entity
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
    @category.destroy
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
