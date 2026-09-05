import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, Filter, MapPin, DollarSign, Calendar, CheckCircle2, Clock, AlertTriangle, Building2, Phone, FileText, Send, X, ArrowUpRight, Sparkles, Layers, ShieldCheck, UserCheck, RefreshCw, XCircle, Award, CreditCard, Check, ShieldAlert } from 'lucide-react';

export const BuyerPortal = ({ initialTab }) => {
  const { currentUser, crops, bids, addBid, cancelDeal, openCancellationModal, cancellationRequests, t, buyerProfile, updateBuyerProfile, verifyBuyerCorporate } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab || 'MARKETPLACE'); // 'MARKETPLACE' | 'MY_BIDS' | 'BUYER_PROFILE'
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  // Modal / Sub-form state for Counter Bid
  const [bidModalCrop, setBidModalCrop] = useState(null);
  const [counterBidForm, setCounterBidForm] = useState({
    bidPrice: '',
    buyerAddress: buyerProfile.companyName + ' Warehouse, Sector 19, Vashi, Navi Mumbai, Maharashtra',
    buyerCity: 'Vashi, Navi Mumbai',
    pickupDate: '2026-09-10'
  });

  // Confirmation Modal state for Placing a Counter-Bid
  const [pendingPlaceBid, setPendingPlaceBid] = useState(null);

  // Buyer Profile local state
  const [corpForm, setCorpForm] = useState({
    companyName: buyerProfile.companyName || 'Mahavira Spices & Foods Pvt Ltd',
    repName: buyerProfile.repName || 'Vikram Shah',
    email: buyerProfile.email || 'procurement@mahaviraspices.com',
    panNumber: buyerProfile.panNumber || 'ABCDE1234F',
    gstinNumber: buyerProfile.gstinNumber || '27AAACM1234F1Z5',
    apmcLicense: buyerProfile.apmcLicense || 'APMC-MH-NSK-99214'
  });

  const [isVerifyingCorp, setIsVerifyingCorp] = useState(false);

  // Modal for Unlocked Farmer Details
  const [unlockedFarmerDetails, setUnlockedFarmerDetails] = useState(null);

  const openBidModal = (crop) => {
    setBidModalCrop(crop);
    setCounterBidForm({
      ...counterBidForm,
      bidPrice: crop.expectedPrice + 50
    });
  };

  const handleCounterBidSubmitClick = (e) => {
    e.preventDefault();
    if (!bidModalCrop) return;

    // Trigger Confirmation Modal before placing
    setPendingPlaceBid({
      crop: bidModalCrop,
      bidPrice: counterBidForm.bidPrice,
      buyerAddress: counterBidForm.buyerAddress,
      buyerCity: counterBidForm.buyerCity,
      pickupDate: counterBidForm.pickupDate
    });
  };

  const confirmPlaceBidAction = () => {
    if (!pendingPlaceBid) return;

    addBid({
      cropId: pendingPlaceBid.crop.id,
      bidPrice: pendingPlaceBid.bidPrice,
      buyerAddress: pendingPlaceBid.buyerAddress,
      buyerCity: pendingPlaceBid.buyerCity,
      pickupDate: pendingPlaceBid.pickupDate
    });

    setPendingPlaceBid(null);
    setBidModalCrop(null);
  };

  const handleCorpProfileSave = (e) => {
    e.preventDefault();
    updateBuyerProfile(corpForm);
  };

  const handleCorpIdentityVerify = () => {
    setIsVerifyingCorp(true);
    setTimeout(() => {
      setIsVerifyingCorp(false);
      verifyBuyerCorporate(corpForm);
    }, 1400);
  };

  // Filter crops
  const filteredCrops = crops.filter((crop) => {
    const cropName = t[crop.nameKey] || crop.name;
    const cropVariety = t[crop.varietyKey] || crop.variety;
    const cropCategory = t[crop.categoryKey] || crop.category;
    const cropLocation = t[crop.farmerLocationKey] || crop.farmerLocation;

    const matchesSearch =
      cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cropVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cropLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || crop.categoryKey === selectedCategory || crop.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'ALL' || crop.farmerDistrict === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const buyerBids = bids;

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      
      {/* B2B Procurement Header & Corporate Stats */}
      <div className="buyer-gradient text-white pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                🏢 {t.buyerRoleLabel}
              </span>
              {buyerProfile.isCorporateVerified ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {t.corporateVerifiedBadge}
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {t.corporatePendingBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              {buyerProfile.companyName || currentUser?.name || 'Mahavira Spices & Foods Pvt Ltd'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct farmer counter-bidding across Maharashtra mandis with logistics tracking.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Active Bids</span>
              <span className="text-lg font-bold text-amber-400">{buyerBids.length}</span>
            </div>
            <div className="text-center px-2 border-x border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Available Crops</span>
              <span className="text-lg font-bold text-emerald-400">{crops.length}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Saved Middleman Fee</span>
              <span className="text-lg font-bold text-blue-400">8.5%</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-2 border-b border-slate-700/60 pb-3">
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'MARKETPLACE'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.marketplace} ({filteredCrops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_BIDS')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'MY_BIDS'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.myBids} ({buyerBids.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BUYER_PROFILE')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'BUYER_PROFILE'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.buyerProfileTab}</span>
            {buyerProfile.isCorporateVerified && (
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* TAB 1: CORPORATE PROCUREMENT PROFILE & VERIFICATION */}
        {activeTab === 'BUYER_PROFILE' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-amber-600" />
                  {t.buyerProfileTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate your GSTIN and APMC License to unlock Government Verified B2B Procurement Partner status.
                </p>
              </div>

              {buyerProfile.isCorporateVerified ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center shadow-md border border-emerald-400">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-slate-950" />
                  {t.corporateVerifiedBadge}
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-full flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
                  {t.corporatePendingBadge}
                </span>
              )}
            </div>

            {/* Corporate Verified Highlight Banner */}
            {buyerProfile.isCorporateVerified && (
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border-2 border-emerald-500 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <span className="font-extrabold text-sm text-white uppercase tracking-wider">
                      Government Verified B2B Procurement Partner ✅
                    </span>
                  </div>
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full">
                    GSTIN & APMC AUTHENTICATED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-700/40">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Entity Name</span>
                    <p className="font-bold text-white text-sm">{buyerProfile.companyName}</p>
                    <p className="text-[11px] text-emerald-300 mt-0.5">Rep: {buyerProfile.repName}</p>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-700/40">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Tax Identity</span>
                    <p className="font-bold text-emerald-300 text-sm font-mono">{buyerProfile.gstinNumber}</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">PAN: {buyerProfile.panNumber}</p>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-700/40">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">APMC License</span>
                    <p className="font-bold text-white text-sm font-mono">{buyerProfile.apmcLicense}</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Maharashtra State Registry</p>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Form Fields */}
            <form onSubmit={handleCorpProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.companyName}
                  </label>
                  <input
                    type="text"
                    required
                    value={corpForm.companyName}
                    onChange={(e) => setCorpForm({ ...corpForm, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.repName}
                  </label>
                  <input
                    type="text"
                    required
                    value={corpForm.repName}
                    onChange={(e) => setCorpForm({ ...corpForm, repName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.corporateEmail}
                  </label>
                  <input
                    type="email"
                    required
                    value={corpForm.email}
                    onChange={(e) => setCorpForm({ ...corpForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.panNumber}
                  </label>
                  <input
                    type="text"
                    required
                    value={corpForm.panNumber}
                    onChange={(e) => setCorpForm({ ...corpForm, panNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.gstinNumber}
                  </label>
                  <input
                    type="text"
                    required
                    value={corpForm.gstinNumber}
                    onChange={(e) => setCorpForm({ ...corpForm, gstinNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-mono uppercase font-bold text-emerald-800"
                    placeholder="e.g. 27AAACM1234F1Z5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t.apmcLicense}
                  </label>
                  <input
                    type="text"
                    required
                    value={corpForm.apmcLicense}
                    onChange={(e) => setCorpForm({ ...corpForm, apmcLicense: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                    placeholder="e.g. APMC-MH-NSK-99214"
                  />
                </div>
              </div>

              {/* Prominent Verification Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCorpIdentityVerify}
                  disabled={isVerifyingCorp}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                    isVerifyingCorp
                      ? 'bg-amber-600 text-white cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  }`}
                >
                  {isVerifyingCorp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.verifyingCorporate}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.verifyCorporateBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                {t.saveBuyerProfileBtn}
              </button>
            </form>

          </div>
        )}
        
        {/* TAB 2: GLOBAL CROP MARKETPLACE */}
        {activeTab === 'MARKETPLACE' && (
          <div className="space-y-6">
            
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Onion, Soyabean, Nashik, Pune..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">{t.catAll}</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Oilseeds">Oilseeds</option>
                  <option value="Fiber">Fiber (Cotton)</option>
                  <option value="Cereals">Cereals (Rice/Wheat)</option>
                  <option value="Fruits">Fruits</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All Maharashtra Districts</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Latur">Latur</option>
                  <option value="Yavatmal">Yavatmal</option>
                  <option value="Pune">Pune</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Raigad">Raigad</option>
                </select>
              </div>
            </div>

            {/* Crop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map((crop) => {
                const cropBids = buyerBids.filter((b) => b.cropId === crop.id);
                const highestBid = cropBids.reduce((max, b) => (b.bidPrice > max ? b.bidPrice : max), 0);
                const isDealFinalized = crop.status === 'DEAL_FINALIZED' || crop.status === 'CANCEL_PENDING' || crop.status === 'DISPUTED' || crop.status === 'COLLUSION';
                const isCancelPending = crop.status === 'CANCEL_PENDING';
                const isDisputed = crop.status === 'DISPUTED';
                const isCollusion = crop.status === 'COLLUSION';
                const cropNameTitle = t[crop.nameKey] || crop.name;
                const cropVarietyTitle = t[crop.varietyKey] || crop.variety;
                const cropCategoryTitle = t[crop.categoryKey] || crop.category;
                const cropLocationTitle = t[crop.farmerLocationKey] || crop.farmerLocation;

                return (
                  <div
                    key={crop.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={crop.image}
                          alt={cropNameTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {crop.grade}
                          </span>
                          <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {cropCategoryTitle}
                          </span>
                        </div>
                        {isDealFinalized && (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                            <span className={`font-bold text-xs px-3 py-1.5 rounded-full shadow-lg ${
                              isCollusion 
                                ? 'text-white' 
                                : isDisputed 
                                  ? 'bg-red-500 text-white' 
                                  : isCancelPending 
                                    ? 'bg-amber-500 text-white animate-pulse'
                                    : 'bg-emerald-500 text-white'
                            }`} style={isCollusion ? {background:'linear-gradient(135deg,#dc2626,#991b1b)',animation:'collusionFlash 0.5s ease-in-out infinite alternate'} : {}}>
                              {isCollusion ? '🚨 Collusion Detected' : isDisputed ? '⚖️ Disputed — APMC Arbitrator' : isCancelPending ? '⏳ Cancellation Pending' : 'Deal Finalized 🔒'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{cropNameTitle}</h3>
                            <p className="text-xs text-slate-500">{cropVarietyTitle}</p>
                          </div>
                          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            {crop.quantity} Qtl
                          </span>
                        </div>

                        <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                          <div className="flex justify-between items-center">
                            <span>Farmer Base Price:</span>
                            <strong className="text-slate-900">₹{crop.expectedPrice}/Qtl</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Highest Counter-Bid:</span>
                            <strong className="text-emerald-700 font-bold">
                              {highestBid > 0 ? `₹${highestBid}/Qtl` : 'No bids yet'}
                            </strong>
                          </div>
                          <div className="flex items-center text-slate-500 pt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{cropLocationTitle}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-5 pt-0">
                      {isDealFinalized ? (
                        <button
                          disabled
                          className="w-full py-2.5 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
                        >
                          Bidding Closed (Deal Finalized)
                        </button>
                      ) : (
                        <button
                          onClick={() => openBidModal(crop)}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Place Counter-Bid</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: MY SUBMITTED BIDS */}
        {activeTab === 'MY_BIDS' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">{t.myBids}</h2>

            {buyerBids.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No Bids Placed Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Browse the Marketplace tab to place direct bids on crops.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="p-4">Crop Details</th>
                        <th className="p-4">Your Counter-Bid</th>
                        <th className="p-4">Warehouse & Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {buyerBids.map((bid) => {
                        const crop = crops.find((c) => c.id === bid.cropId);
                        const isAccepted = bid.status === 'ACCEPTED' || (crop && crop.acceptedBidId === bid.id);
                        const cropNameTitle = crop ? (t[crop.nameKey] || crop.name) : 'Crop Listing';
                        const cropLocationTitle = crop ? (t[crop.farmerLocationKey] || crop.farmerLocation) : '';

                        return (
                          <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-slate-900 block">{cropNameTitle}</span>
                              <span className="text-slate-500 font-mono text-[11px]">{crop?.quantity} Quintals • {cropLocationTitle}</span>
                            </td>

                            <td className="p-4">
                              <span className="font-extrabold text-amber-700 text-sm">₹{bid.bidPrice}/Qtl</span>
                              <span className="text-slate-400 block text-[10px]">Farmer Asked: ₹{crop?.expectedPrice}/Qtl</span>
                            </td>

                            <td className="p-4">
                              <span className="text-slate-800 font-medium block">{bid.buyerCity}</span>
                              <span className="text-slate-500 text-[10px]">Pickup: {bid.pickupDate}</span>
                            </td>

                            <td className="p-4">
                              {isAccepted ? (
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 font-bold rounded-full text-[11px] ${
                                  crop?.status === 'COLLUSION'
                                    ? 'text-white'
                                    : crop?.status === 'DISPUTED'
                                      ? 'bg-red-100 text-red-800 border border-red-400'
                                      : crop?.status === 'CANCEL_PENDING'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-400 animate-pulse'
                                        : 'bg-emerald-100 text-emerald-800'
                                }`} style={crop?.status === 'COLLUSION' ? {background:'linear-gradient(135deg,#dc2626,#991b1b)',animation:'collusionFlash 0.5s ease-in-out infinite alternate'} : {}}>
                                  {crop?.status === 'COLLUSION' ? (
                                    <><ShieldAlert className="w-3.5 h-3.5" /><span>🚨 Collusion Flagged</span></>
                                  ) : crop?.status === 'DISPUTED' ? (
                                    <><AlertTriangle className="w-3.5 h-3.5" /><span>⚖️ Disputed</span></>
                                  ) : crop?.status === 'CANCEL_PENDING' ? (
                                    <><Clock className="w-3.5 h-3.5" /><span>Cancellation Pending</span></>
                                  ) : (
                                    <><CheckCircle2 className="w-3.5 h-3.5" /><span>Accepted (Escrow Locked 🔒)</span></>
                                  )}
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold rounded-full text-[11px]">
                                  <Clock className="w-3.5 h-3.5 animate-spin" />
                                  <span>Pending Farmer Review</span>
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-right space-x-2">
                              {isAccepted ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => setUnlockedFarmerDetails({ crop, bid })}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Delivery Details</span>
                                  </button>

                                  <button
                                    onClick={() => openCancellationModal(crop.id, bid.id)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-[11px] rounded-xl border border-rose-400/40 shadow-lg transition-all flex items-center space-x-1"
                                  >
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span>{t.cancelTransactionBtn || 'Cancel Transaction'}</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Farmer details locked</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: PLACE COUNTER-BID FORM SUB-MODAL */}
      {bidModalCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setBidModalCrop(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Place Counter-Bid</h3>
                <p className="text-xs text-slate-500">Direct deal with {t[bidModalCrop.farmerLocationKey] || bidModalCrop.farmerLocation}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl mb-5 text-xs space-y-1">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Crop: {t[bidModalCrop.nameKey] || bidModalCrop.name}</span>
                <span>Qty: {bidModalCrop.quantity} Qtl</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Farmer's Asking Price:</span>
                <span className="font-bold">₹{bidModalCrop.expectedPrice}/Qtl</span>
              </div>
            </div>

            <form onSubmit={handleCounterBidSubmitClick} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your Bid Price (₹/Quintal)
                </label>
                <input
                  type="number"
                  required
                  value={counterBidForm.bidPrice}
                  onChange={(e) => setCounterBidForm({ ...counterBidForm, bidPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-extrabold text-base focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Warehouse Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={counterBidForm.buyerAddress}
                  onChange={(e) => setCounterBidForm({ ...counterBidForm, buyerAddress: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter full corporate warehouse address..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Logistics / Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={counterBidForm.pickupDate}
                  onChange={(e) => setCounterBidForm({ ...counterBidForm, pickupDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Submit Counter-Bid to Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: PLACE COUNTER-BID */}
      {pendingPlaceBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-2 border-amber-500 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.confirmPlaceBidTitle}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  B2B Counter-Bid Authorization
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {t.confirmPlaceBidMsg
                ?.replace('{price}', pendingPlaceBid.bidPrice.toLocaleString('en-IN'))
                ?.replace('{crop}', t[pendingPlaceBid.crop.nameKey] || pendingPlaceBid.crop.name) ||
                `Do you want to place this bid of ₹${pendingPlaceBid.bidPrice}/Qtl?`}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setPendingPlaceBid(null)}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {t.confirmNo}
              </button>

              <button
                onClick={confirmPlaceBidAction}
                className="w-1/2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>{t.confirmYes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UNLOCKED FARMER DELIVERY DETAILS */}
      {unlockedFarmerDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-emerald-500">
            <button
              onClick={() => setUnlockedFarmerDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Farmer Contact & Field Address</h3>
                <p className="text-xs text-emerald-700 font-semibold">Deal Finalized (Payment Escrowed)</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3 text-xs mb-6">
              <div>
                <span className="text-slate-500 block">Farmer / Seller Name:</span>
                <span className="font-bold text-slate-900 text-sm">{unlockedFarmerDetails.crop.farmerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Phone Number:</span>
                <span className="font-bold text-emerald-800 text-sm flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-emerald-600" />
                  {unlockedFarmerDetails.crop.farmerPhone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Pickup Field Location:</span>
                <span className="font-semibold text-slate-800 flex items-start mt-0.5">
                  <MapPin className="w-4 h-4 mr-1 text-emerald-600 shrink-0" />
                  {t[unlockedFarmerDetails.crop.farmerLocationKey] || unlockedFarmerDetails.crop.farmerLocation}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (window.confirm(t.cancelConfirmMsg)) {
                    cancelDeal(unlockedFarmerDetails.crop.id, unlockedFarmerDetails.bid.id);
                    setUnlockedFarmerDetails(null);
                  }
                }}
                className="w-1/2 py-2.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-300 hover:bg-rose-200 transition-all flex items-center justify-center space-x-1"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{t.cancelDealBtn}</span>
              </button>

              <button
                onClick={() => setUnlockedFarmerDetails(null)}
                className="w-1/2 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
