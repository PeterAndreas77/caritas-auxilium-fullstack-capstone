# Caritas Auxilium fullstack capstone

Link to live Web application:

# Goal & Use Case

This is a simple humanitarian crisis donation logger app. Often times when people got news from social media about humanitarian crisis, they just shared the news and they forget about it. This app takes that extra step by bridging the crisis to people who want to help by donating their money.

# Screenshots

No screenshots yet.

# User Stories & Initial UX

**Landing Page**

1. Initial landing page explains what this app is for. Most of the instructions on how to use the app and other features will be on this page.
   Wireframe: https://caritasauxilium-landing--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_landing.jpg)
   
2. Register Page ask users to register if they want to use the app. If they have an account already, they can login immediately.
   Wireframe: https://caritasauxilium-register--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_register.jpg)
   
3. Main Page. Once users successfully register or login, they will be directed to the main page. Main page is populated with recent humanitarian crises from all over the world. Users can click on a crisis card to read more about the crisis and donate if they feel compelled.
   Wireframe: https://caritasauxilium-main--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_main.jpg)
   
4. New Act of Charity page. Once user chose a crisis to donate to, they will be asked to fill this form. Once they have donated somewhere else and submitted this form, the donation act will be added to the user's collection.
   Wireframe: https://caritasauxilium-addact--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_add.jpg)
   
5. In this collection page, users can see their acts. If there are any mistakes when entering the form or the users have not donated yet, users can update or delete the acts in their collection. These crisis cards contain more information about the crisis when they are clicked, same as main page ones.
   Wireframe: https://caritasauxilium-collection--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_collections.jpg)
   
6. Account page contain informations about the user. Logged in users can change the details of their information here.
   Wireframe: https://caritasauxilium-account--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_account.jpg)
   
7. Reports page contains a detailed chart and summary of a user's donation during a certain year. User can prin out the report to use as a deduction item.
   Wireframe: https://caritasauxilium-report--stahlreinhart.repl.co/
   ![image1](https://github.com/PeterAndreas77/caritas-auxilium-fullstack-capstone/blob/master/github-images/caritas_report.jpg)

# Technical stack

**Front-end**

- HTML5
- CSS3
- JavaScript
- jQuery

**Back-end**

- NodeJS
- Mongoose / MongoDB
- Heroku (hosting)

**Testing**

- Mocha & Chai
- TravisCI

**Responsiveness**

- The site is fully responsive on most mobile & laptop devices.
- Tested on Chrome, Firefox & Safari.

**Security**

- Passport
- Bcryptjs

## NODE command lines

- npm install ==> install all node modules
- nodemon server.js ==> run node server
- npm test ==> run the tests

# Development Roadmap

### Version 1.0

\*Currently brainstorming for new features
