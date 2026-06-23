import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';

// CountUp Component for stats animation on scroll
const CountUp = ({ end, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const stepTime = Math.abs(Math.floor((duration * 1000) / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// SkillBar Component for animating skill bars on scroll
const SkillBar = ({ name, value }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(value);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="progress" ref={ref}>
      <span className="skill">
        <span>{name}</span> <i className="val">{value}%</i>
      </span>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar"
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default function App() {
  // Mobile Nav Toggle State
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Active section state for Scrollspy
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll to Top Button State
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Portfolio Filter State
  const [activeFilter, setActiveFilter] = useState('*');

  // Lightbox Modal State
  const [lightboxImg, setLightboxImg] = useState(null);
  const [lightboxCaption, setLightboxCaption] = useState('');

  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });

  // Typed effect arrays
  const typedItems = ['Software Engineer', 'Fullstack Specialist', '.NET Developer', 'Ai-oriented programmer'];
  const [typedText, setTypedText] = useState('');
  const [itemIndex, setItemIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Initialize AOS (Animate on Scroll)
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  // Scrollspy & Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      // Toggle scroll to top button
      if (window.scrollY > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Scrollspy
      const sections = ['hero', 'about', 'resume', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text Typing Effect Hook
  useEffect(() => {
    let timer;
    const handleTyping = () => {
      const fullWord = typedItems[itemIndex];
      if (!isDeleting) {
        setTypedText(fullWord.substring(0, typedText.length + 1));
        if (typedText === fullWord) {
          setTypingSpeed(1500); // Hold word
          setIsDeleting(true);
        } else {
          setTypingSpeed(100);
        }
      } else {
        setTypedText(fullWord.substring(0, typedText.length - 1));
        if (typedText === '') {
          setIsDeleting(false);
          setItemIndex((prev) => (prev + 1) % typedItems.length);
          setTypingSpeed(500); // Pause before next word
        } else {
          setTypingSpeed(50);
        }
      }
    };
    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, itemIndex, typingSpeed]);

  // Projects list
  const projects = [
    {
      id: 1,
      title: 'FUNAAB Portal',
      description: 'Educational Portal - student & course modules',
      img: 'assets/img/portfolio/funaab.jpg',
      category: 'web',
      details: 'Developed backend and frontend modules for student registration, course management, and result processing at Federal University of Agriculture, Abeokuta (FUNAAB).',
    },
    {
      id: 2,
      title: 'Dayspring Chapel CMS',
      description: 'Church Management System with dynamic content CMS',
      img: 'assets/img/portfolio/CMS.jpg',
      category: 'web',
      details: 'Full-stack system featuring role management, appointment scheduling, event coordination, and real-time updates built using ASP.NET Core.',
    },
    {
      id: 3,
      title: 'EDARMS',
      description: 'Environmental Data & Revenue System',
      img: 'assets/img/portfolio/EDARM.png',
      category: 'api',
      details: 'Contributed to and led a 3-engineer team building a system for environmental data management, compliance tracking, and revenue collection.',
    },
    {
      id: 4,
      title: 'Ministry Website',
      description: 'Ogun State Ministry of Environment Site',
      img: 'assets/img/services.jpg',
      category: 'web',
      details: 'Developed a responsive and user-friendly public-facing website to improve information accessibility and stakeholder communication.',
    },
    {
      id: 5,
      title: 'Hymnal Mobile App',
      description: 'Cross-platform app built with React Native',
      img: 'assets/img/portfolio/Aicomp.jpg',
      category: 'mobile',
      details: 'Built a cross-platform mobile application featuring categorized hymn listings, real-time search, offline access, and a clean, worship-focused UI.',
    },
    {
      id: 6,
      title: 'Staff Record DMS',
      description: 'Staff & Document Management Service',
      img: 'assets/img/portfolio/document-management-system.jpg',
      category: 'api',
      details: 'Developed a secure platform for managing staff records and organizational documents, including role-based access control and structured storage.',
    },
    {
      id: 7,
      title: 'Hospital System',
      description: 'Frontend Hospital Management System',
      img: 'assets/img/portfolio/HMS.jpg',
      category: 'web',
      details: 'Implemented core UI components for patient records, appointment scheduling, and staff operations, ensuring intuitive user flow and usability.',
    },
    {
      id: 8,
      title: 'AiComp',
      description: 'AI-Integrated Mental Health Companion',
      img: 'assets/img/profile-img.jpg',
      category: 'web',
      details: 'Built an AI-powered mental health support tool that analyzes emotional expressions and behavioral trends to provide personalized insights.',
    },
    {
      id: 9,
      title: 'Blue Node Foundation',
      description: 'NGO foundation website — bluenodefoundation.org',
      img: 'assets/img/Bluenode.jpg',
      category: 'web',
      link: 'https://bluenodefoundation.org',
      details: 'Designed and developed the official website for Blue Node Foundation, an NGO, with AI assistance. Features clean, accessible design focused on the organisation\'s mission and outreach.',
    },
  ];

  // Filter project grid
  const filteredProjects =
    activeFilter === '*'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: false });
    
    // Simulating API submission
    setTimeout(() => {
      setFormStatus({ loading: false, success: true, error: false });
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileNavOpen(false);
    }
  };

  return (
    <div className="app-container">
      {/* Global Header */}
      <header
        id="header"
        className={`header d-flex flex-column justify-content-center ${
          isMobileNavOpen ? 'header-show' : ''
        }`}
      >
        {/* Mobile nav toggle button - inside header so CSS selector .header .header-toggle matches */}
        <i
          className={`header-toggle d-xl-none bi ${
            isMobileNavOpen ? 'bi-x' : 'bi-list'
          }`}
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        ></i>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <a
                href="#hero"
                className={activeSection === 'hero' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
              >
                <i className="bi bi-house navicon"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
              >
                <i className="bi bi-person navicon"></i>
                <span>About</span>
              </a>
            </li>
            <li>
              <a
                href="#resume"
                className={activeSection === 'resume' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('resume');
                }}
              >
                <i className="bi bi-file-earmark-text navicon"></i>
                <span>Resume</span>
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                className={activeSection === 'portfolio' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('portfolio');
                }}
              >
                <i className="bi bi-images navicon"></i>
                <span>Portfolio</span>
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                <i className="bi bi-envelope navicon"></i>
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {isMobileNavOpen && (
        <div className="nav-overlay" onClick={() => setIsMobileNavOpen(false)} />
      )}

      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero section">
          <div className="container" data-aos="zoom-out">
            <div className="row align-items-center align-items-lg-end">
              <div className="col-lg-6 text-center text-lg-start hero-text order-2 order-lg-1">
                <h2>Oluwatobi Gabriel Adelesi</h2>
                <p>
                  I'm a{' '}
                  <span className="typed">
                    {typedText}
                  </span>
                  <span className="typed-cursor" aria-hidden="true">|</span>
                </p>
                <div className="social-links mt-3">
                  <a href="https://github.com/Oluwatadel" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/oluwatobi-adelesi-a02063266" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="mailto:oluwatobiadelesi@gmail.com">
                    <i className="bi bi-envelope-fill"></i>
                  </a>
                </div>
                <div className="mt-4">
                  <a href="/cv.pdf" download="Adelesi_Oluwatobi_Gabriel_CV.pdf" className="hero-download-btn">
                    <i className="bi bi-download me-2"></i>Download CV
                  </a>
                </div>
              </div>
              <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-lg-end order-1 order-lg-2 mb-4 mb-lg-0">
                <img src="assets/img/DSC00151.png" alt="Adelesi Oluwatobi Gabriel" className="hero-portrait" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container section-title" data-aos="fade-up">
            <h2>About</h2>
            <p>
              Results-oriented Backend Software Engineer with hands-on experience designing and delivering
              scalable, secure, and production-ready systems using C# and ASP.NET Core. Proven track record of
              building APIs and enterprise applications for government, educational, and organizational
              environments. Strong foundation in clean architecture, RESTful API design, and collaborative
              development. Passionate about solving real-world problems through maintainable code and continuous
              learning.
            </p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4 justify-content-center">
              <div className="col-lg-4 text-center">
                <img
                  src="assets/img/ProPics.jpeg"
                  className="img-fluid"
                  alt="Profile picture"
                  style={{ maxWidth: '280px' }}
                />
              </div>
              <div className="col-lg-8 content">
                <h2>Backend Software Engineer (.NET / C#)</h2>
                <p className="fst-italic py-3">
                  Delivering performant APIs and robust software systems
                </p>
                <div className="row">
                  <div className="col-lg-6">
                    <ul>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Web Dev:</strong>{' '}
                        <span>C#, JavaScript, HTML, CSS, ASP.NET Core, MVC, EF Core, SQL</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Mobile Dev:</strong>{' '}
                        <span>AI assited ReactNative and Flutterwave</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Cloud Computing:</strong>{' '}
                        <span>Boto 3, Terraform, Docker and Kubernetes(in view)</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Environments:</strong>{' '}
                        <span>Visual Studio, VS Code, Git, Docker, Postman</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Databases:</strong>{' '}
                        <span>PostgreSQL, MySQL, MSSQL Server</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>City:</strong> <span>Abeokuta, Ogun State, Nigeria</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <ul>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Degree:</strong> <span>M.Sc. Biochemistry</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Certifications:</strong>{' '}
                        <span>ALX Africa SE, Code Learners Hub</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Email:</strong> <span>oluwatobiadelesi@gmail.com</span>
                      </li>
                      <li>
                        <i className="bi bi-chevron-right"></i>{' '}
                        <strong>Freelance:</strong> <span>Available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="stats section light-background">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4 text-center">
              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-center">
                <i className="bi bi-emoji-smile"></i>
                <div className="stats-item">
                  <CountUp end={8} />
                  <p>Completed Projects</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-center">
                <i className="bi bi-journal-richtext"></i>
                <div className="stats-item">
                  <CountUp end={2} />
                  <p>Production Deployments</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-center">
                <i className="bi bi-clock"></i>
                <div className="stats-item">
                  <CountUp end={3} />
                  <p>Years Experience</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-center">
                <i className="bi bi-award"></i>
                <div className="stats-item">
                  <CountUp end={2} />
                  <p>Professional Certifications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Skills</h2>
            <p>Core Technical Capabilities</p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row skills-content">
              <div className="col-lg-6">
                <SkillBar name="C# / .NET Core" value={90} />
                <SkillBar name="ASP.NET Core API / MVC" value={88} />
                <SkillBar name="Entity Framework Core" value={85} />
                <SkillBar name="PostgreSQL / MySQL" value={82} />
              </div>
              <div className="col-lg-6">
                <SkillBar name="Clean Architecture / DDD" value={80} />
                <SkillBar name="Git & Docker" value={78} />
                <SkillBar name="JavaScript / React" value={75} />
                <SkillBar name="HTML5 & CSS3" value={90} />
              </div>
            </div>

            <div className="row mt-5" data-aos="fade-up" data-aos-delay="200">
              <div className="col-12">
                <h5 className="soft-skills-title">Soft Skills</h5>
                <div className="soft-skills-tags">
                  {['Problem Solving', 'Team Collaboration', 'Adaptability & Continuous Learning', 'Clear Technical Communication'].map((skill) => (
                    <span key={skill} className="soft-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section id="resume" className="resume section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Resume</h2>
            <p>Professional Path & Background</p>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <h3 className="resume-title">Summary</h3>
                <div className="resume-item pb-0">
                  <h4>Adelesi Oluwatobi Gabriel</h4>
                  <p>
                    <em>
                      Results-oriented Backend Software Engineer with hands-on experience designing and delivering scalable, secure, and production-ready systems using C# and ASP.NET Core. Proven track record of building APIs and enterprise applications for government, educational, and organizational environments. Strong foundation in clean architecture, RESTful API design, and collaborative development. Passionate about solving real-world problems through maintainable code and continuous learning..
                    </em>
                  </p>
                  <ul>
                    <li>12, Alayo street, off Zents Fm, Fajol, Abeokuta, Nigeria</li>
                    <li>+234 810 865 2047</li>
                    <li>oluwatobiadelesi@gmail.com</li>
                  </ul>
                </div>

                <h3 className="resume-title">Education</h3>
                <div className="resume-item">
                  <h4>Master of Science (Biochemistry)</h4>
                  <h5>2021</h5>
                  <p>
                    <em>Olabisi Onabanjo University, Ago-Iwoye, Ogun State</em>
                  </p>
                </div>
                <div className="resume-item">
                  <h4>National Youth Service Corp (NYSC)</h4>
                  <h5>2014</h5>
                  <p>
                    <em>Nigeria</em>
                  </p>
                </div>

                <h3 className="resume-title">Certifications</h3>
                <div className="resume-item">
                  <h4>Software Engineering Certification</h4>
                  <h5>ALX Africa</h5>
                  <p>Comprehensive program covering system design, architectures, and full-stack software development.</p>
                </div>
                <div className="resume-item">
                  <h4>Software Engineering Certification</h4>
                  <h5>Code Learners Hub</h5>
                  <p>Practical, project-centric course focused on modern backend stacks and API design.</p>
                </div>
              </div>

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                <h3 className="resume-title">Professional Experience</h3>
                <div className="resume-item">
                  <h4>Software Engineer</h4>
                  <h5>May, 2024 - till date</h5>
                  <p>
                    <em>Sysbeam, Abeokuta</em>
                  </p>
                  <ul>
                    <li>Designed and implemented scalable backend APIs using C# and ASP.NET Core to support production enterprise systems.</li>
                    <li>Built secure, maintainable modules following clean architecture principles, improving system reliability and long-term maintainability.</li>
                    <li>Collaborated with frontend developers, product stakeholders, and QA teams to translate business requirements into technical solutions.</li>
                    <li>Optimized backend logic and database interactions, improving application performance and stability in live environments.</li>
                  </ul>
                  <h5 className="sub-title text-accent mt-2" style={{fontSize: '14px', background: 'transparent', padding: '0'}}>Key Achievements:</h5>
                  <ul>
                    <li>Delivered reusable backend components and internal documentation that improved team development efficiency and onboarding.</li>
                    <li>Refactored existing modules and resolved critical defects, reducing production issues and improving code quality.</li>
                  </ul>
                </div>

                <div className="resume-item">
                  <h4>Software Engineering Intern</h4>
                  <h5>Jun 2023 - Dec 2023</h5>
                  <p>
                    <em>Oacsoft Technologies</em>
                  </p>
                  <ul>
                    <li>Supported backend development using C#, ASP.NET Core, and SQL for scalable application components.</li>
                    <li>Assisted in frontend feature implementation and integration with backend services.</li>
                    <li>Participated in requirement analysis, feature development, and system optimization within a collaborative engineering team.</li>
                  </ul>
                  <h5 className="sub-title text-accent mt-2" style={{fontSize: '14px', background: 'transparent', padding: '0'}}>Key Contributions:</h5>
                  <ul>
                    <li>Improved backend components to enhance security and performance.</li>
                    <li>Contributed to code reviews and applied best practices to improve overall code quality.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="portfolio section light-background">
          <div className="container section-title" data-aos="fade-up">
            <h2>Portfolio</h2>
            <p>All projects developed</p>
          </div>

          <div className="container">
            {/* Filter buttons */}
            <ul className="portfolio-filters" data-aos="fade-up" data-aos-delay="100">
              <li
                className={activeFilter === '*' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('*')}
              >
                All
              </li>
              <li
                className={activeFilter === 'api' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('api')}
              >
                Backend APIs
              </li>
              <li
                className={activeFilter === 'web' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('web')}
              >
                Web Apps
              </li>
              <li
                className={activeFilter === 'mobile' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('mobile')}
              >
                Mobile Apps
              </li>
            </ul>

            {/* Project Grid */}
            <div className="row gy-4" data-aos="fade-up" data-aos-delay="200">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="col-lg-4 col-md-6"
                >
                  <div className="portfolio-item">
                    <img src={project.img} alt={project.title} />
                    <div className="portfolio-info">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <div className="links">
                        <button
                          className="preview-link"
                          title="Details"
                          onClick={() => {
                            setLightboxImg(project.img);
                            setLightboxCaption(`${project.title} - ${project.details}`);
                          }}
                        >
                          <i className="bi bi-zoom-in"></i>
                        </button>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="details-link"
                            title="Visit Site"
                          >
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Contact</h2>
            <p>For further enquiries</p>
          </div>

          <div className="container" data-aos="fade" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-4">
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                  <i className="bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3>Address</h3>
                    <p>16, Adeosun Obalawon Street, Fajol, Abeokuta, Nigeria</p>
                  </div>
                </div>

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                  <i className="bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3>Call Us</h3>
                    <p>+234 810 865 2047</p>
                  </div>
                </div>

                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                  <i className="bi bi-envelope flex-shrink-0"></i>
                  <div>
                    <h3>Email Us</h3>
                    <p>oluwatobiadelesi@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <form
                  onSubmit={handleFormSubmit}
                  className="react-email-form"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="row gy-4">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Your Email"
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <input
                        type="text"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Subject"
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="6"
                        placeholder="Message"
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12 text-center">
                      {formStatus.loading && <div className="loading">Sending...</div>}
                      {formStatus.error && <div className="error-message">Could not send your message. Please try again.</div>}
                      {formStatus.success && <div className="sent-message">Your message has been sent. Thank you!</div>}

                      <button type="submit" disabled={formStatus.loading}>
                        {formStatus.loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer id="footer" className="footer position-relative light-background">
        <div className="container">
          <h3 className="sitename">Adelesi Oluwatobi Gabriel</h3>
          <p>Building scalable, secure, and production-ready backend systems using .NET & C#.</p>
          <div className="social-links d-flex justify-content-center">
            <a href="https://github.com/Oluwatadel" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/oluwatobi-adelesi-a02063266 " target="_blank" rel="noopener noreferrer">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
          <div className="container">
            <div className="copyright">
              <span>Copyright</span> <strong className="px-1 sitename">Adelesi Oluwatobi Gabriel</strong> <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`scroll-top d-flex align-items-center justify-content-center ${
          showScrollTop ? 'active' : ''
        }`}
      >
        <i className="bi bi-arrow-up-short"></i>
      </button>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="custom-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="custom-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setLightboxImg(null)}>&times;</button>
            <img src={lightboxImg} alt="Lightbox view" />
            {lightboxCaption && <div className="caption">{lightboxCaption}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
