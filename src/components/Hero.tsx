"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React, { useState }from "react";
import { SignUp } from '@stackframe/stack';

const Hero = () => {
  const [showSignup, setShowSignup] = useState(false);

  const handleShowSignup = () => setShowSignup(true);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto flex flex-col items-center px-6 py-12">

        <h1 className="text-center text-4xl md:text-5xl font-bold leading-tight">
          🚀 Your money, under control. <br />
          Your future, on track.
        </h1>

        <div className="mt-6 max-w-3xl w-full text-left text-lg leading-relaxed ml-auto mr-[5%] pr-8">
          <p>
            🧠 Turn financial chaos into clarity. <br />
            💰 Save with purpose. Reach your goals step by step. <br />
            ✍️ Track every move. Understand where your money goes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShowSignup}
          className="mt-12 w-3/4 max-w-[1000px] rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Sign up"
        >
          <img
            src="/hero-image.jpeg"
            alt="Hero"
            className="w-full h-auto rounded-xl"
            draggable={false}
          />
        </button>

        <div className="mt-12 flex items-center gap-4 justify-center">
          <Button 
            size="lg" 
            className="rounded-full text-base"
            onClick={handleShowSignup}
          >
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </Button>
        </div>
      </div>
      {showSignup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-black rounded-2xl w-full max-w-xl px-20 py-10 shadow-2xl relative">
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
            onClick={() => setShowSignup(false)}
          >
            ✕
          </button>
          <SignUp />
        </div>
      </div>
      )}
    </div>
  );
};

export default Hero;

