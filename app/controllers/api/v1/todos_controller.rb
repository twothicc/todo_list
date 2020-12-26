class Api::V1::TodosController < ApplicationController
  before_action :set_default, only: [:index]
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /todos/:user
  def index
    # @todos = Todo.all.order("created_at DESC")
    @todos = @todo.order('created_at DESC')
    render json: @todos
  end

  # GET /todos/:user/1
  def show
    render json: @todo
  end

  # POST /todos/:user
  def create
    @todo = Todo.new(todo_params)

    if @todo.save
      render json: @todo, status: :created, location: api_v1_todos_path(@todo)
    else
      render json: @todo.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /todos/:user/1
  def update
    if @todo.update(todo_params)
      render json: @todo
    else
      render json: @todo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /todos/:user/1
  def destroy
    @todo.destroy
  end

  # Search /todos/:user/search/:category_id
  def search
    # @todo = Todo.where(category_id: params[:category_id])
    @todo = Todo.where(['user_id = ? AND category_id = ?', params[:user], params[:category_id]]).order('created_at DESC')

    render json: @todo
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    def set_default
      @todo = Todo.where(['user_id = ?', params[:user]])
    end

    # Only allow a trusted parameter "white list" through.
    def todo_params
      params.require(:todo).permit(:name, :body, :user, :category_id, :user_id)
    end
end
