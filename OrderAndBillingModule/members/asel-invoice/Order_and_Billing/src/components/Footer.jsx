import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Omak Computers. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
