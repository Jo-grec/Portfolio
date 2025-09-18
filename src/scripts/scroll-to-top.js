// Scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  
  if (!scrollToTopBtn) return;
  
  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
  
  // Smooth scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Event listeners
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollToTopBtn.addEventListener('click', scrollToTop);
  
  // Initial check
  toggleScrollButton();
});
