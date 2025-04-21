
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const framesCommons = [
  {
    name: 'Classic Baseball (Community)',
    preview: '/placeholder.svg',
    creator: 'Community',
    price: 0,
    locked: false,
    description: "A vintage-style open frame perfect for all-star throwbacks and custom teams. Free to remix.",
  },
  {
    name: 'Pixel Art (Open)',
    preview: '/placeholder.svg',
    creator: 'PixArt Joe',
    price: 0,
    locked: false,
    description: "Minimal pixel frame, remix-friendly and open for all designers.",
  },
];

const framesLocked = [
  {
    name: 'Gold Signature (Official)',
    preview: '/placeholder.svg',
    creator: 'RookieCollectibles',
    price: 20,
    locked: true,
    description: "Official CRD Creator frame, gold foil, perfect for ultra-rares. Unlock with $20 or 50 CC.",
  },
  {
    name: 'Team Authentics (Monetized)',
    preview: '/placeholder.svg',
    creator: 'OGCardBase',
    price: 5,
    locked: true,
    description: "Licensed team-style frame supporting creator—purchase with 5 CC.",
  },
];

export default function Creators() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-12">
      <Card>
        <CardHeader>
          <CardTitle>CRD Frames Marketplace & Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-cardshow-lightGray mb-2">
            <strong>Welcome to the Frames Creator Hub</strong>: Power up your card collection with custom
            CRD Frames—modular, remixable, and built for Cardshow designers or collectors!
          </p>
          <ul className="list-disc ml-6 mt-2 text-cardshow-lightGray">
            <li>
              <span className="font-bold text-cardshow-green">Open Community Frames (Commons):</span> Remix, customize, or contribute your own free designs. Your creativity strengthens our open ecosystem!
            </li>
            <li>
              <span className="font-bold text-cardshow-orange">Official & Locked Frames:</span> Frames released by top creators—unlock, own, and even monetize; some are free with CRD Coins (CC), others are premium.
            </li>
            <li>
              <span className="font-bold text-cardshow-purple">Frame Monetization:</span> Creators can set prices or offer frames for free/CRD Coins, growing the community and their brand.
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <section>
        <h2 className="text-2xl font-raleway font-extrabold mb-4">Commons: Open Community Frames</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {framesCommons.map((frame) => (
            <Card key={frame.name}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src={frame.preview} alt={frame.name} className="w-12 h-16 object-cover rounded-md bg-cardshow-mediumGray"/>
                  <span className="font-bold text-cardshow-green">{frame.name}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{frame.description}</p>
                <span className="text-cardshow-lightGray text-xs">Creator: {frame.creator}</span>
                <span className="block text-cardshow-green font-bold mt-2">
                  {frame.price === 0 ? "Free" : `${frame.price} CC`}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-raleway font-extrabold mb-4">Locked & Official Frames</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {framesLocked.map((frame) => (
            <Card key={frame.name} className="relative">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src={frame.preview} alt={frame.name} className="w-12 h-16 object-cover rounded-md bg-cardshow-mediumGray"/>
                  <span className="font-bold text-cardshow-orange">{frame.name}</span>
                  {frame.locked && (
                    <span className="ml-2 text-yellow-400 font-bold text-sm">🔒 Locked</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{frame.description}</p>
                <span className="text-cardshow-lightGray text-xs">Creator: {frame.creator}</span>
                <span className="block text-cardshow-orange font-bold mt-2">
                  {frame.price > 0 ? `${frame.price} CC` : "Free"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Become a CRD Frame Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Want to build and share new Frames? Design with our editor, submit to the commons, or set your own price for premium frames. Unlock more by joining the creator program and get featured or monetize your designs!</p>
        </CardContent>
      </Card>
    </div>
  );
}
