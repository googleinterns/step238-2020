package com.google.gtravel.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

/** Servlet responsible for deleting  comments. */
@WebServlet("/api/delete")
public class DeleteServlet extends HttpServlet {

  @Override
  protected void service(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    doPost(request, response);
  } 
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long id = Long.parseLong(request.getParameter("id"));
 
    Key tripEntityKey = KeyFactory.createKey("Trip", id);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.delete(tripEntityKey);
    response.sendRedirect("/");
 
  }
}
