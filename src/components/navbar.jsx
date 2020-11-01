import React, {Component} from "react";

class Navbar extends Component {
    render() {
        const navbarStyle = {
            backgroundColor: "black",

        };
        return (
            <nav className="navbar navbar-light bg-light" style={navbarStyle}>
                <a className="navbar-brand" href="/">Home</a>
            </nav>
        )
    }
}

export default Navbar;