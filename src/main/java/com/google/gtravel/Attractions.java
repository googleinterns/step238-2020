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

package com.google.sps;

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

@WebServlet("/attractions")
public class Attractions extends HttpServlet {
  private String API_KEY = "";
  private final CloseableHttpClient httpClient = HttpClients.createDefault();

  private String getRequest(String url) throws IOException {
    String output = "";
    HttpGet req = new HttpGet(url);

    try (CloseableHttpResponse res = httpClient.execute(req)) {

      HttpEntity entity = res.getEntity();
      Header headers = entity.getContentType();

      if (entity != null) {
        String result = EntityUtils.toString(entity);
        output += result;
      }
    }
    return output;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String latitude = request.getParameter("lat");
    String longitude = request.getParameter("long");
    // For Munich
    // lat = 48.1351
    // long = 11.5820
    // Example Usage:
    // example.com/attractions?lat=48.1351&long=11.5820

    String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    url += latitude;
    url += ",";
    url += longitude;

    url += "&radius=10000&type=tourist_attraction&key=AIzaSyAalNVe9tRut2hxyNj0OT4VH8Ob8jaryIc";
    String result = getRequest(url);
    response.setContentType("application/json");
    response.getWriter().println(result);
  }
}
