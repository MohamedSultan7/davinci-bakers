import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OtpForm = z.infer<typeof otpSchema>;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, verifyOtp, sendOtp } = useAuthStore();
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch('otp');

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otpValue && otpValue.length === 6 && !errors.otp) {
      handleSubmit(onSubmit)();
    }
  }, [otpValue, errors.otp, handleSubmit]);

  const onSubmit = async (data: OtpForm) => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No email found. Please register again.',
        variant: 'destructive',
      });
      navigate('/register');
      return;
    }

    try {
      await verifyOtp(user.email, data.otp);
      
      toast({
        title: 'Email verified successfully!',
        description: 'Your account is now active. Welcome to DaVinci Bakers!',
      });

      navigate('/catalog');
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResendOtp = async () => {
    if (!user?.email) return;

    try {
      setCanResend(false);
      setCountdown(60);
      
      await sendOtp(user.email);
      
      toast({
        title: 'OTP sent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send OTP',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
      setCanResend(true);
      setCountdown(0);
    }
  };

  // Redirect if no user
  if (!user) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to
              <br />
              <strong className="text-foreground">{user.email}</strong>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  className={`text-center text-2xl font-mono tracking-wider ${
                    errors.otp ? 'border-destructive' : ''
                  }`}
                  {...register('otp')}
                  autoComplete="one-time-code"
                />
                {errors.otp && (
                  <p className="text-sm text-destructive text-center">{errors.otp.message}</p>
                )}
              </div>

              {/* Demo hint */}
              <div className="p-3 bg-muted/50 rounded-lg text-center text-sm">
                <p className="font-medium text-foreground mb-1">Demo Code:</p>
                <p className="text-muted-foreground font-mono text-lg">123456</p>
              </div>

              {/* Resend OTP */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="text-primary"
                >
                  {!canResend ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend in {countdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !otpValue || otpValue.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                <p>Need help? Contact support at (555) 123-BREAD</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;