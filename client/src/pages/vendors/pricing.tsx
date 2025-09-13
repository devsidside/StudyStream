import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

export default function PricingPlans() {
  const plans = [
    {
      name: "Basic",
      icon: Star,
      price: "Free",
      period: "forever",
      description: "Perfect for getting started with your first service listing",
      features: [
        "1 active service listing",
        "Basic profile page",
        "Student contact information", 
        "Basic analytics",
        "Community support"
      ],
      limitations: [
        "Limited to 1 listing",
        "Basic customer support",
        "Standard listing placement"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      icon: Zap,
      price: "$29",
      period: "month",
      description: "Ideal for active vendors with multiple services",
      features: [
        "Up to 5 active service listings",
        "Enhanced profile customization",
        "Priority listing placement",
        "Advanced analytics & insights",
        "Customer review management",
        "Email support",
        "Featured listing badge"
      ],
      limitations: [],
      buttonText: "Start Professional",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "$99",
      period: "month", 
      description: "Comprehensive solution for established businesses",
      features: [
        "Unlimited service listings",
        "Custom branding options",
        "Top placement in search results",
        "Comprehensive analytics dashboard",
        "Lead generation tools",
        "Dedicated account manager",
        "Custom integration support",
        "White-label options",
        "24/7 priority support"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
    },
    {
      question: "What happens if I exceed my listing limit?",
      answer: "You'll be notified when approaching your limit. Additional listings require upgrading to a higher plan."
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer: "Yes, we offer 2 months free when you pay annually. Contact our sales team for custom pricing for enterprise customers."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. You only pay the monthly subscription fee."
    },
    {
      question: "What kind of support do you provide?",
      answer: "Basic plans include community support, Professional includes email support, and Enterprise includes dedicated account management."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="heading-pricing">
              Pricing Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. Start free and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2" data-testid="badge-popular">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <plan.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl" data-testid={`text-plan-name-${index}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-foreground" data-testid={`text-plan-price-${index}`}>
                    {plan.price}
                    {plan.price !== "Free" && (
                      <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2" data-testid={`text-plan-description-${index}`}>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    className="w-full mb-6" 
                    variant={plan.buttonVariant}
                    data-testid={`button-plan-${index}`}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2" data-testid={`feature-${index}-${featureIndex}`}>
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Limitations:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-sm text-muted-foreground" data-testid={`limitation-${index}-${limitIndex}`}>
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="heading-comparison">
              Feature Comparison
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-foreground">Feature</th>
                        <th className="text-center p-4 font-medium text-foreground">Basic</th>
                        <th className="text-center p-4 font-medium text-foreground">Professional</th>
                        <th className="text-center p-4 font-medium text-foreground">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Active Listings</td>
                        <td className="text-center p-4">1</td>
                        <td className="text-center p-4">5</td>
                        <td className="text-center p-4">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Analytics</td>
                        <td className="text-center p-4">Basic</td>
                        <td className="text-center p-4">Advanced</td>
                        <td className="text-center p-4">Comprehensive</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Support</td>
                        <td className="text-center p-4">Community</td>
                        <td className="text-center p-4">Email</td>
                        <td className="text-center p-4">24/7 Priority</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Custom Branding</td>
                        <td className="text-center p-4">❌</td>
                        <td className="text-center p-4">❌</td>
                        <td className="text-center p-4">✅</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Dedicated Account Manager</td>
                        <td className="text-center p-4">❌</td>
                        <td className="text-center p-4">❌</td>
                        <td className="text-center p-4">✅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="heading-faq">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} data-testid={`card-faq-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg" data-testid={`text-faq-question-${index}`}>
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid={`text-faq-answer-${index}`}>
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-muted/30 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="heading-cta">
              Ready to grow your business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of vendors already connecting with students on our platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" data-testid="button-start-free">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" data-testid="button-contact-sales">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}