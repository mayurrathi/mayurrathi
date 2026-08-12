cat << 'CSSEOF' > custom.css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

body {
    font-family: 'Inter', sans-serif !important;
    background-color: #FDFAF4 !important;
    color: #5A5A6A !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif !important;
    color: #3C3C3C !important;
}

a {
    color: #C89B3C !important;
}

a:hover {
    color: #8B6320 !important;
}

/* Ensure the entire header area is white to match the logo */
.site-header,
header,
#header,
#expert-ngo-volunteer-header-main,
.expert-ngo-volunteer-header-bottom,
.header-wrapper,
.site-branding,
.header-area,
.header-top-area,
.site-header-wrap,
.header-section,
.top-area,
.header-top,
.header-main,
.ngo-header,
#site-header,
.main-navigation,
.main-navigation ul,
nav .main-navigation,
.nav-menu,
.primary-menu,
.header_nav {
    background-color: #FFFFFF !important;
    background: #FFFFFF !important;
}

.site-hero h1,
.page-banner h1,
.inner-banner h1,
.banner-content h1 {
    display: none !important;
}
CSSEOF
wp post update 194 custom.css
