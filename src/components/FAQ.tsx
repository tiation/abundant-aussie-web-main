
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "$19 trillion is tied up in houses and super—how can you liquidate it?",
      answer: "We only need leverage on approximately 30% of national equity to float a Sovereign Equity Fund that issues digital shares redeemable for the UBI stream—nobody has to sell their house. The system uses existing assets as collateral rather than requiring their sale."
    },
    {
      question: "Wouldn't this cause hyper-inflation?",
      answer: "Payments are metered weekly and asset-backed; the Reserve Bank adjusts liquidity just like it did with pandemic stimulus but against a real-asset book, not new debt. The distribution is carefully balanced to prevent inflationary pressure while maximizing economic activity."
    },
    {
      question: "Won't handouts kill work ethic?",
      answer: "UBI pilots in Finland, Stockton, and other locations show labor participation holds steady; people leave bad jobs, not all jobs. With basic needs met, entrepreneurship actually rises as people can take risks to start businesses and pursue innovation."
    },
    {
      question: "Crime isn't only about money—will this really reduce crime?",
      answer: "True—so the package couples income with mandatory connection infrastructure (Men's groups, youth studios, peer-co-ops). Money removes the economic motivation; community rebuilding addresses the social factors of crime."
    },
    {
      question: "How do we ensure the wealthy don't capture all the benefits?",
      answer: "The Digital Civic Shares are non-transferable and distributed equally per citizen. The system is designed with progressive elements to ensure the greatest proportional benefit goes to those with the least current assets."
    },
    {
      question: "Is this actually legally and politically feasible?",
      answer: "Yes. The legal mechanisms build on existing structures like sovereign wealth funds and government bonds. Politically, the universal nature of the benefits creates broad constituency support across traditional political divides."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Addressing common concerns about the $19 Trillion Solution
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-lg">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-left text-lg font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
