const PendingAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Account Under Review
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your interest in our wholesale program. Your application 
          is currently being reviewed by our team.
        </p>
        
        <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-foreground mb-3">What happens next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Our team will review your business credentials
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We may contact you for additional information
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You'll receive an email when your account is approved
            </li>
          </ul>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Questions about your application?</p>
          <p>
            <strong>Email:</strong> wholesale@artisanbakery.com<br />
            <strong>Phone:</strong> (555) 123-BREAD
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingAccess;