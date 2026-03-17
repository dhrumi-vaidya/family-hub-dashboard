import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Check, ChevronRight, ArrowRight, Loader2, CheckCircle2, MessageSquare, StickyNote, Brain, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export interface OnboardingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ isOpen, onOpenChange }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 2 State
  const [expenses, setExpenses] = useState<{ id: number; amount: string; category: string }[]>([]);
  const [expenseAmount, setExpenseAmount] = useState("500");
  const [expenseCategory, setExpenseCategory] = useState("Food");

  // Step 3 State
  const [tasks, setTasks] = useState<{ id: number; name: string; assignee: string; isNew: boolean }[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("Dad");

  // Step 4 State
  const [successData, setSuccessData] = useState<{ position: number } | null>(null);

  const { mutate: joinWaitlist, isPending } = useJoinWaitlist({
    mutation: {
      onSuccess: (data) => {
        setSuccessData({ position: data.position });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.error || "Something went wrong. Please try again.";
        setError("root", { message });
      }
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    joinWaitlist({ data: { name: data.name, email: data.email } });
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setExpenses([]);
        setExpenseAmount("500");
        setExpenseCategory("Food");
        setTasks([]);
        setTaskName("");
        setTaskAssignee("Dad");
        setSuccessData(null);
        reset();
      }, 500);
    }
  }, [isOpen, reset]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAddExpense = () => {
    if (!expenseAmount) return;
    setExpenses([...expenses, { id: Date.now(), amount: expenseAmount, category: expenseCategory }]);
    setExpenseAmount("");
  };

  const handleAddTask = () => {
    if (!taskName) return;
    const newTask = { id: Date.now(), name: taskName, assignee: taskAssignee, isNew: true };
    setTasks([...tasks, newTask]);
    setTaskName("");
    
    setTimeout(() => {
      setTasks(current => 
        current.map(t => t.id === newTask.id ? { ...t, isNew: false } : t)
      );
    }, 1000);
  };

  if (!isOpen) return null;

  const contentVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => onOpenChange(false)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-lg bg-[#0a0f1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        {/* Progress Bar */}
        {!successData && (
          <div className="w-full bg-white/5 h-1.5 absolute top-0 left-0">
            <div 
              className="h-full bg-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          {!successData && (
            <div className="mb-8">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
            </div>
          )}

          <div className="flex-1 relative min-h-[360px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-4">
                      Let's set up your family space
                    </h2>
                    <p className="text-white/70 text-lg">
                      Right now, your family probably manages things in:
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                      <span className="text-sm font-medium text-white/80">Chats</span>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
                      <StickyNote className="w-8 h-8 text-yellow-400" />
                      <span className="text-sm font-medium text-white/80">Notes</span>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
                      <Brain className="w-8 h-8 text-purple-400" />
                      <span className="text-sm font-medium text-white/80">Memory</span>
                    </div>
                  </div>

                  <div className="flex justify-center text-white/40">
                    <ArrowDown className="w-6 h-6" />
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/50 rounded-2xl p-5 flex items-center justify-center gap-3 glow-amber relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 animate-[shimmer_2s_infinite]" />
                    <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    <span className="text-lg font-bold text-amber-500">One organized place</span>
                  </div>

                  <p className="text-center text-sm text-white/50 italic">
                    KutumbOS replaces all three.
                  </p>

                  <Button 
                    onClick={() => setStep(2)}
                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl border-0 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform"
                  >
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                      Try how it works
                    </h2>
                    <p className="text-white/70">Let's track a quick expense.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <label className="text-sm font-medium text-white/80">Add an expense:</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">₹</span>
                        <input 
                          type="number"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-8 pr-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all"
                          placeholder="Amount"
                        />
                      </div>
                      <select 
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all [&>option]:bg-[#0a0f1e]"
                      >
                        <option value="Food">Food</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Transport">Transport</option>
                        <option value="Bills">Bills</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleAddExpense}
                      className="w-full h-12 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl font-semibold transition-all active:scale-[0.98]"
                    >
                      Add Expense
                    </Button>
                  </div>

                  <div className="min-h-[100px] space-y-2">
                    <AnimatePresence>
                      {expenses.map((expense) => (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <span className="text-white font-medium">₹{expense.amount} <span className="text-white/50 font-normal ml-2">• {expense.category}</span></span>
                          <Check className="w-5 h-5 text-green-400" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <p className="text-sm text-white/50 italic text-center">
                    Everyone adds what they spend. You see everything clearly.
                  </p>

                  <Button 
                    onClick={() => setStep(3)}
                    disabled={expenses.length === 0}
                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl border-0 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                  >
                    Next <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                      Keep important things safe
                    </h2>
                    <p className="text-white/70">Assign a task to someone.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Task name:</label>
                      <input 
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="e.g. Pay electricity bill"
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-white/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Assign to:</label>
                      <select 
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all [&>option]:bg-[#0a0f1e]"
                      >
                        <option value="Dad">Dad</option>
                        <option value="Mom">Mom</option>
                        <option value="Me">Me</option>
                        <option value="Sis">Sis</option>
                        <option value="Bro">Bro</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleAddTask}
                      className="w-full h-12 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl font-semibold transition-all active:scale-[0.98]"
                    >
                      Add Task
                    </Button>
                  </div>

                  <div className="min-h-[90px] space-y-2">
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <div>
                            <p className={`font-medium transition-colors duration-500 ${task.isNew ? 'text-green-400' : 'text-white'}`}>
                              {task.name}
                            </p>
                            <p className="text-sm text-white/50">Assigned to: {task.assignee}</p>
                          </div>
                          {!task.isNew && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle2 className="w-5 h-5 text-white/30" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <p className="text-sm text-white/50 italic text-center">
                    No more reminding. Assign once, track always.
                  </p>

                  <Button 
                    onClick={() => setStep(4)}
                    disabled={tasks.length === 0}
                    className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl border-0 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                  >
                    Next <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === 4 && !successData && (
                <motion.div
                  key="step4"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-display font-bold text-white">
                      Now make it real
                    </h2>
                    <p className="text-white/70">
                      This works best when your family is in one place.
                    </p>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center -space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-[#0a0f1e] flex items-center justify-center text-white font-bold text-lg z-30">Y</div>
                      <div className="w-12 h-12 rounded-full bg-purple-500 border-2 border-[#0a0f1e] flex items-center justify-center text-white font-bold text-lg z-20">?</div>
                      <div className="w-12 h-12 rounded-full bg-amber-500 border-2 border-[#0a0f1e] flex items-center justify-center text-white font-bold text-lg z-10">?</div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 text-sm text-white/60">
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> Save data</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400" /> Invite members</span>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <input
                        {...register("name")}
                        placeholder="Your name (e.g. Rahul)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-white/30"
                      />
                      {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-white/30"
                      />
                      {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="Create a password"
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder:text-white/30"
                      />
                      {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
                    </div>

                    {errors.root && (
                      <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center">
                        {errors.root.message}
                      </div>
                    )}

                    <Button 
                      type="submit"
                      disabled={isPending}
                      className="w-full h-14 mt-4 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl border-0 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isPending ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        "Create Family & Continue"
                      )}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <button type="button" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                        Already have an account? Login
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {successData && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-6 h-full justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-white">You're in! 🎉</h3>
                    <p className="text-lg text-white/70">
                      Check your email — we'll reach out soon.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl my-4">
                    <p className="text-sm text-white/60 mb-1">Your position in line</p>
                    <p className="text-4xl font-display font-bold text-amber-500">
                      #{successData.position.toLocaleString()}
                    </p>
                  </div>

                  <Button 
                    onClick={() => onOpenChange(false)}
                    className="w-full h-14 text-lg bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border-0 mt-4 transition-colors"
                  >
                    Got it
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
