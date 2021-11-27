# EDU Connect
Edu Connect is all-in-one platform for e-learning. It is an easy-to-use and secure tool which helps teachers and students to connect and enrich the learning experiences together.

Website Link - [EduConnect](https://educonnect-333219.web.app/)

> _The website is hosted on a server that is bought by my college, and the frontend is hosted on firebase._

## How to run the application locally?

1. Clone the github repository.
2. Open two terminals, for backend and frontend each. Change directory to 'backend' in one of the terminals. 




## Main features 

* **Authentication System**
    
     User needs to sign up for using the features of this application. While doing so, one can sign up as a teacher or student as per their role. However, to prevent the students signing up as teachers, an "Employee ID" is required for the teachers. 
     
     Please note that, 
     > _organizations using this web application will also have to provide a list of Employee IDs for verification purposes_. 

* **Classes** 

    As per the role of the user, the features of classes would be visible. 

     For a teacher, they will be allowed to _**create classrooms**_ and _**schedule individual classes**_ within them by providing the date and time.

     For a student, they will only be allowed to _**join classes**_. 
     
     Please note that, 
     >_to prevent any student joining any random class which they should not be a part of, a list of students who requested to join would be available to the teachers. Only after the teacher verifies, the student can join the particular class_.

* **Book Offline Seats**

    While scheduling a class, the teacher needs to mention the number of offline seats available. Students will be able to  _**book offline seats**_ on first come first serve basis, based on the number of seats available. 

* **Upcoming Classes**

    Users can also view their upcoming classes in the coming days. The teachers would be able to see all the upcoming classes they have scheduled, and students would be able to view all the upcoming classes they are enrolled in.

* **Assignments**


## Technology Stack used

* Node.JS and Express.JS for backend 
* PostgreSQL for database
* React for frontend


## Architechture








![db_design](https://drive.google.com/uc?export=view&id=11NBvQCW_iM28V-qf-sA7YGFf8Kq1y8Tv)