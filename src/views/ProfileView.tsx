import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  Smartphone, 
  Zap, 
  Wifi, 
  BookOpen, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Home
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (route: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { profile, updateProfile, isDemoAccount, loadDemoAccount, resetToFreshAccount } = useLearner();
  const { user } = useAuth();

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [institution, setInstitution] = useState(profile.institution || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(profile.fieldOfStudy || '');
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel || 'University_Undergrad');
  const [studyContext, setStudyContext] = useState(profile.studyContext || 'Hostel Room');
  const [primaryDevice, setPrimaryDevice] = useState(profile.primaryDevice || 'Android Smartphone');
  const [internetReliability, setInternetReliability] = useState(profile.internetReliability || 'Intermittent 4G');
  const [electricityAccess, setElectricityAccess] = useState(profile.electricityAccess || '4-8 Hours / Day');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Synchronize form state when profile hydrations complete
  React.useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setInstitution(profile.institution || '');
    setFieldOfStudy(profile.fieldOfStudy || '');
    setEducationLevel(profile.educationLevel || 'University_Undergrad');
    if (profile.studyContext) setStudyContext(profile.studyContext);
    if (profile.primaryDevice) setPrimaryDevice(profile.primaryDevice);
    if (profile.internetReliability) setInternetReliability(profile.internetReliability);
    if (profile.electricityAccess) setElectricityAccess(profile.electricityAccess);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateProfile({
        name,
        email: user ? (user.email || profile.email) : email,
        institution,
        fieldOfStudy,
        educationLevel,
        studyContext,
        primaryDevice,
        internetReliability,
        electricityAccess,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('[ProfileView] Error saving profile:', err);
      setSaveError(err?.message || 'Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Learner System Parameters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            Learner Context & Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Your educational level and environmental study constraints calibrate how the AI engines scaffold tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoAccount ? (
            <button
              onClick={resetToFreshAccount}
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Reset to Blank Slate
            </button>
          ) : (
            <button
              onClick={loadDemoAccount}
              className="px-3 py-1.5 rounded-xl bg-[#EAF2FF] text-[#124BCE] text-xs font-bold hover:bg-[#124BCE] hover:text-white transition-colors cursor-pointer"
            >
              Load Ada's UNILAG Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1769FF]/15 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">Email Address</label>
              {user && (
                <span className="text-[10px] text-[#176FF5] font-semibold">Managed by Supabase Auth</span>
              )}
            </div>
            <input
              type="email"
              value={user ? (user.email || email) : email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                user 
                  ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                  : 'border-gray-300 text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. UNILAG, OAU, King's College"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A]"
            >
              <option value="Senior Secondary (SS1-SS3)">Senior Secondary (SS1-SS3)</option>
              <option value="Undergraduate (University/Polytechnic)">Undergraduate (University/Polytechnic)</option>
              <option value="Postgraduate / Master's">Postgraduate / Master's</option>
              <option value="Self-Directed / Professional">Self-Directed / Professional</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">Field of Study / Track</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Computer Science, Medicine, WAEC Science"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>
        </div>

        {/* Environmental & Technological Constraints (Dimension 6) */}
        <div className="p-5 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-4">
          <div className="flex items-center gap-2 text-[#124BCE]">
            <Home className="w-4 h-4" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#071A3A]">
              Physical & Technological Study Context (Dimension 6)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-gray-700">Study Location</label>
              <select
                value={studyContext}
                onChange={(e) => setStudyContext(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="Hostel Room (Shared)">Hostel Room (Shared)</option>
                <option value="Home Desk">Home Desk</option>
                <option value="Campus Library / Faculty Hall">Campus Library / Faculty Hall</option>
                <option value="Cybercafe / Shared Hub">Cybercafe / Shared Hub</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-700">Primary Device</label>
              <select
                value={primaryDevice}
                onChange={(e) => setPrimaryDevice(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="Android Smartphone">Android Smartphone</option>
                <option value="Laptop">Laptop / Desktop</option>
                <option value="Tablet">Tablet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-700">Internet Reliability</label>
              <select
                value={internetReliability}
                onChange={(e) => setInternetReliability(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="Intermittent Mobile Data">Intermittent Mobile Data</option>
                <option value="Reliable Wi-Fi / Broadband">Reliable Wi-Fi / Broadband</option>
                <option value="Offline / Zero-Data Priority">Offline / Zero-Data Priority</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-700">Power / Grid Access</label>
              <select
                value={electricityAccess}
                onChange={(e) => setElectricityAccess(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="Intermittent Grid (4-8 hrs)">Intermittent Grid (4-8 hrs)</option>
                <option value="Generator Scheduled Hours">Generator Scheduled Hours</option>
                <option value="Solar Inverter / Constant">Solar Inverter / Constant</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {saveError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {saveError}
            </div>
          )}

          <div className="flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Parameters Updated Successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#124BCE] hover:bg-[#1769FF] cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Parameters'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
