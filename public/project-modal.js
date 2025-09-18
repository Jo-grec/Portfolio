// Project data
const projectData = {
  'wvsushop': {
    title: 'WVSU Shop',
    description: 'An e-commerce platform designed specifically for West Visayas State University students and faculty. Features include product browsing, cart management, secure payments, and admin dashboard for inventory management.',
    image: 'assets/wvsushop1.png', // Change this to your modal image
    techStacks: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    githubLink: '#'
  },
  'petmedix': {
    title: 'PetMedix',
    description: 'A comprehensive veterinary management system that helps pet owners track their pets\' health records, schedule appointments, and connect with local veterinarians. Includes medication reminders and health analytics.',
    image: 'assets/petmedix-modal.png', // Change this to your modal image
    techStacks: ['Python', 'PySide6', 'MariaDB'],
    githubLink: '#'
  },
  'cictzone': {
    title: 'CictZone',
    description: 'CICTZONE is an interactive 2D shooting game where AI-powered NPCs navigate obstacle-filled grids, make strategic decisions, and adapt to player actions using techniques like pathfinding, constraint satisfaction, and intelligent agent behavior, enhancing realism and gameplay immersion.',
    image: 'assets/documentation-modal.png', // Change this to your modal image
    video: 'https://www.youtube.com/embed/4dCCRnqYmrQ', // Replace YOUR_VIDEO_ID with actual YouTube video ID
    techStacks: ['Python', 'Pygame', 'AI'],
    liveLink: '#',
    githubLink: '#'
  },
  'signgo': {
    title: 'SignGo',
    description: 'An innovative digital signature platform that enables secure document signing and verification. Features include multi-party signing, audit trails, and integration with popular document formats.',
    image: 'assets/signgo-modal.png', // Change this to your modal image
    techStacks: ['React Native', 'Blockchain', 'Web3', 'Ethereum', 'IPFS'],
    liveLink: '#',
    githubLink: '#'
  }
};

// DOM elements
const modal = document.getElementById('project-modal');
const modalImage = document.getElementById('modal-project-image');
const modalVideo = document.getElementById('modal-project-video');
const modalTitle = document.getElementById('modal-project-title');
const modalDescription = document.getElementById('modal-project-description');
const modalTechStacks = document.getElementById('modal-tech-stacks');
const modalLiveLink = document.getElementById('modal-live-link');
const modalGithubLink = document.getElementById('modal-github-link');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add click listeners to all project eye icons
  const projectEyes = document.querySelectorAll('.project-eye');
  
  projectEyes.forEach(eye => {
    eye.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the project card
      const projectCard = this.closest('.project-card');
      const projectTitle = projectCard.querySelector('.project-title').textContent.toLowerCase().replace(/\s+/g, '');
      
      // Open modal with project data
      openModal(projectTitle);
    });
  });
  
  // Close modal events
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});

function openModal(projectKey) {
  const project = projectData[projectKey];
  
  if (!project) {
    console.warn(`Project data not found for: ${projectKey}`);
    return;
  }
  
  // Update modal content
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  
  // Handle image or video display
  if (project.video) {
    // Show video, hide image
    modalVideo.src = project.video;
    modalVideo.style.display = 'block';
    modalImage.style.display = 'none';
  } else {
    // Show image, hide video
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
    modalVideo.src = ''; // Clear video source when not needed
  }
  
  // Update tech stacks
  modalTechStacks.innerHTML = '';
  project.techStacks.forEach(tech => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = tech;
    modalTechStacks.appendChild(tag);
  });
  
  // Update links
  modalLiveLink.href = project.liveLink;
  modalGithubLink.href = project.githubLink;
  
  // Show modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restore scrolling
  
  // Clear video source to stop playback
  modalVideo.src = '';
}

// Prevent modal from closing when clicking inside modal content
document.querySelector('.modal-content').addEventListener('click', function(e) {
  e.stopPropagation();
});
