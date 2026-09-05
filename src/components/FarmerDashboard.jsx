import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { districtsAndTalukas } from '../data/mockData';
import { Sprout, PlusCircle, Layers, TrendingUp, MapPin, DollarSign, Image, Mic, ShieldAlert, CheckCircle2, Lock, Eye, AlertCircle, Phone, Building2, Calendar, FileText, ChevronRight, Sparkles, UserCheck, ShieldCheck, RefreshCw, XCircle, Landmark, Award, AlertTriangle, Check, X } from 'lucide-react';

export const FarmerDashboard = ({ initialTab }) => {
  const { currentUser, crops, bids, addCrop, acceptBid, cancelDeal, openCancellationModal, cancellationRequests, mandiPrices, t, farmerProfile, updateFarmerProfile, verifyFarmerLand } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab || 'MY_LISTINGS'); // 'MY_LISTINGS' | 'CREATE_LISTING' | 'FARMER_PROFILE'
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Confirmation Modal state for Accepting a Bid
  const [pendingAcceptBid, setPendingAcceptBid] = useState(null);

  // Crop Form State
  const [cropForm, setCropForm] = useState({
    name: 'Nashik Red Onion',
    variety: 'Garwa (Red Export Grade)',
    grade: 'Grade A',
    quantity: 100,
    expectedPrice: 2350,
    farmerLocation: 'Satana Village, Nashik District',
    farmerDistrict: 'Nashik',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
  });

  const [imagePreview, setImagePreview] = useState(cropForm.image);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Farmer Profile Form local state
  const [profileForm, setProfileForm] = useState({
    fullName: farmerProfile.fullName || 'Ramesh Maruti Patil',
    phone: farmerProfile.phone || '9822014321',
    bankAccount: farmerProfile.bankAccount || '918237465012',
    ifscCode: farmerProfile.ifscCode || 'SBIN0001234',
    district: farmerProfile.district || 'Nashik',
    taluka: farmerProfile.taluka || 'Satana (Baglan)',
    village: farmerProfile.village || 'Satana',
    gutNumber: farmerProfile.gutNumber || '74/2A'
  });

  const [isVerifyingLand, setIsVerifyingLand] = useState(false);

  const presetCrops = [
    { nameKey: 'crop1Name', varietyKey: 'crop1Variety', price: 2350, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop2Name', varietyKey: 'crop2Variety', price: 4750, image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop3Name', varietyKey: 'crop3Variety', price: 6800, image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop5Name', varietyKey: 'crop5Variety', price: 1850, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSelectPreset = (preset) => {
    setCropForm({
      ...cropForm,
      name: t[preset.nameKey] || preset.nameKey,
      variety: t[preset.varietyKey] || preset.varietyKey,
      expectedPrice: preset.price,
      image: preset.image
    });
    setImagePreview(preset.image);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setCropForm({ ...cropForm, image: url });
    }
  };

  const handleVoiceAssistantMock = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setCropForm({
        ...cropForm,
        name: t['crop2Name'] || 'Latur Yellow Soyabean',
        variety: t['crop2Variety'] || 'JS-335 Grade A',
        quantity: 150,
        expectedPrice: 4800,
        farmerLocation: t['locAusa'] || 'Latur District Farm'
      });
      setImagePreview('https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80');
    }, 1500);
  };

  const handleCropSubmit = (e) => {
    e.preventDefault();
    addCrop({
      ...cropForm,
      quantity: Number(cropForm.quantity),
      expectedPrice: Number(cropForm.expectedPrice)
    });
    setActiveTab('MY_LISTINGS');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateFarmerProfile(profileForm);
  };

  const handleMahaBhulekhVerification = () => {
    setIsVerifyingLand(true);
    setTimeout(() => {
      setIsVerifyingLand(false);
      verifyFarmerLand(profileForm);
    }, 1400);
  };

  const confirmAcceptBidAction = () => {
    if (!pendingAcceptBid) return;
    acceptBid(pendingAcceptBid.id);
    setPendingAcceptBid(null);
  };

  const farmerCrops = crops;
  const availableTalukas = districtsAndTalukas[profileForm.district] || ['Satana (Baglan)', 'Malegaon', 'Niphad'];

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      
      {/* Top Banner & Quick Stats */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                🌾 {t.farmerRoleLabel}
              </span>
              {farmerProfile.isLandVerified ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {t.landVerifiedBadge}
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {t.landPendingBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              {farmerProfile.fullName || currentUser?.name || 'Ramesh Patil'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
              Direct market linkages active. Instant counter-bids with zero middleman deductions.
            </p>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-lg gap-1">
            <button
              onClick={() => setActiveTab('MY_LISTINGS')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'MY_LISTINGS'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.myListings} ({farmerCrops.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('CREATE_LISTING')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'CREATE_LISTING'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.createListing}</span>
            </button>

            <button
              onClick={() => setActiveTab('FARMER_PROFILE')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'FARMER_PROFILE'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.farmerProfileTab}</span>
              {farmerProfile.isLandVerified && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Mandi Ticker Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar: Verification & Live APMC Market Rates Ticker */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Verification Status Card Banner */}
            <div className={`rounded-2xl p-5 border shadow-sm transition-all ${
              farmerProfile.isLandVerified
                ? 'bg-emerald-950/90 text-white border-emerald-500/60'
                : 'bg-amber-950/80 text-white border-amber-500/40'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  farmerProfile.isLandVerified ? 'bg-emerald-800/80 text-emerald-300' : 'bg-amber-800/80 text-amber-300'
                }`}>
                  {farmerProfile.isLandVerified ? <Award className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {farmerProfile.isLandVerified ? t.landVerifiedBadge : t.landPendingBadge}
                  </h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {farmerProfile.isLandVerified
                      ? '7/12 Land details authenticated via Maharashtra MahaBhulekh Portal. High trust badge assigned to crop listings.'
                      : 'Verify your 7/12 land records to display government verified seller status to corporate buyers.'}
                  </p>
                  {!farmerProfile.isLandVerified && (
                    <button
                      onClick={() => setActiveTab('FARMER_PROFILE')}
                      className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow transition-all"
                    >
                      {t.fetchVerifyLandBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Ticker Box */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <h3 className="font-bold text-slate-900 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-600" />
                    {t.liveMandi}
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                  MH APMC
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {mandiPrices.slice(0, 6).map((m) => {
                  const commodityTitle = t[m.commodityKey] || m.commodity;
                  return (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-100 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 text-xs">{commodityTitle}</span>
                          <span className="text-[10px] text-slate-500 font-medium">({m.mandi})</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Arrivals: {m.arrivals} Tonnes
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-sm block">
                          ₹{m.modalPrice.toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                            m.trend === 'UP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.trend === 'DOWN'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {m.trend === 'UP' ? '▲' : m.trend === 'DOWN' ? '▼' : '—'} {m.changePercent}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500">
                  Data aggregated from Maharashtra State Agricultural Marketing Board (MSAMB)
                </p>
              </div>
            </div>

          </div>

          {/* Main Area: Tabs View */}
          <div className="lg:col-span-8">
            
            {/* TAB 1: FARMER PROFILE & MAHABHULEKH LAND VERIFICATION */}
            {activeTab === 'FARMER_PROFILE' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
                
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-emerald-600" />
                      {t.farmerProfileTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct integration with Maharashtra Land Records System (MahaBhulekh 7/12)
                    </p>
                  </div>
                  {farmerProfile.isLandVerified ? (
                    <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center shadow">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {t.landVerifiedBadge}
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-full flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                      {t.landPendingBadge}
                    </span>
                  )}
                </div>

                {/* Verified Land Record Highlight Card */}
                {farmerProfile.isLandVerified && (
                  <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-500/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-6 h-6 text-amber-300" />
                        <span className="font-extrabold text-sm text-white uppercase tracking-wider">
                          MahaBhulekh Government Verified Land Record
                        </span>
                      </div>
                      <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                        7/12 AUTHENTICATED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                        <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                          Ownership Record
                        </span>
                        <p className="font-bold text-white text-sm">{t.ownerNameLabel}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{farmerProfile.fullName}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                        <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                          Authenticated Area
                        </span>
                        <p className="font-bold text-amber-300 text-sm">{t.landAreaLabel}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">Gut No: {farmerProfile.gutNumber || '74/2A'}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                        <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                          Crop Registration
                        </span>
                        <p className="font-bold text-white text-sm">{t.registeredCropLabel}</p>
                        <p className="text-[11px] text-emerald-400 mt-0.5">Kharif/Rabi Season</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Farmer Profile & Land Verification Form */}
                <form onSubmit={handleProfileSave} className="space-y-6">
                  
                  {/* Basic Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Personal & Financial Identification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.fullName}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.phoneNumber}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.bankAccount}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.bankAccount}
                          onChange={(e) => setProfileForm({ ...profileForm, bankAccount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                          placeholder="e.g. 918237465012"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.ifscCode}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.ifscCode}
                          onChange={(e) => setProfileForm({ ...profileForm, ifscCode: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                          placeholder="e.g. SBIN0001234"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dedicated MahaBhulekh 7/12 Land Integration Section */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                      <Landmark className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        {t.mahaBhulekhHeader}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.selectDistrict}
                        </label>
                        <select
                          value={profileForm.district}
                          onChange={(e) => {
                            const newDistrict = e.target.value;
                            const newTalukas = districtsAndTalukas[newDistrict] || [];
                            setProfileForm({
                              ...profileForm,
                              district: newDistrict,
                              taluka: newTalukas[0] || ''
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          {Object.keys(districtsAndTalukas).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.selectTaluka}
                        </label>
                        <select
                          value={profileForm.taluka}
                          onChange={(e) => setProfileForm({ ...profileForm, taluka: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          {availableTalukas.map((talk) => (
                            <option key={talk} value={talk}>{talk}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.selectVillage}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.village}
                          onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                          placeholder="e.g. Satana"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {t.gutNumber}
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.gutNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, gutNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                          placeholder="e.g. 74/2A"
                        />
                      </div>
                    </div>

                    {/* Prominent Verification Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleMahaBhulekhVerification}
                        disabled={isVerifyingLand}
                        className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                          isVerifyingLand
                            ? 'bg-amber-600 text-white cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                        }`}
                      >
                        {isVerifyingLand ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{t.fetchingLand}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>{t.fetchVerifyLandBtn}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    {t.saveFarmerProfileBtn}
                  </button>

                </form>
              </div>
            )}

            {/* TAB 2: CREATE LISTING FORM */}
            {activeTab === 'CREATE_LISTING' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <PlusCircle className="w-5 h-5 mr-2 text-emerald-600" />
                      List Your Crop for Direct Bidding
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      No commissions. Direct corporate buyer counter-bids in Maharashtra.
                    </p>
                  </div>

                  {/* Rural Voice Input Mock */}
                  <button
                    type="button"
                    onClick={handleVoiceAssistantMock}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isVoiceListening
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isVoiceListening ? 'Listening...' : 'Rural Voice Fill'}</span>
                  </button>
                </div>

                {/* Quick Presets for Rural Ease */}
                <div className="mb-6">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Crop Presets
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {presetCrops.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 text-left bg-slate-50 hover:bg-emerald-50/50 transition-all text-xs"
                      >
                        <span className="font-bold text-slate-900 block truncate">{t[p.nameKey] || p.nameKey}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">₹{p.price}/Qtl</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCropSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Crop Name & Variety
                      </label>
                      <input
                        type="text"
                        value={cropForm.name}
                        onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. Nashik Red Onion"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Variety / Quality Grade
                      </label>
                      <input
                        type="text"
                        value={cropForm.variety}
                        onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. Garwa Grade A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Available Quantity (Quintals)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={cropForm.quantity}
                        onChange={(e) => setCropForm({ ...cropForm, quantity: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. 150"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Minimum Expected Price (₹/Quintal)
                      </label>
                      <input
                        type="number"
                        min={100}
                        value={cropForm.expectedPrice}
                        onChange={(e) => setCropForm({ ...cropForm, expectedPrice: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. 2400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Farm Pickup Address & District
                    </label>
                    <input
                      type="text"
                      value={cropForm.farmerLocation}
                      onChange={(e) => setCropForm({ ...cropForm, farmerLocation: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Satana Village, Nashik District, Maharashtra"
                    />
                  </div>

                  {/* Dummy Image Upload Box Placeholder */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Crop Image Placeholder
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 transition-all flex flex-col items-center justify-center relative">
                      {imagePreview ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                            Preview Ready
                          </span>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Image className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                          <span className="text-xs text-slate-600 block">Click to upload crop photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <Sprout className="w-5 h-5" />
                    <span>Publish Crop Listing & Open Bidding</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: MY ACTIVE LISTINGS & INCOMING BIDS */}
            {activeTab === 'MY_LISTINGS' && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-emerald-600" />
                    {t.myListings}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Real-time state synchronized with Buyer Portal
                  </span>
                </div>

                {farmerCrops.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-700">No Crops Listed Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      List your harvested crops to start receiving direct counter-bids from corporate buyers.
                    </p>
                    <button
                      onClick={() => setActiveTab('CREATE_LISTING')}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow"
                    >
                      + Create First Listing
                    </button>
                  </div>
                ) : (
                  farmerCrops.map((crop) => {
                    const cropBids = bids.filter((b) => b.cropId === crop.id);
                    const acceptedBid = bids.find((b) => b.id === crop.acceptedBidId);
                    const isDealFinalized = crop.status === 'DEAL_FINALIZED' || crop.status === 'CANCEL_PENDING' || crop.status === 'DISPUTED' || crop.status === 'COLLUSION';
                    const isCancelPending = crop.status === 'CANCEL_PENDING';
                    const isDisputed = crop.status === 'DISPUTED';
                    const isCollusion = crop.status === 'COLLUSION';
                    const cropNameTitle = t[crop.nameKey] || crop.name;
                    const cropVarietyTitle = t[crop.varietyKey] || crop.variety;
                    const cropLocationTitle = t[crop.farmerLocationKey] || crop.farmerLocation;

                    return (
                      <div
                        key={crop.id}
                        className={`bg-white rounded-2xl overflow-hidden border transition-all ${
                          isDealFinalized
                            ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 shadow-sm'
                        }`}
                      >
                        {/* Crop Header */}
                        <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={crop.image}
                              alt={cropNameTitle}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-bold text-slate-900">{cropNameTitle}</h3>
                                <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {cropVarietyTitle}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                                <span>Quantity: <strong className="text-slate-800 font-bold">{crop.quantity} Qtl</strong></span>
                                <span>Min Price: <strong className="text-emerald-700 font-bold">₹{crop.expectedPrice}/Qtl</strong></span>
                                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-0.5" />{cropLocationTitle}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isCollusion ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold shadow-lg" style={{background:'linear-gradient(135deg,#dc2626,#991b1b)',color:'white',animation:'collusionFlash 0.5s ease-in-out infinite alternate'}}>
                                <ShieldAlert className="w-4 h-4" />
                                <span>🚨 Collusion Detected</span>
                              </span>
                            ) : isDisputed ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 border-2 border-red-400 rounded-full text-xs font-extrabold">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{t.disputeBadge || 'Disputed — APMC Arbitrator'}</span>
                              </span>
                            ) : isCancelPending ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full text-xs font-extrabold animate-pulse">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{t.cancelPendingBadge || 'Cancellation Pending Approval'}</span>
                              </span>
                            ) : isDealFinalized ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{t.bidAccepted}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold">
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                <span>Open for Bids ({cropBids.length} Received)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Incoming Bids & Fulfillment Section */}
                        <div className="p-5 sm:p-6 bg-white">
                          
                          {/* If Deal Finalized: Display Full Logistics Slip */}
                          {isDealFinalized && acceptedBid && (
                            <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4">
                              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                                  <FileText className="w-5 h-5 text-emerald-700" />
                                  <span>Official Fulfillment & Logistics Slip</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-semibold">
                                    Escrow Funds Secured 🔒
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                
                                {/* Farmer Info */}
                                <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                                  <span className="font-semibold text-slate-400 block uppercase text-[10px] mb-1">
                                    Seller (Farmer Details)
                                  </span>
                                  <p className="font-bold text-slate-900 text-sm">{crop.farmerName}</p>
                                  <p className="text-slate-600 flex items-center mt-1">
                                    <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                    {crop.farmerPhone}
                                  </p>
                                  <p className="text-slate-600 flex items-center mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                    {cropLocationTitle}
                                  </p>
                                </div>

                                {/* Buyer Info Unlocked */}
                                <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                                  <span className="font-semibold text-emerald-700 block uppercase text-[10px] mb-1 flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Buyer Details (Now Unlocked)
                                  </span>
                                  <p className="font-bold text-slate-900 text-sm">{acceptedBid.buyerName}</p>
                                  <p className="text-slate-700 font-semibold flex items-center mt-1">
                                    <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                    {acceptedBid.buyerPhone} ({acceptedBid.buyerContactName})
                                  </p>
                                  <p className="text-slate-600 flex items-start mt-0.5">
                                    <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{acceptedBid.buyerAddress}</span>
                                  </p>
                                </div>

                              </div>

                              {/* Deal Financial Summary & Cancel Deal Action */}
                              <div className="bg-emerald-900 text-white rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div>
                                  <span className="text-xs text-emerald-200">Agreed Rate:</span>
                                  <span className="font-extrabold text-lg text-white ml-2">₹{acceptedBid.bidPrice}/Qtl</span>
                                  <span className="text-xs text-emerald-300 ml-2">({crop.quantity} Qtl)</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <div className="text-right">
                                    <span className="text-[10px] text-emerald-200 block uppercase font-semibold">Total Value:</span>
                                    <span className="font-black text-lg text-amber-300">
                                      ₹{(acceptedBid.bidPrice * crop.quantity).toLocaleString('en-IN')}
                                    </span>
                                    {/* Cancel Transaction Button */}
                                    <button
                                      onClick={() => openCancellationModal(crop.id, acceptedBid.id)}
                                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-xs rounded-xl border border-rose-400/40 shadow-lg transition-all flex items-center space-x-1.5 hover:shadow-xl"
                                    >
                                      <ShieldAlert className="w-4 h-4" />
                                      <span>{t.cancelTransactionBtn || 'Cancel Transaction'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* If Bids Pending: Show Bids List */}
                          {!isDealFinalized && (
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                                Incoming Buyer Bids ({cropBids.length})
                              </h4>

                              {cropBids.length === 0 ? (
                                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                                  No counter-bids placed yet. Crops are displayed live in Buyer Marketplace.
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {cropBids.map((bid) => (
                                    <div
                                      key={bid.id}
                                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-emerald-400 transition-all"
                                    >
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-black text-emerald-800 text-lg">
                                            ₹{bid.bidPrice.toLocaleString('en-IN')}/Qtl
                                          </span>
                                          <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                                            Destination: {bid.buyerCity}
                                          </span>
                                        </div>

                                        {/* Phone & Corporate Details Privacy Mask */}
                                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                                          <span className="flex items-center text-slate-400">
                                            <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                            {t.buyerDetailsHidden}
                                          </span>
                                          <span>•</span>
                                          <span className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            Pickup: {bid.pickupDate}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Accept Bid Button -> Triggers Confirmation Modal */}
                                      <button
                                        onClick={() => setPendingAcceptBid(bid)}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{t.acceptBid}</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })
                )}

              </div>
            )}

          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL: ACCEPT BID */}
      {pendingAcceptBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-2 border-emerald-500 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.confirmAcceptBidTitle}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  MahaAgri Escrow System Protection
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {t.confirmAcceptBidMsg?.replace('{price}', pendingAcceptBid.bidPrice.toLocaleString('en-IN')) || 
                `Do you want to accept this bid of ₹${pendingAcceptBid.bidPrice}/Qtl from ${pendingAcceptBid.buyerName}?`}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setPendingAcceptBid(null)}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {t.confirmNo}
              </button>

              <button
                onClick={confirmAcceptBidAction}
                className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>{t.confirmYes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
