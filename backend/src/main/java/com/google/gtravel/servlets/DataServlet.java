package com.google.gtravel.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
* Servlet that returns some example content.
*/
@WebServlet("/api/test-servlet")
public class DataServlet extends HttpServlet {

 @Override
 public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
   response.setContentType("text/html;");
   response.getWriter().println("Hello world from data servlet!");
 }
}