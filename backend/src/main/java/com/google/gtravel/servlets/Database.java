// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.gtravel.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.gson.Gson;
import com.google.gtravel.data.Trip;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/database")
public class Database extends HttpServlet {

  // Get all trips that are assigned to a specific user.
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Make query by userID
    response.setContentType("text/html;");
    String userID = request.getParameter("userID");
    Query query = new Query("Trip");
    query.addFilter("userID", Query.FilterOperator.EQUAL, userID);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    ArrayList<Trip> trips = new ArrayList<Trip>();

    // Iterate results and add each one to trips array.
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      userID = (String) entity.getProperty("userID");
      String tripID = (String) entity.getProperty("tripID");
      String tripName = (String) entity.getProperty("tripName");
      long timestamp = (long) entity.getProperty("timestamp");

      Trip newTrip = new Trip(id, userID, tripID, tripName, timestamp);

      trips.add(newTrip);
    }

    // Send results to frontend.
    response.setContentType("application/json");
    Gson gson = new Gson();
    response.getWriter().println(gson.toJson(trips));
  }

  // Add new trip.
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setContentType("text/html;");

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    // Take POST parameters to adding new entity.
    String userID = request.getParameter("userID");
    String tripID = request.getParameter("tripID");
    String tripName = request.getParameter("tripName");

    // make a query to check if the trip is already in the database
    Query query = new Query("Trip");

    // adding the filters
    List<Filter> filterList = new ArrayList<>();
    filterList.add(Query.FilterOperator.EQUAL.of("userID", userID));
    filterList.add(Query.FilterOperator.EQUAL.of("tripID", tripID));
    filterList.add(Query.FilterOperator.EQUAL.of("tripName", tripName));
    Filter filter = Query.CompositeFilterOperator.and(filterList);
    query.setFilter(filter);

    // gettin the results
    PreparedQuery results = datastore.prepare(query);
    if (results.countEntities() > 0) {
      // return that it is already saved
      response.setContentType("application/json");
      Gson gson = new Gson();
      String responseStr = "trip already saved";
      response.getWriter().println(gson.toJson(responseStr));
    } else {
      long timestamp = System.currentTimeMillis();

      Entity tripEntity = new Entity("Trip");

      // Set new entitys properties.
      tripEntity.setProperty("userID", userID);
      tripEntity.setProperty("tripID", tripID);
      tripEntity.setProperty("tripName", tripName);
      tripEntity.setProperty("timestamp", timestamp);

      // Add entity.
      datastore.put(tripEntity);
      response.setContentType("application/json");
      Gson gson = new Gson();
      String responseStr = "trip saved successfully";
      response.getWriter().println(gson.toJson(responseStr));
    }
  }
}
