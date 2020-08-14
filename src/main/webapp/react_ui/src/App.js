import React from 'react';
import logo from './logo.svg';
import './App.css';
 
function App() {
  return (
    <div className="App">
 
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
          <form>
            <div className="form-row">
              <div className="col-12 col-md-9 mb-2 mb-md-0">
                <input type="text" className="form-control form-control-lg" placeholder="Enter a destination..."/>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-block btn-lg btn-primary">Search!</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </header>
 
 
  <section className="features-icons bg-light text-center">
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div className="features-icons-icon d-flex">
            <img className="img-fluid rounded-circle mb-3" src="assets/img/destination.jpg" alt=""/>
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
            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-1.jpg" alt=""/>
            <h5>Margaret E.</h5>
            <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="testimonial-item mx-auto mb-5 mb-lg-0">
            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-2.jpg" alt=""/>
            <h5>Fred S.</h5>
            <p className="font-weight-light mb-0">"The tool I always needed for my trips."</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="testimonial-item mx-auto mb-5 mb-lg-0">
            <img className="img-fluid rounded-circle mb-3" src="img/testimonials-3.jpg" alt=""/>
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
                <input type="email" className="form-control form-control-lg" placeholder="Enter your email..."/>
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
 
export default App;