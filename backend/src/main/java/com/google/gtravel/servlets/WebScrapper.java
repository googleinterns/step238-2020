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

import java.io.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

@WebServlet("/api/webscrapper")
public class WebScrapper extends HttpServlet {

  Document getWikiDocument(String name) throws Exception {
    Document doc = Jsoup.connect("https://en.wikipedia.org/wiki/" + name).get();
    return doc;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String description = request.getParameter("attractionName");

    try{
      Document document = getWikiDocument(description);
      Elements contents = document.getElementsByClass("mw-parser-output");
      Element content = contents.first();
      Elements paragraphs = content.getElementsByTag("p");

      String paragraph = "";
      for (Element pElement: paragraphs) {
        if(!(pElement.text().isEmpty()))
        {
          paragraph = pElement.text(); 
          break;
        }
      }
      Gson gson = new Gson();
      response.setContentType("application/json");
      response.getWriter().println(gson.toJson(paragraph));
    } catch(Exception e) {
       //System.out.println(e.getMessage());
      String message = "No description to be shown";
      Gson gson = new Gson();
      response.setContentType("application/json");
      response.getWriter().println(gson.toJson(message));
    }

  }
}
