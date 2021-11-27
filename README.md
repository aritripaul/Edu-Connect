# EDU Connect
Edu Connect is all-in-one platform for e-learning. It is an easy-to-use and secure tool which helps teachers and students to connect and enrich the learning experiences together.

Website Link - [EduConnect](https://educonnect-333219.web.app/)

> _The website is hosted on a server that is owned by my college, and the frontend is hosted on Firebase._

## How to get started with the website?

You can _**Sign up**_ on the web application as students or teachers. However for teachers, their employee IDs are required. I have hard coded some values for employee IDs as of now, which you can find below.

Please use only these employee IDs while signing up as a teacher. 

![employeeIDs](https://drive.google.com/uc?export=view&id=1hLj3K8urPrpNgr-u25nGCCWD8XhzKKpF)

You can also find the same in a file named "EmployeeIDs" in the repository. 

If you prefer logging in than signing up, here are a few credentials which might be helpful. 

**Login credentials -** (checkout 'login credentials' file in the repo)

> _For student login_,
username = 'aritripaul',
password = 'Aritri_1'

> _For teacher login_,
username = 'deepak'
password = 'Aritri_1'


Once you login, you can explore the various features present in the website. 





## How to run the application locally?

Since the backend is already hosted, you may choose to only run the frontend locally. For doing so, 
1. Clone the github repository.
2. Move to the directory of the project and do 
```npm install```
3. Run ```yarn start``` or ```npm start```

![terminals](https://drive.google.com/uc?export=view&id=1AhdbXNUyIpNUUyY5zszfTsnsxGnDh7Sc)

In case you also want to run the backend locally, you need to

1. First create a database named **"sample_db"** in Postgresql. 
2. Next, change the **"BASE_URL"** in **'src/config/routes.js'** to 'http://localhost:3000/' (since now the requests would be made to localhost instead of the server the website is hosted on)
3. Create a **'.env'** file and paste the content of 'ENV' on this file.
4. Now open a new terminal (other than frontend) and chage directory to 'backend'.
5. Do ```npm install```
6. Run ```nodemon index.js```

![terminals](https://drive.google.com/uc?export=view&id=1395MCOtAKi2d2IrXwYOK3OX2uRg9mMEB)

You should be now able to run the application on localhost. 


## Technology Stack 

* Node.JS and Express.JS for backend 
* PostgreSQL for database
* React for frontend

Hosted backend on a server owned by my college, and frontend on Firebase.


## Database Design

![db_design](https://drive.google.com/uc?export=view&id=11NBvQCW_iM28V-qf-sA7YGFf8Kq1y8Tv)

## Main features of Edu Connect

* **Authentication System**
    
     User needs to sign up for using the features of this application. While doing so, one can sign up as a teacher or student as per their role. However, to prevent the students signing up as teachers, an "Employee ID" is required for the teachers. 
     
     Please note that, 
     > _organizations using this web application will also have to provide a list of Employee IDs for verification purposes_. 

     ![login](https://drive.google.com/uc?export=view&id=1MFUtb5N9N-pM6sFfiqegxGC_w1MDYYsL)


* **Classes** 

    As per the role of the user, the features of classes would be visible. 

     For a teacher, they will be allowed to _**create classrooms**_ and _**schedule individual classes**_ within them by providing the date and time.

    ![class](https://drive.google.com/uc?export=view&id=1-kIyR6OCiZKWDfVlo8Gf4R6PZUP-dgZq)

    ![inside_Class](https://drive.google.com/uc?export=view&id=13R4XS_4Op_mHqlkAnjkqYGPi1d9UA-pr)

     For a student, they will only be allowed to _**join classes**_. 

     ![joinclass](https://drive.google.com/uc?export=view&id=1TjiUFbk-G0aXPHW3l5yPVx_dlTomvJAq)
     
     Please note that, 
     >_to prevent any student joining any random class which they should not be a part of, a list of students who requested to join would be available to the teachers. Only after the teacher verifies, the student can join the particular class_.

     ![request_to_join_class](https://drive.google.com/uc?export=view&id=1iNo9verVLH7jHeOAKuwhFCHg0JvQJusB)

* **Book Offline Seats**

    While scheduling a class, the teacher needs to mention the number of offline seats available. Students will be able to  _**book offline seats**_ on first come first serve basis, based on the number of seats available. 

    ![schedule_class](https://drive.google.com/uc?export=view&id=1AFph7UK3P4e68q1xe9KAVWYusjuw9_-y)


* **Upcoming Classes**

    Users can also view their upcoming classes in the coming days. The teachers would be able to see all the upcoming classes they have scheduled, and students would be able to view all the upcoming classes they are enrolled in.

    ![offline_attendance](https://drive.google.com/uc?export=view&id=1_vQQFAZqvQRSydLPAC_DUDBn8ylOuG_T)

* **Video call** 

    On starting any scheduled class by clicking 'START NOW', a video call gets started which the teacher and students can join to conduct classes.

    ![video_call](https://drive.google.com/uc?export=view&id=1lMSUGYZmx6XXbT1b5zu_tXEjiRTOggE9)

* **Assignments**

    Teachers on the website can _**upload**_ and _**grade assignments**_, by viewing the submissions of the students. 

    ![assignment](https://drive.google.com/uc?export=view&id=12Vlvxv-UnUZD5I33Dsv3Pxj1luQZc22m)


    Students can filter the pending and completed assignments and _**submit**_ their files on the website. 

    ![submission](https://drive.google.com/uc?export=view&id=1jP490vK6Ws6rJ3zNMxyUkttfbFkPnGNR)

    > NOTE : _Students and teachers both can upload pdf files not more than 5 MB in size._

* **Notifications** 

    Teachers and students can communicate on the classroom using the notifications feature.

    ![notifications](https://drive.google.com/uc?export=view&id=1-GpZREqdYXTDb8HoyoLtL5QjG4zLsIbF)


## Future Scope 

The notifications feature can be improved by adding a moderator, and the visuals can also be like a chat based application in the classroom.

A public forum feature can be added where students can ask their doubts and other students across all organizations can answer, with each question having tags and upvotes and downvotes for the answers.