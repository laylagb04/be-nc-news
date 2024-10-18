# Northcoders News API

An API similar to Reddit where clients can get articles, comments, users, and topics.  
This API is hosted on Render, and the database on Supabase.

Visit https://be-nc-news-kxol.onrender.com/api/articles/ and take a look at endpoints.json to view a list of possible endpoints.

To install dependencies needed;

npm install

To set up database and seed;

npm run setup-dbs
npm run seed

To run the application;

npm start

This project requires 2 .env files which contain variables which will be assigned to the database you want to connect to.

For example;

in .env.test add PGDATABASE=nc_news_test
in .env.development add PGDATABASE=nc_news

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
