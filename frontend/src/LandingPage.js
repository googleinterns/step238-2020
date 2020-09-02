import React from 'react';
import './App.css';
import { Client, Status } from "@googlemaps/google-maps-services-js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import { createBrowserHistory } from "history";
import SECRET_KEY from './config';
import Map from './Itinerary';
import Button from "react-bootstrap/Button";
import ReactDOM from 'react-dom';
import ImgKey from './configImg';

function LandingPage() {
    function createListElem(attraction){
        const liElement = document.createElement("li");
        let touristsview = '';
        const keyImg = Object.values(ImgKey)[0];
        touristsview +='<img width=300 height= 200 src='+'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+attraction.photos[0].photo_reference+'&key='+keyImg+'>' +
                                    '<br>' +
                                    '<strong id="rating">'+attraction.rating+'</strong>' +
                                    '<span id="total_rating">'+ '('+ attraction.user_ratings_total+ ')' +'</span>' +
                                    '<br>' +
                                    '<span id="name">'+attraction.name+'</span>' +
                                    '<br>';
        liElement.innerHTML = touristsview;
        const buttonAdd = document.createElement('button');
        buttonAdd.innerText = 'ADD';
        buttonAdd.addEventListener('click', () => {
            if (buttonAdd.innerText == "ADD") {
                console.log("ADD");
                buttonAdd.innerText = "REMOVE";
            } else {
                console.log("REMOVE");
                buttonAdd.innerText = "ADD";
            }
        });
        liElement.appendChild(buttonAdd);
        return liElement;

    }
    function submitcity() {
        const searchValue = document.getElementById('searchbox').value;
        searchValue.replace(/\s/g, '+');
        const key = Object.values(SECRET_KEY)[0];
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + searchValue +
            '&key=' + key;

        fetch(url)
            .then(response => response.json())
            .then(function(data) {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                const adress = '/api/attractions?lat=' + lat + '&long=' + lng;
                fetch(adress)
                    .then(response => response.json())
                    .then(function(attractions) {
                        setTimeout(function() {
                            const listatt = document.getElementById('attraction');
                            const listDiv = document.createElement('div');
                            listDiv.className = 'row';
                            listDiv.innerHTML = '';
                            for (let i = 0; i < attractions.results.length; i++) {
                                listDiv.appendChild(createListElem(attractions.results[i]));
                    }
                listatt.innerHTML = '';
                listatt.appendChild(listDiv);
            }
                , 200);
    }
                    );
})
}


return (
    <div>
        <nav className="navbar navbar-light bg-light static-top">
            <div className="container">

                <a className="navbar-brand" href="#">GTravel</a>

                <a className="btn btn-primary" href="#">Sign In</a>
            </div>
        </nav>


        <header className="masthead text-white text-center">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-9 mx-auto">
                        <h1 className="mb-5">Plan your trip!</h1>
                    </div>
                    <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                        <div className="form-row">
                            <div className="col-12 col-md-9 mb-2 mb-md-0">
                                <input type="text" id="searchbox" className="form-control form-control-lg" placeholder="Enter a destination..." />
                            </div>
                            <div className="col-12 col-md-3">
                                <button type="submit" id="submit_button" className="btn btn-block btn-lg btn-primary" onClick={submitcity}>Search!</button>
                                <br />
                                <Link to="/map">
                                    <Button>Create Itinerary</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>


        <section className="features-icons bg-light text-center">
            <div className="container" id="attraction">

            </div>
        </section>

        <section className="features-icons bg-light text-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div className="features-icons-icon d-flex">
                                <img className="img-fluid rounded-circle mb-3" src="assets/img/destination.jpg" alt="" />
                            </div>
                            <h3>Choose your destination!</h3>
                            <p className="lead mb-0">Let us know where are you planning to spend your vacation</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div className="features-icons-icon d-flex">
                                <i className="icon-layers m-auto text-primary"></i>
                            </div>
                            <h3>Find the best attractions!</h3>
                            <p className="lead mb-0">Add to your to-do list the places you want to visit and find out amazing details about all of them</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                            <div className="features-icons-icon d-flex">
                                <i className="icon-check m-auto text-primary"></i>
                            </div>
                            <h3>Generate your customizable itinerary!</h3>
                            <p className="lead mb-0">Vizualize on the Google Maps how your journey will look like to save time and visit everything you desire</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="testimonials text-center bg-light">
            <div className="container">
                <h2 className="mb-5">What people are saying...</h2>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-1.jpg" alt="" />
                            <h5>Margaret E.</h5>
                            <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-2.jpg" alt="" />
                            <h5>Fred S.</h5>
                            <p className="font-weight-light mb-0">"The tool I always needed for my trips."</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-3.jpg" alt="" />
                            <h5>Sarah W.</h5>
                            <p className="font-weight-light mb-0">"All my vacations are perfect!"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section className="call-to-action text-white text-center">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-9 mx-auto">
                        <h2 className="mb-4">Ready to get started? Sign up now!</h2>
                    </div>
                    <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                        <form>
                            <div className="form-row">
                                <div className="col-12 col-md-9 mb-2 mb-md-0">
                                    <input type="email" className="form-control form-control-lg" placeholder="Enter your email..." />
                                </div>
                                <div className="col-12 col-md-3">
                                    <button type="submit" className="btn btn-block btn-lg btn-primary">Sign up!</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <footer className="footer bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
                        <ul className="list-inline mb-2">
                            <li className="list-inline-item">
                                <a href="#">About</a>
                            </li>
                            <li className="list-inline-item">&sdot;</li>
                            <li className="list-inline-item">
                                <a href="#">Contact</a>
                            </li>
                            <li className="list-inline-item">&sdot;</li>
                            <li className="list-inline-item">
                                <a href="#">Create an itinerary</a>
                            </li>
                            <li className="list-inline-item">&sdot;</li>
                            <li className="list-inline-item">
                                <a href="#">My Trips</a>
                            </li>
                        </ul>
                        <p className="text-muted small mb-4 mb-lg-0">&copy; GTravel 2020</p>
                    </div>
                    <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item mr-3">
                                <a href="#">
                                    <i className="fa fa-facebook fa-2x fa-fw"></i>
                                </a>
                            </li>
                            <li className="list-inline-item mr-3">
                                <a href="#">
                                    <i className="fa fa-twitter-square fa-2x fa-fw"></i>
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#">
                                    <i className="fa fa-instagram fa-2x fa-fw"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </div>
);
}

export default LandingPage;
