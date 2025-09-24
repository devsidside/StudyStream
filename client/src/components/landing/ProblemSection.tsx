export default function ProblemSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">The Student Struggle is Real</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Students spend countless hours searching for resources, quality accommodations, and reliable services. We're here to change that.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-destructive mb-2" data-testid="text-hours-wasted">6+ Hours</h3>
            <p className="text-lg font-semibold mb-2">Wasted Weekly</p>
            <p className="text-muted-foreground">Students spend hours searching for notes, accommodation, and campus services</p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-secondary mb-2" data-testid="text-higher-costs">40%</h3>
            <p className="text-lg font-semibold mb-2">Higher Costs</p>
            <p className="text-muted-foreground">Without proper information, students often pay more for subpar services</p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-accent mb-2" data-testid="text-isolated">Isolated</h3>
            <p className="text-lg font-semibold mb-2">Communities</p>
            <p className="text-muted-foreground">Lack of proper platforms for academic collaboration and peer support</p>
          </div>
        </div>
      </div>
    </section>
  );
}