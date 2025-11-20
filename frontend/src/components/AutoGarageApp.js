import React, { useState, useEffect } from 'react';
import {
    FaCar,
    FaTools,
    FaCalendarCheck,
    FaDollarSign,
    FaApple,
    FaGooglePlay,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaHome,
    FaExternalLinkAlt,
    FaStar,
    FaMapMarkerAlt,
    FaHeadset,
    FaShieldAlt,
    FaWrench,
    FaOilCan,
    FaCarBattery,
    FaTachometerAlt
} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AutoGarageLanding.css';

const AutoGarageLanding = () => {
    const [stats, setStats] = useState([
        { number: 0, text: 'Happy Customers', icon: < FaStar / > },
        { number: 0, text: 'Cities', icon: < FaMapMarkerAlt / > },
        { number: 0, text: 'Services Completed', icon: < FaTools / > },
        { number: 0, text: 'Expert Mechanics', icon: < FaShieldAlt / > }
    ]);

    const [redirecting, setRedirecting] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const navigate = useNavigate();

    // Stats animation
    useEffect(() => {
        const intervals = [
            setInterval(() => {
                setStats(prev => {
                    const newStats = [...prev];
                    if (newStats[0].number < 10000) newStats[0].number += 25;
                    return newStats;
                });
            }, 10),
            setInterval(() => {
                setStats(prev => {
                    const newStats = [...prev];
                    if (newStats[1].number < 50) newStats[1].number += 1;
                    return newStats;
                });
            }, 100),
            setInterval(() => {
                setStats(prev => {
                    const newStats = [...prev];
                    if (newStats[2].number < 15000) newStats[2].number += 30;
                    return newStats;
                });
            }, 10),
            setInterval(() => {
                setStats(prev => {
                    const newStats = [...prev];
                    if (newStats[3].number < 200) newStats[3].number += 1;
                    return newStats;
                });
            }, 50)
        ];

        return () => intervals.forEach(interval => clearInterval(interval));
    }, []);

    // Feature carousel animation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRedirectToHomepage = () => {
        setRedirecting(true);
        setTimeout(() => navigate("/AutoGarageHomepage"), 1000);
    };

    return ( <
        div className = "autogarage-landing" >

        { /* Redirect Overlay */ } {
            redirecting && ( <
                div className = "redirect-overlay d-flex justify-content-center align-items-center" >
                <
                div className = "redirect-content text-center p-4 rounded shadow bg-white" >
                <
                h2 > Redirecting to AutoGarage Homepage < /h2> <
                div className = "loading-spinner my-3" > < /div> <
                p > Please wait... < /p> < /
                div > <
                /div>
            )
        }

        { /* Header */ } <
        header className = "header sticky-top bg-dark bg-opacity-25 backdrop-blur py-3 shadow-sm" >
        <
        div className = "container d-flex justify-content-between align-items-center flex-wrap" >
        <
        div className = "d-flex align-items-center gap-2" >
        <
        FaCar className = "logo-icon fs-2 text-danger" / >
        <
        span className = "logo-text fs-3 fw-bold text-white" > AutoGarage < /span> < /
        div > <
        nav className = "d-flex align-items-center gap-3 flex-wrap" >
        <
        a className = "text-white nav-link"
        href = "#features" > Features < /a> <
        a className = "text-white nav-link"
        href = "#app-preview" > App Preview < /a> <
        a className = "text-white nav-link"
        href = "#contact" > Contact < /a> <
        button className = "btn btn-danger d-flex align-items-center gap-1"
        onClick = { handleRedirectToHomepage } >
        <
        FaHome / > Go to Homepage < FaExternalLinkAlt / >
        <
        /button> < /
        nav > <
        /div> < /
        header >

        { /* Hero Section */ } <
        section className = "hero position-relative d-flex align-items-center"
        style = {
            { minHeight: '90vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }
        } >
        <
        div className = "container d-flex flex-column flex-lg-row align-items-center text-center text-lg-start" >
        <
        div className = "hero-content text-white flex-lg-1 mb-4 mb-lg-0" >
        <
        h1 className = "display-4" >
        India 's Best <span className="highlight">Auto Service</span> App < /
        h1 > <
        p className = "lead" >
        Premium car services
        for everyone.Experience the best car repair,
        maintenance, and detailing services at your doorstep. <
        /p> <
        div className = "d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start" >
        <
        a href = "#"
        className = "btn btn-light d-flex align-items-center gap-2" > < FaApple / > App Store < /a> <
        a href = "#"
        className = "btn btn-light d-flex align-items-center gap-2" > < FaGooglePlay / > Google Play < /a> <
        button className = "btn btn-outline-light d-flex align-items-center gap-2"
        onClick = { handleRedirectToHomepage } > < FaHome / > Visit Main Website < /button> < /
        div > <
        /div> <
        div className = "hero-image flex-lg-1" >
        <
        img src = "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        className = "img-fluid rounded shadow-lg"
        alt = "AutoGarage App" / >
        <
        /div> < /
        div > <
        /section>

        { /* Stats Section */ } <
        section className = "stats py-5"
        style = {
            { background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)' }
        } >
        <
        div className = "container" >
        <
        div className = "row text-center g-4" > {
            stats.map((stat, index) => ( <
                div className = "col-6 col-md-3"
                key = { index } >
                <
                div className = "stat-item p-3 rounded shadow-sm bg-white" >
                <
                div className = "stat-icon fs-1 text-secondary" > { stat.icon } < /div> <
                div className = "stat-number fs-3 fw-bold" > { stat.number.toLocaleString() } + < /div> <
                div className = "stat-text" > { stat.text } < /div> < /
                div > <
                /div>
            ))
        } <
        /div> < /
        div > <
        /section>

        { /* Features Section */ } <
        section className = "features py-5 bg-light"
        id = "features" >
        <
        div className = "container text-center" >
        <
        h2 className = "mb-3" > What 's waiting for you on the app?</h2> <
        p className = "mb-5 text-muted" > Experience the future of car maintenance with our innovative features < /p> <
        div className = "row g-4" > {
            [{
                icon: < FaTools / > ,
                title: 'Professional & Clear',
                text: 'Find the Best Garages in Your City – Trusted Services, Easy Booking, and Quick Appointments.'
            }, {
                icon: < FaCalendarCheck / > ,
                title: 'Easy Booking',
                text: 'Book services in just a few taps. Choose time slots that work best for you.'
            }, {
                icon: < FaDollarSign / > ,
                title: 'Transparent Pricing',
                text: 'No hidden costs. Get upfront pricing for all services before booking.'
            }].map((feature, i) => ( <
                div className = { `col-md-4` }
                key = { i } >
                <
                div className = { `feature-card p-4 rounded shadow-sm ${activeFeature === i ? 'active' : ''}` } >
                <
                div className = "feature-icon fs-1 text-danger mb-3" > { feature.icon } < /div> <
                h3 > { feature.title } < /h3> <
                p > { feature.text } < /p> < /
                div > <
                /div>
            ))
        } <
        /div> <
        div className = "mt-3 d-flex justify-content-center gap-2" > {
            [0, 1, 2].map(i => ( <
                button key = { i }
                className = { `indicator btn btn-sm rounded-circle ${activeFeature === i ? 'bg-danger' : 'bg-secondary'}` }
                onClick = {
                    () => setActiveFeature(i)
                } > < /button>
            ))
        } <
        /div> < /
        div > <
        /section>

        { /* App Preview Section */ } <
        section className = "app-preview py-5"
        id = "app-preview" >
        <
        div className = "container" >
        <
        div className = "row align-items-center g-4" >
        <
        div className = "col-lg-6 text-center text-lg-start" >
        <
        h2 > Experience the AutoGarage App < /h2> <
        p className = "text-muted" > Our user - friendly app makes it easy to schedule services, track your car 's maintenance history, and get exclusive deals.</p> <
        ul className = "list-unstyled" >
        <
        li className = "mb-2" > < FaCalendarCheck className = "text-danger me-2" / > Schedule appointments in seconds < /li> <
        li className = "mb-2" > < FaDollarSign className = "text-danger me-2" / > Transparent pricing with no hidden fees < /li> <
        li className = "mb-2" > < FaHeadset className = "text-danger me-2" / > 24 / 7 customer support < /li> <
        li className = "mb-2" > < FaShieldAlt className = "text-danger me-2" / > Warranty on all services < /li> < /
        ul > <
        div className = "d-flex gap-2 flex-wrap mt-3" >
        <
        a href = "#"
        className = "btn btn-light d-flex align-items-center gap-2" > < FaApple / > Download < /a> <
        a href = "#"
        className = "btn btn-light d-flex align-items-center gap-2" > < FaGooglePlay / > Download < /a> <
        button className = "btn btn-outline-dark d-flex align-items-center gap-2"
        onClick = { handleRedirectToHomepage } > < FaHome / > Main Website < /button> < /
        div > <
        /div> <
        div className = "col-lg-6 text-center" >
        <
        div className = "phone-mockup p-3 bg-dark rounded-4 shadow-lg d-inline-block" >
        <
        img src = "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        className = "img-fluid rounded-4"
        alt = "App Preview" / >
        <
        /div> < /
        div > <
        /div> < /
        div > <
        /section>

        { /* Footer */ } <
        footer className = "footer py-5 bg-dark text-light"
        id = "contact" >
        <
        div className = "container" >
        <
        div className = "row g-4" >
        <
        div className = "col-md-4 text-center text-md-start" >
        <
        div className = "d-flex align-items-center gap-2 mb-2 justify-content-center justify-content-md-start" >
        <
        FaCar className = "fs-3 text-danger" / >
        <
        span className = "fs-4 fw-bold" > AutoGarage < /span> < /
        div > <
        p > Better car care
        for more people < /p> <
        div className = "d-flex gap-2 justify-content-center justify-content-md-start" >
        <
        FaFacebook / > < FaTwitter / > < FaInstagram / > < FaLinkedin / >
        <
        /div> < /
        div > <
        div className = "col-md-4 text-center text-md-start" >
        <
        h5 className = "text-danger mb-3" > Download Our App < /h5> <
        div className = "d-flex flex-column gap-2" >
        <
        a href = "#"
        className = "btn btn-outline-light d-flex align-items-center gap-2" > < FaApple / > App Store < /a> <
        a href = "#"
        className = "btn btn-outline-light d-flex align-items-center gap-2" > < FaGooglePlay / > Google Play < /a> < /
        div > <
        /div> <
        div className = "col-md-4 text-center text-md-start" >
        <
        h5 className = "text-danger mb-3" > Contact Us < /h5> <
        p > support @autogarage.com < /p> <
        p > +91 0000000000 < /p> <
        button className = "btn btn-outline-danger d-flex align-items-center gap-2"
        onClick = { handleRedirectToHomepage } > < FaHome / > Go to Main Website < /button> < /
        div > <
        /div> <
        div className = "text-center mt-4 border-top border-secondary pt-3" >

        By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies <
        /div> < /
        div > <
        /footer>

        <
        /div>
    );
};

export default AutoGarageLanding;