// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AutoGarageApp from "./components/AutoGarageApp";
import AutoGarageHomepage from "./components/AutoGarageHomepage";
import BookingPage from "./components/BookingPage";
import MessagesPage from "./components/MessagesPage";
import UserProfile from "./components/UserProfile";
import MyBookings from "./components/MyBookings";
import GarageOwnerDashboard from "./components/GarageOwnerDashboard";
import AddGarage from "./components/AddGarage";
import MyGarages from "./components/MyGarages";
import ManageServices from './components/ManageServices';
import GarageDetails from "./components/GarageDetails";

function App() {
    return ( <
        Router >
        <
        Routes > { /* Landing Page */ } <
        Route path = "/"
        element = { < AutoGarageApp / > }
        />

        { /* Main Homepage */ } <
        Route path = "/AutoGarageHomepage"
        element = { < AutoGarageHomepage / > }
        />

        { /* Garage Management Routes */ } <
        Route path = "/add-garage"
        element = { < AddGarage / > }
        /> <
        Route path = "/my-garages"
        element = { < MyGarages / > }
        /> <
        Route path = "/garage/:id"
        element = { < GarageDetails / > }
        />

        { /* Booking Routes */ } <
        Route path = "/booking/:garageId"
        element = { < BookingPage / > }
        /> <
        Route path = "/my-bookings"
        element = { < MyBookings / > }
        />

        { /* Messaging Routes */ }
        // App.js में routes update करो
        // App.js में दोनों routes add करो
        <
        Route path = "/messages/garage/:garageId"
        element = { < MessagesPage / > }
        /> <
        Route path = "/messages/user/:userId"
        element = { < MessagesPage / > }
        />

        { /* User Routes */ } <
        Route path = "/profile"
        element = { < UserProfile / > }
        />

        <
        Route path = "/manage-services"
        element = { < ManageServices / > }
        />

        { /* Garage Owner Routes */ } <
        Route path = "/garage-dashboard"
        element = { < GarageOwnerDashboard / > }
        /> < /
        Routes > <
        /Router>
    );
}

export default App;