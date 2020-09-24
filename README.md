Capstone project: GTravel

This app is an innovative personal vacation planner that helps you create optimized itineraries for your trips and find out interesting information about your dream destinations.

The project is developed using modern technologies and Google APIs.

Structure:\
    #Appengine - used to host the website\
    #Backend: \
       -Java Servlets\
       -Datastore\
      ~To deploy the backend use: \
          mvn package appengine:deploy\
      ~To run it locally:\
          mvn package appengine:run\
    #Frontend:\
        -React\
        -HTML\
        -CSS\
        -JavaScript\
      ~To deploy the frontend:\
        -first you need to build all the new changes that you have made:\
           npm run build\
        -then you deploy:\
           gcloud app deploy\
      ~To run it locally:\
           yarn local \
        (usually you will need to use port 3001 for it to work properly)\
    #To deploy the dispatch.yaml that makes sure all the urls are connected correctly to backend   and frontend accordingly:\
           gcloud app deploy dispatch.yaml\
           
 Make sure you are always in the right directory!\

 #APIs used:\
   -Maps API\
   -Places API\
   -Directions API\
   -Users API\
   -Weather API\
   -Geocode API\
      
   For using these APIs you will need to get your own API key!\

 
