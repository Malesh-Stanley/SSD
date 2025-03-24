// Add this to a separate JS file
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });

    // Dropdown hover effect
    if (window.innerWidth > 992) {
        document.querySelectorAll('.dropdown').forEach(function(dropdown) {
            dropdown.addEventListener('mouseenter', function() {
                this.querySelector('.dropdown-menu').classList.add('show');
            });
            dropdown.addEventListener('mouseleave', function() {
                this.querySelector('.dropdown-menu').classList.remove('show');
            });
        });
    }
}); 