import { motion } from "framer-motion";

const solutions = [
  {
    num: "01",
    title: "Family Expense System",
    description: "Track, categorize, and control spending across all members. Instantly see where the money goes.",
    code: "$ kutumbos finance --init\n> Tracking shared expenses... Active"
  },
  {
    num: "02",
    title: "Health Record Vault",
    description: "Upload and access medical documents instantly when needed. Organized by family member.",
    code: "$ kutumbos health --fetch\n> Loading prescriptions... Secure"
  },
  {
    num: "03",
    title: "Responsibility Engine",
    description: "Assign, track, and complete tasks without constant follow-ups and nagging.",
    code: "$ kutumbos tasks --assign\n> Delegating groceries... Done"
  },
  {
    num: "04",
    title: "Role-Based Access",
    description: "Every member sees what they need — nothing more, nothing less. Total privacy control.",
    code: "$ kutumbos acl --verify\n> Checking permissions... Valid"
  }
];

export function Solution() {
  return (
    <section className="py-24 lg:py-32 bg-navy-900 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-4">The New Standard</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
              KutumbOS Fixes This Structurally.
            </h3>
            <p className="text-xl text-white/70 font-medium mb-12">
              Not another chat app. A proper operating system for your household.
            </p>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-default"
                >
                  <div className="flex items-start gap-6">
                    <div className="text-3xl font-display font-bold text-amber-500/50 group-hover:text-amber-400 transition-colors">
                      {solution.num}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{solution.title}</h4>
                      <p className="text-white/60 leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-full min-h-[600px] rounded-3xl overflow-hidden glass-card hidden lg:flex flex-col border-white/10 shadow-2xl"
          >
            {/* Fake OS Header */}
            <div className="bg-black/40 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs font-mono text-white/40">kutumb_os_kernel</div>
            </div>
            
            {/* Terminal Interface */}
            <div className="flex-1 bg-navy-900/80 p-8 font-mono text-sm overflow-hidden flex flex-col gap-6">
              {solutions.map((sol, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.4) }}
                  className="text-green-400/90 whitespace-pre-wrap"
                >
                  <span className="text-amber-400">{sol.code.split('\n')[0]}</span>
                  <br/>
                  <span className="text-white/60">{sol.code.split('\n')[1]}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-4 flex items-center text-amber-400"
              >
                <span>$ </span>
                <span className="w-2 h-4 bg-amber-400 ml-2 animate-pulse"></span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
