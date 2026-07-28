import React, { useState, useRef } from 'react';
import {
  X,
  Mail,
  Smartphone,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Folder,
  CheckCircle2,
  RefreshCw,
  User,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [method, setMethod] = useState<'gmail' | 'phone'>('gmail');

  // Flow steps: 1: Contact Input -> 2: OTP -> 3: Password & Name -> 4: Photo
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [gmail, setGmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sentOtp, setSentOtp] = useState<string>('1234');
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  // Password & User Info State
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Profile Photo State
  const [avatar, setAvatar] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Hidden File Input Refs for 3 Upload Methods
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'gmail' && (!gmail || !gmail.includes('@'))) {
      alert('Please enter a valid Gmail / Email address');
      return;
    }
    if (method === 'phone' && (!phone || phone.replace(/\D/g, '').length < 10)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Generate random 4-digit OTP for realistic demo
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generated);
    setStep(2);
    setTimer(30);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setIsResending(true);
    setTimeout(() => {
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtp(generated);
      setIsResending(false);
      setTimer(30);
      alert(`New OTP sent! Code: ${generated}`);
    }, 1000);
  };

  // Handle OTP digit change
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setOtpError('');

    // Auto-advance
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      setOtpError('Please enter complete 4-digit OTP');
      return;
    }
    if (entered !== sentOtp && entered !== '1234') {
      setOtpError(`Invalid OTP. Please use code ${sentOtp}`);
      return;
    }

    if (mode === 'login') {
      // If logging in existing user, create/load user
      const saved = localStorage.getItem('kaira_auth_user');
      let existingUser: AuthUser | null = saved ? JSON.parse(saved) : null;
      if (!existingUser || (method === 'gmail' && existingUser.email !== gmail)) {
        existingUser = {
          id: `USR-${Date.now()}`,
          name: name || (gmail ? gmail.split('@')[0] : 'KAIRA Customer'),
          email: method === 'gmail' ? gmail : undefined,
          phone: method === 'phone' ? phone : undefined,
          isLoggedIn: true,
          memberTier: 'KAIRA VIP Member',
          rewardPoints: 250,
          loginMethod: method,
        };
      } else {
        existingUser.isLoggedIn = true;
      }
      localStorage.setItem('kaira_auth_user', JSON.stringify(existingUser));
      onLoginSuccess(existingUser);
      onClose();
    } else {
      // Advance to Password & Name setup step
      setStep(3);
    }
  };

  // Generate strong password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = 'Kaira#';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setShowPassword(true);
    setPasswordError('');
  };

  // Step 3: Complete Password & Advance to Photo Step
  const handleSavePasswordAndDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setPasswordError('Please enter your full name');
      return;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    // Advance to photo upload step
    setStep(4);
  };

  // Photo Upload Handler (Files / Camera Roll / Storage)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // WebCam Live Capture Trigger
  const handleStartLiveCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      // Fallback to native camera input
      cameraInputRef.current?.click();
      setIsCameraActive(false);
    }
  };

  // Capture Photo from WebCam Stream
  const handleCaptureWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setAvatar(dataUrl);

        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  // Close WebCam
  const handleCloseWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  // Final Step 4: Finalize Profile Creation
  const handleFinalizeProfile = () => {
    const newUser: AuthUser = {
      id: `USR-${Date.now()}`,
      name: name.trim(),
      email: method === 'gmail' ? gmail.trim() : undefined,
      phone: method === 'phone' ? phone.trim() : undefined,
      avatar: avatar || undefined,
      memberTier: 'KAIRA Gold VIP Member',
      rewardPoints: 500, // Welcome Bonus
      isLoggedIn: true,
      loginMethod: method,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    localStorage.setItem('kaira_auth_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in">
      {/* Hidden File Inputs for Camera Roll, Camera, and Files */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E0D3B5] overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#2C241D] via-[#1A1510] to-[#2C241D] text-[#DFBA53] p-6 text-center relative border-b border-[#C59B27]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#3A3027] border border-[#C59B27]/60 flex items-center justify-center mx-auto mb-2 text-[#DFBA53] shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-xl text-white tracking-wide">
            {mode === 'signup' ? 'Create Your KAIRA Account' : 'Welcome Back to KAIRA'}
          </h2>
          <p className="text-xs text-amber-100/70 mt-1 font-light">
            {mode === 'signup'
              ? 'Unlock 500 VIP Reward Points & Instant Order Updates'
              : 'Sign in with your Gmail or Phone to access your orders'}
          </p>

          {/* Login / Sign Up Tabs */}
          <div className="flex bg-[#19130E] p-1 rounded-xl mt-4 border border-[#C59B27]/30 text-xs">
            <button
              onClick={() => {
                setMode('signup');
                setStep(1);
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-[#C59B27] text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setMode('login');
                setStep(1);
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                mode === 'login'
                  ? 'bg-[#C59B27] text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {/* Form Content Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: Enter Gmail or Phone */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Method Selector: Gmail vs Phone */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('gmail')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    method === 'gmail'
                      ? 'bg-[#F3EBDA] border-[#C59B27] text-stone-900 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Mail className="w-4 h-4 text-amber-800" />
                  Via Gmail
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    method === 'phone'
                      ? 'bg-[#F3EBDA] border-[#C59B27] text-stone-900 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-800" />
                  Via Phone Number
                </button>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                {method === 'gmail' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Gmail / Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. ananya@gmail.com"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Mobile Number (India +91) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-3 pr-4 py-2.5 bg-white border border-stone-300 rounded-r-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#2C241D] to-[#18130E] hover:from-[#3D3228] hover:to-[#241D16] text-[#DFBA53] font-bold text-xs rounded-xl shadow-md border border-[#C59B27]/40 flex items-center justify-center gap-2 transition-all"
                >
                  Receive OTP Code <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center space-y-1">
                <p className="text-xs text-amber-900 font-medium">
                  OTP sent to{' '}
                  <strong className="text-stone-900">
                    {method === 'gmail' ? gmail : `+91 ${phone}`}
                  </strong>
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-200/80 rounded-full text-[11px] font-bold text-amber-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Demo Test OTP:{' '}
                  <span className="underline tracking-widest">{sentOtp}</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-center text-xs font-semibold text-stone-800 mb-2">
                    Enter 4-Digit Security OTP
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-bold bg-white border-2 border-stone-300 rounded-xl focus:border-[#C59B27] focus:ring-0 focus:outline-none shadow-2xs text-stone-900"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-[11px] text-red-600 font-semibold text-center mt-2">
                      {otpError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-stone-800 underline"
                  >
                    Change {method === 'gmail' ? 'Gmail' : 'Phone'}
                  </button>
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={handleResendOtp}
                    className="text-[#8C6418] font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C59B27] hover:bg-[#B38A20] text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  Verify OTP <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Set Name & Generate Password */}
          {step === 3 && (
            <form onSubmit={handleSavePasswordAndDetails} className="space-y-4">
              <div className="text-center">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Set Your Name & Password
                </h3>
                <p className="text-[11px] text-stone-500">
                  Create a secure password to protect your profile & order history.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-800">
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-[#8C6418] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#C59B27]" /> Auto-Generate
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#2C241D] to-[#18130E] hover:from-[#3D3228] hover:to-[#241D16] text-[#DFBA53] font-bold text-xs rounded-xl shadow-md border border-[#C59B27]/40 flex items-center justify-center gap-2 transition-all"
              >
                Continue to Profile Photo <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 4: Profile Photo Upload (Camera Roll, Camera, Files) */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Add Your Profile Picture
                </h3>
                <p className="text-[11px] text-stone-500">
                  Upload a photo from your camera roll, take a new picture, or choose a file.
                </p>
              </div>

              {/* Avatar Preview */}
              <div className="relative w-24 h-24 mx-auto">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#C59B27] shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#2C241D] text-[#DFBA53] border-2 border-[#C59B27] flex items-center justify-center text-xl font-serif font-bold shadow-md">
                    {name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'K'}
                  </div>
                )}
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full text-[10px] shadow-sm hover:bg-red-700"
                    title="Remove Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* WebCam Live Camera View */}
              {isCameraActive && (
                <div className="bg-black p-3 rounded-2xl relative space-y-2">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-48 rounded-xl object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCaptureWebcam}
                      className="flex-1 py-1.5 bg-[#C59B27] text-stone-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseWebcam}
                      className="py-1.5 px-3 bg-stone-700 text-white font-bold text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 3 Upload Options */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Option 1: Camera Roll / Gallery */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-2xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <ImageIcon className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Camera Roll</span>
                </button>

                {/* Option 2: Live Camera */}
                <button
                  type="button"
                  onClick={handleStartLiveCamera}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-2xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <Camera className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Take Photo</span>
                </button>

                {/* Option 3: Files / Storage */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-2xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <Folder className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Device Files</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalizeProfile}
                  className="w-full py-3 bg-[#C59B27] hover:bg-[#B38A20] text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  Save Profile & Start Shopping <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeProfile}
                  className="mt-2 text-[11px] text-stone-500 hover:text-stone-800 underline block mx-auto"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
