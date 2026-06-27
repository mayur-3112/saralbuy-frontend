import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to SaralBuy V2!',
      description: 'Welcome to Karnataka\'s premier B2B bulk procurement console. Let us show you around your workspace to help you source and bid efficiently.',
      selector: null,
    },
    {
      title: 'Search by B2B Category',
      description: 'Prefix your product searches with dedicated B2B categories (like Building Materials or Switchgear) to instantly get filtered suggestions.',
      selector: 'nav select',
    },
    {
      title: 'Regional Location Filter',
      description: 'Enter your city or click the location pin icon to detect your regional coordinates. All sourcing queries will match suppliers in your city.',
      selector: 'nav input[placeholder="Location..."]',
    },
    {
      title: 'Live Exchange Feed',
      description: 'Keep track of real B2B trading volume and live transaction updates. The green pulse indicates the platform is actively facilitating deals.',
      selector: '.live-stats-ticker-container',
    },
    {
      title: 'B2B Procurement Workspace',
      description: 'Manage your active quotations, posted requirements, draft sourcing RFQs, and close deals securely here in your workspace board.',
      selector: '[data-tour="sourcing-workspace"]',
    },
    {
      title: 'Floating Discussions Chatbox',
      description: 'Discuss requirements and negotiate bidding budgets directly with buyers or sellers in real-time using this floating discussion widget.',
      selector: '.floating-discussions-chatbox',
    },
  ];

  useEffect(() => {
    const isCompleted = localStorage.getItem('SaralBuy_onboarded');
    if (!isCompleted) {
      setIsOpen(true);
    }

    const handleRetake = () => {
      localStorage.removeItem('SaralBuy_onboarded');
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener('trigger-onboarding-tour', handleRetake);
    return () => window.removeEventListener('trigger-onboarding-tour', handleRetake);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Highlight the targeted selector
      const nextSelector = steps[currentStep + 1]?.selector;
      highlightElement(nextSelector);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevSelector = steps[currentStep - 1]?.selector;
      highlightElement(prevSelector);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('SaralBuy_onboarded', 'true');
    setIsOpen(false);
    clearHighlight();
  };

  const highlightElement = (selector) => {
    clearHighlight();
    if (!selector) return;
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('tour-spotlight-highlight');
    }
  };

  const clearHighlight = () => {
    document.querySelectorAll('.tour-spotlight-highlight').forEach(el => {
      el.classList.remove('tour-spotlight-highlight');
    });
  };

  // Add styles dynamically
  useEffect(() => {
    const styleId = 'tour-spotlight-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .tour-spotlight-highlight {
          position: relative !important;
          z-index: 10000 !important;
          box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.65) !important;
          outline: 3px solid #ea580c !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none">
      {/* Background Dimmer when selector is null */}
      {!steps[currentStep].selector && (
        <div className="absolute inset-0 bg-slate-900/65 pointer-events-auto" />
      )}

      {/* Floating Tour Card */}
      <div className="relative pointer-events-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-w-sm m-4 space-y-4 animate-fade-in z-[10001]">
        <button 
          onClick={handleComplete}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
            Step {currentStep} of {steps.length - 1}
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-base font-black text-slate-900 leading-tight">
            {steps[currentStep].title}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {currentStep > 0 ? (
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="text-xs font-bold border-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
              Back
            </Button>
          ) : (
            <button 
              onClick={handleComplete}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
            >
              Skip Tour
            </button>
          )}

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
