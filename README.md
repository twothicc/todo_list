# README

Liu Chen En
A0217691Y

To see the app hosted on Heroku, visit:
https://chenen-todo-list.herokuapp.com/

Setup (For local development)
1.	Using Ubuntu terminal, move to directory where you would like to clone the git repository. Use command git clone https://github.com/twothicc/todo_list
2.	Have a working PostgreSQL server. Set up environment variables by running commands in Ubuntu terminal: 
export DATABASE_USERNAME=your postgres acc username
export DATABASE_PASSWORD=your postgres acc password
3.	Run command: rake start. Ensure that port 3000 and port 3001 are not being used

User Manual:
- Create a new account by pressing sign up. Create a new password for urself. Password must be minimum 4 characters long
- Welcome page will automatically create ur first default "Welcome" Todo task for you
- Filter textbox and button on the top right will provide fixed suggestions of categories to filter your todos
- Expand button will take you to a new page to view your Todo Task on a larger scale and edit your Todo task
- For Todo Tasks: Create New Todo button hovers over the Todo apps, which allows your to create new Todo tasks. Delete button deletes the Todo Task
- For Category: Textbox and create button allows you to create new Categories. Delete Button below Categories deletes the Categories.

Note: By default, the category for any Todo task, if not specified, will be "Default"
Note: Default category cannot be deleted and will be created when account is first created


