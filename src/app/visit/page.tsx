import { MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-6">Plan a Visit</h1>
          <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto text-balance">
            We would love to host you this Sunday. Find the campus nearest to you and join us for an encounter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Great North Road Campus */}
          <div className="bg-zinc-900 border border-white/10 overflow-hidden flex flex-col">
            <div className="p-8 md:p-12 flex-1">
              <h2 className="text-3xl font-bold uppercase mb-2 text-ministry-accent">Great North Road Campus</h2>
              <p className="text-zinc-400 mb-8 font-light">Main Fellowship Center</p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-white tracking-wider text-sm mb-1">Service Times</h3>
                    <p className="text-zinc-300">Sunday Service: 09:00 AM - 11:30 AM</p>
                    <p className="text-zinc-300">Wednesday Midweek: 17:30 hrs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-white tracking-wider text-sm mb-1">Location</h3>
                    <p className="text-zinc-300">Great North Road</p>
                    <p className="text-zinc-300">Kabwe, Zambia</p>
                  </div>
                </div>
              </div>
              
              <a href="https://maps.google.com/maps?q=PH35%2B6Q5" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block bg-ministry-accent text-white font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-white hover:text-black transition-colors w-full text-center">
                Get Directions
              </a>
            </div>
            
            {/* Map Embed - Great North Road Plus Code: PH35+6Q5 */}
            <div className="w-full h-[300px] border-t border-white/10 relative bg-zinc-800">
              <iframe
                src="https://maps.google.com/maps?q=PH35%2B6Q5&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} // Dark mode trick for Maps iframes without API
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>

          {/* Town Campus (Kabwe) */}
          <div className="bg-zinc-900 border border-white/10 overflow-hidden flex flex-col">
            <div className="p-8 md:p-12 flex-1">
              <h2 className="text-3xl font-bold uppercase mb-2 text-ministry-accent">Town Campus</h2>
              <p className="text-zinc-400 mb-8 font-light">City Center Gatherings</p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-white tracking-wider text-sm mb-1">Service Times</h3>
                    <p className="text-zinc-300">Sunday Service: 08:00 AM - 10:00 AM</p>
                    <p className="text-zinc-300">Friday Prayer: 17:30 hrs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-white tracking-wider text-sm mb-1">Location</h3>
                    <p className="text-zinc-300">Town Center</p>
                    <p className="text-zinc-300">Kabwe, Zambia</p>
                  </div>
                </div>
              </div>

              <a href="https://maps.google.com/maps?q=HC2W%2BJ64%2C%20Kabwe" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block bg-ministry-accent text-white font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-white hover:text-black transition-colors w-full text-center">
                Get Directions
              </a>
            </div>
            
            {/* Map Embed - Town Campus Plus Code: HC2W+J64, Kabwe */}
            <div className="w-full h-[300px] border-t border-white/10 relative bg-zinc-800">
              <iframe
                src="https://maps.google.com/maps?q=HC2W%2BJ64%2C%20Kabwe&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>

        </div>

        {/* Contact Info Block */}
        <div className="mt-16 text-center border border-white/10 bg-zinc-900/50 p-8">
          <h3 className="text-xl font-bold uppercase mb-6">Need more information?</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-zinc-300">
            <div className="flex items-center space-x-2">
              <Phone size={20} className="text-ministry-accent" />
              <span>+260 (0) 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={20} className="text-ministry-accent" />
              <span>hello@blessedmissions.org</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
