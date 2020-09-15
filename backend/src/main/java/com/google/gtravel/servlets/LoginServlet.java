
package com.google.sps.servlets;


import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gtravel.data.User;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/login")

public class LoginServlet extends HttpServlet {

 @Override
 public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
   response.setContentType("text/html");
   UserService userService = UserServiceFactory.getUserService();
   User user;
   if (userService.isUserLoggedIn()) {
     String logoutUrl = userService.createLogoutURL("/");
     String id = userService.getCurrentUser().getUserId();
     user = new User(true, logoutUrl, id);
   } else {
     String loginUrl = userService.createLoginURL("/");
     user = new User(false, loginUrl);
   }
   Gson gson = new Gson();
   response.setContentType("application/json");
   response.getWriter().println(gson.toJson(user));
 }
}
