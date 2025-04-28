import CopyRightsSection from "./CopyRightsSection";

const FooterSection: React.FC<{ lightBackground?: boolean }> = ({ lightBackground = true }) => {
  return (
    <footer className={`text-center text-lg-start ${lightBackground ? 'bg-light' : 'bg-dark text-white'} `}>
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h5 className="fw-bold">Tenmil</h5>
            <p className="text-muted">
              Precision-crafted maintenance management.
            </p>
          </div>

          <div className="col-lg-6 text-lg-end">
            <a href="#" className="text-decoration-none me-3 text-muted">
              Terms of Service
            </a>
            <a href="#" className="text-decoration-none text-muted">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      <CopyRightsSection/>
    </footer>
  );
};

export default FooterSection;