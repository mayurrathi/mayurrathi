cat << 'CSSEOF' > custom2.css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

html, body, .site, #page, .mainhead, .site-header, header, .header-wrapper, .site-branding, .header-area, .header-top-area, .site-header-wrap, .header-section, .top-area, .header-top, .header-main, .ngo-header, #site-header, .main-header, .middle-header-area, .site-content {
    background-color: #FFFFFF !important;
    background: #FFFFFF !important;
}

body {
    font-family: 'Inter', sans-serif !important;
    color: #1E293B !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif !important;
    color: #1E293B !important;
}

a {
    color: #C89B3C !important;
}

a:hover {
    color: #8B6320 !important;
}

.site-hero h1,
.page-banner h1,
.inner-banner h1,
.banner-content h1 {
    display: none !important;
}
CSSEOF
wp post update 194 custom2.css
wp cache flush
