import styles from "./styles.module.css";

export default function DummyPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>ACME Corp</div>
        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Welcome to Our Company</h1>
          <p>Delivering excellence in digital solutions since 2020</p>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🚀</div>
            <h3>Fast Performance</h3>
            <p>Lightning-fast load times and optimal user experience</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔒</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security to protect your data</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📱</div>
            <h3>Responsive</h3>
            <p>Perfect experience across all devices and screen sizes</p>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statItem}>
            <h2>500+</h2>
            <p>Happy Clients</p>
          </div>
          <div className={styles.statItem}>
            <h2>1000+</h2>
            <p>Projects Completed</p>
          </div>
          <div className={styles.statItem}>
            <h2>50+</h2>
            <p>Team Members</p>
          </div>
          <div className={styles.statItem}>
            <h2>99%</h2>
            <p>Customer Satisfaction</p>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.aboutContent}>
            <h2>About Our Company</h2>
            <p>
              We are a leading technology company specializing in web
              development, mobile applications, and cloud solutions. Our team of
              experienced professionals is dedicated to delivering innovative
              solutions that help businesses grow and succeed in the digital
              age.
            </p>
            <p>
              With over 5 years of experience in the industry, we have
              successfully completed hundreds of projects for clients ranging
              from startups to Fortune 500 companies. Our commitment to quality,
              innovation, and customer satisfaction sets us apart from the
              competition.
            </p>
          </div>
          <div className={styles.aboutImage}>
            <div className={styles.imagePlaceholder}>Team Photo</div>
          </div>
        </section>

        <section className={styles.services}>
          <h2>Our Services</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <h3>Web Development</h3>
              <ul>
                <li>Custom website design</li>
                <li>E-commerce solutions</li>
                <li>Content management systems</li>
                <li>Progressive web apps</li>
              </ul>
            </div>
            <div className={styles.serviceCard}>
              <h3>Mobile Apps</h3>
              <ul>
                <li>iOS app development</li>
                <li>Android app development</li>
                <li>Cross-platform solutions</li>
                <li>App maintenance & support</li>
              </ul>
            </div>
            <div className={styles.serviceCard}>
              <h3>Cloud Services</h3>
              <ul>
                <li>Cloud migration</li>
                <li>Infrastructure setup</li>
                <li>DevOps automation</li>
                <li>24/7 monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.contact}>
          <h2>Get In Touch</h2>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <strong>Email:</strong> contact@acmecorp.com
            </div>
            <div className={styles.contactItem}>
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
            <div className={styles.contactItem}>
              <strong>Address:</strong> 123 Business St, Tech City, TC 12345
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 ACME Corp. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
