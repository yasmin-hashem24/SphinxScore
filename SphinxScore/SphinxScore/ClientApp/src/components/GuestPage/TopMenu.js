// Importing necessary dependencies
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

// Array of pages for navigation menu
import { Link } from "react-router-dom";
const pages = ["LogIn", "SignUp"];

/**
 * Represents a responsive app bar component with menus.
 * @returns {JSX.Element} The JSX element representing the responsive app bar.
 */
function TopMenu() {
    // State variables for anchor elements of navigation and user menus
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    // Event handler for opening navigation menu
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    // Event handler for closing navigation menu
    const handleCloseNavMenu = (e) => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#3A4D39" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Title */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "sans-serif",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "#ECE3CE",
                            textDecoration: "none",
                        }}
                    >
                        Sphinx Score
                    </Typography>

                    {/* Navigation menu for small screens */}
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="#ECE3CE"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {/* Menu items */}
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Link to={`/${page}`}>
                                        <Typography
                                            textAlign="center"
                                            sx={{ fontFamily: "sans-serif" }}
                                        >
                                            {page}
                                        </Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo */}
                    {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}

                    {/* Title */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "sans-serif",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "#ECE3CE",
                            textDecoration: "none",
                        }}
                    >
                        Sphinx Score
                    </Typography>

                    {/* Navigation menu for large screens */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "flex-end",
                        }}
                    >
                        {/* Menu items */}
                        {pages.map((page) => (
                            <Link to={(page === "LogIn") ? "/LogInPage" : "/SignUpPage"}>
                                <Button
                                    key={page}
                                    onClick={(e) => handleCloseNavMenu(e)}
                                    sx={{
                                        my: 2,
                                        color: "#ECE3CE",
                                        display: "block",
                                        fontFamily: "sans-serif",
                                    }}
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default TopMenu;
