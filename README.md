# Canban

### Description

This website is a simple todo app with a kanban view which by todos can be advanced by stage. I explored a neat firebase alternative, [Supabase](https://supabase.com/), which offers me a PostgreSQL database and authentication handling.

#### URL

- [https://canban.vercel.app/](https://canban.vercel.app/)

#### Deployment

The site is hosted on [Vercel](https://vercel.com/), every commit or merge to main is setup to automatically re-deploy the main branch into production.

### Design

#### Login

If the user is unauthenticated, the main url address will prompt the user to login with 3 one of the 3 basic providers: Google, Facebook, or Github. An unauthenticated user will not be able to see any other content on the website besides a option below the login which allows the user to [demo](https://canban.vercel.app/demo) the application.

#### Demo

The [demo page](https://canban.vercel.app/demo) will take the user to a basic board with an initial todo that helps guide the user on basic use of the board. I made a demo option for those that wanted to see this project without authenticating. There is no official privacy policy, and fully anticipate myself as the sole user of this application. Regardless, I will not be collecting or monitoring anyones private data, as with much of the internet - please use at own discretion.

#### Dashboard

Once a user authenticates with the system, the main url address will now show a dashboard listing all the boards the user has created. A first time user will find that a board will automatically be created for them which aims to guide the user on basic use of the application. For the most part it is pretty basic and intuitive, the user can delete the board easily as well as create new boards. The new board form prompts the user for a name and stages. Stage information can be customized such as the name and color of the stage, by default the form populates with the basic order of Todo, In Progress, and Done.

#### Kanban Board

The url view a board page will look something like canban.vercel.app/board/:boardId. The last parameter indicating which board to use on page load. Board are also private, if a user tries to navigate to a board they do not own they will be presented with a mostly blank screen. If the user is the owner, a column will populate based on the stage information of the board. Creating a new task can be done using the '+' button at the top of each column. The task form captures just basic information: title, description, and stage. After creation, a card will populate in the appropriate column. The user grabs the title to drag it into a new stage and clicks the description to open a side drawer which shows the task's basic info. The user can use this side drawer to edit, delete, and archive the task as well as leave comments. Tasks that are archived will move to the section below the kanban board aptly labeled 'Archive'. Archiving allows to keep the kanban board from getting wildly cluttered while still keeping historical data. Tasks can always be un-archived as needed too.

#### Navigation

Authenticated users will see a basic navigation which features an avatar which populates with the first letter of the user's username. The profile button near this avatar allows the user to change their username or alternatively provide a url to a photo hosted somewhere else. The navigation also has a self-explantory logout button, and dynamically a dashboard button when viewing a board.
