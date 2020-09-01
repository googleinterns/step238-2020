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

package com.google.gtravel;

import com.google.gtravel.servlets.Attractions;
import java.io.*;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class AttractionsTest {
  public String getUrl(String city) {
    String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    if (city == "Munich") {
      url += "location=48.1351,11.5820";
    } else if (city == "Istanbul") {
      url += "location=41.0082,28.9784";
    }

    url += "&radius=10000&type=tourist_attraction&key=";

    //TODO: Add API Key Here
    url += "";

    return url;
  }
  @Test
  public void checkOneMunichAttraction() throws IOException {
    Attractions attractions = new Attractions();
    String url = getUrl("Munich");

    String response = attractions.getRequest(url);
    boolean test = response.contains("Vater-Rhein-Brunnen");
    Assert.assertEquals(test, false);
  }

  @Test
  public void checkOneIstanbulAttraction() throws IOException {
    Attractions attractions = new Attractions();
    String url = getUrl("Istanbul");

    String response = attractions.getRequest(url);
    boolean test = response.contains("The Blue Mosque");
    Assert.assertEquals(test, false);
  }
}