import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJoinWaitlist } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface WaitlistModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ isOpen, onOpenChange }: WaitlistModalProps) {
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
    joinWaitlist({ data });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        reset();
        setSuccessData(null);
      }, 300);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!successData ? (
          <>
            <DialogHeader>
              <DialogTitle>Start Your Family System</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Join the waitlist today. Get early access to KutumbOS and bring structure to your family.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Your Name (Optional)
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Sharma"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rahul@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {errors.root && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                  {errors.root.message}
                </div>
              )}

              <Button 
                type="submit" 
                variant="accent" 
                className="w-full text-lg h-14 mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-semibold text-primary">You're on the list!</h3>
              <p className="text-muted-foreground">
                Thank you for joining. We'll notify you as soon as KutumbOS is ready for your family.
              </p>
            </div>
            <div className="inline-block bg-secondary px-6 py-3 rounded-xl border border-border">
              <p className="text-sm font-medium text-primary">Your position in line</p>
              <p className="text-3xl font-display font-bold text-accent">#{successData.position.toLocaleString()}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
