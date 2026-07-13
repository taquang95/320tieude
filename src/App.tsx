import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Target,
  CheckSquare,
  Mail,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  BookOpen,
  Sparkles,
  Clock,
  Lock,
  Unlock,
  Menu,
  X,
  Copy,
  Download,
  AlertCircle,
  ShieldCheck,
  Briefcase,
  Users,
  FileSpreadsheet,
  ArrowLeft
} from "lucide-react";

import { BENEFITS, INSIDE_CONTENT, HEADLINE_TEMPLATES, FILTER_OPTIONS, TARGET_AUDIENCE_DATA, FAQS } from "./data";
import { FAQItem, DocContentItem, TargetAudience } from "./types";

export default function App() {
  // Lead submission state
  const [email, setEmail] = useState("");
  const [bottomEmail, setBottomEmail] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  
  const [name, setName] = useState("");
  const [bottomName, setBottomName] = useState("");
  const [modalName, setModalName] = useState("");
  
  const [emailError, setEmailError] = useState("");
  const [bottomEmailError, setBottomEmailError] = useState("");
  const [modalEmailError, setModalEmailError] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [bottomNameError, setBottomNameError] = useState("");
  const [modalNameError, setModalNameError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showThankYouPage, setShowThankYouPage] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Interactive customizer state
  const [selectedLoaiHinh, setSelectedLoaiHinh] = useState(FILTER_OPTIONS.loaiHinh[0].value);
  const [selectedNhomKhach, setSelectedNhomKhach] = useState(FILTER_OPTIONS.nhomKhach[0].value);
  const [selectedKhuVuc, setSelectedKhuVuc] = useState(FILTER_OPTIONS.khuVuc[0].value);
  
  // Copy feedback state
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  
  // UI States
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    "faq-1": true, // open the first FAQ by default
  });
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for the sticky floating CTA at bottom (for mobile/desktop conversion optimization)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsStickyVisible(true);
      } else {
        setIsStickyVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Validate email address format
  const validateEmailFormat = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  // Submit Lead Handler
  const handleLeadSubmit = async (e: FormEvent, type: "hero" | "bottom" | "modal") => {
    e.preventDefault();
    let targetEmail = "";
    let targetName = "";
    let setEmailErr: (msg: string) => void = () => {};
    let setNameErr: (msg: string) => void = () => {};

    if (type === "hero") {
      targetEmail = email;
      targetName = name;
      setEmailErr = setEmailError;
      setNameErr = setNameError;
    } else if (type === "bottom") {
      targetEmail = bottomEmail;
      targetName = bottomName;
      setEmailErr = setBottomEmailError;
      setNameErr = setBottomNameError;
    } else {
      targetEmail = modalEmail;
      targetName = modalName;
      setEmailErr = setModalEmailError;
      setNameErr = setModalNameError;
    }

    let hasError = false;

    if (!targetName.trim()) {
      setNameErr("Vui lòng nhập họ tên của bạn");
      hasError = true;
    } else if (targetName.trim().length < 2) {
      setNameErr("Họ tên tối thiểu phải có 2 ký tự");
      hasError = true;
    } else {
      setNameErr("");
    }

    if (!targetEmail) {
      setEmailErr("Vui lòng nhập địa chỉ email của bạn");
      hasError = true;
    } else if (!validateEmailFormat(targetEmail)) {
      setEmailErr("Địa chỉ email không hợp lệ (ví dụ: name@gmail.com)");
      hasError = true;
    } else {
      setEmailErr("");
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: targetName,
          email: targetEmail,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.warn("Server-side Mautic submission error or warning:", data.message);
      }
    } catch (err) {
      console.error("Failed to submit lead to Mautic proxy API:", err);
    }

    // Save lead locally to localStorage for backup persistence and status display
    const savedLeads = JSON.parse(localStorage.getItem("leads") || "[]");
    savedLeads.push({ name: targetName, email: targetEmail, date: new Date().toISOString() });
    localStorage.setItem("leads", JSON.stringify(savedLeads));

    setSubmittedEmail(targetEmail);
    setIsSubmitting(false);
    setShowThankYouPage(true);
    setShowSignupModal(false);

    // Reset input fields
    setEmail("");
    setBottomEmail("");
    setModalEmail("");
    setName("");
    setBottomName("");
    setModalName("");
  };

  // Live customizer headline rendering
  const renderHeadline = (template: string) => {
    return template
      .replace("{loaiHinh}", selectedLoaiHinh)
      .replace("{nhomKhach}", selectedNhomKhach)
      .replace("{khuVuc}", selectedKhuVuc);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => {
      setCopiedTextId(null);
    }, 2000);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (showThankYouPage) {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-brand-red/15 selection:text-brand-navy antialiased flex flex-col justify-between">
        {/* Header with Logo for visual identity persistence */}
        <header className="bg-white border-b border-slate-100 shadow-xs py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowThankYouPage(false)}>
              <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-white font-extrabold text-xl shadow-md border-b-2 border-brand-red">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-brand-navy">
                  Nguyễn Nam<span className="text-brand-red">.</span>
                </span>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 font-semibold uppercase">
                  ACADEMY
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowThankYouPage(false)}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-navy font-bold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          </div>
        </header>

        {/* The requested Thank You Page Markup */}
        <main className="flex-1 flex flex-col items-center py-10 md:py-16 px-4">
          <div className="max-w-7xl w-full text-center space-y-8 md:space-y-12">
            
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-black text-[#E11D48] tracking-tighter uppercase leading-none">
                ĐÃ GỬI EMAIL!
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-bold italic">
                Hãy làm theo hướng dẫn bên dưới
              </p>
            </div>

            {/* Steps Visual Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                
                {/* Step 1 Card */}
                <div className="flex flex-col group h-full">
                  <div className="bg-white rounded-[2rem] p-3 md:p-4 w-full h-full border border-gray-100 shadow-xl hover:shadow-red-50/50 transition-all duration-300 flex flex-col">
                    <div className="rounded-[1.5rem] overflow-hidden mb-4 flex items-center justify-center bg-gray-50 aspect-[4/5] w-full shadow-inner relative">
                      <img
                        alt="Check Inbox"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        src="https://i.postimg.cc/GmP1Y4KN/Bu_o_c_1.png"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-auto px-2 mb-4 min-h-[50px] flex items-center justify-center text-center">
                      <p className="text-gray-900 font-extrabold leading-tight text-lg md:text-xl">
                        Kiểm tra hộp thư <span className="text-[#E11D48]">Inbox (Chính)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 Card */}
                <div className="flex flex-col group h-full">
                  <div className="bg-white rounded-[2rem] p-3 md:p-4 w-full h-full border border-gray-100 shadow-xl hover:shadow-red-50/50 transition-all duration-300 flex flex-col">
                    <div className="rounded-[1.5rem] overflow-hidden mb-4 flex items-center justify-center bg-gray-50 aspect-[4/5] w-full shadow-inner relative">
                      <img
                        alt="Check Promotions"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        src="https://i.postimg.cc/XYK0FrLt/Bu_o_c_2.png"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-auto px-2 mb-4 min-h-[50px] flex items-center justify-center text-center">
                      <p className="text-gray-900 font-extrabold leading-tight text-lg md:text-xl">
                        Kiểm tra tab <span className="text-[#E11D48]">Thư rác (Spam)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 Card */}
                <div className="flex flex-col group h-full">
                  <div className="bg-white rounded-[2rem] p-3 md:p-4 w-full h-full border border-gray-100 shadow-xl hover:shadow-red-50/50 transition-all duration-300 flex flex-col border-b-[8px] border-b-red-500">
                    <div className="rounded-[1.5rem] overflow-hidden mb-4 flex items-center justify-center bg-gray-50 aspect-[4/5] w-full shadow-inner relative">
                      <img
                        alt="Check Spam"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        src="https://i.postimg.cc/wvh1tXMV/Bu-o_c_3-new.png"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-auto px-2 mb-4 min-h-[50px] flex items-center justify-center text-center">
                      <p className="text-gray-900 font-extrabold leading-tight text-lg md:text-xl uppercase">
                        BẤM <span className="text-[#E11D48]">"NOT SPAM"</span> ĐỂ NHẬN TÀI LIỆU
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Instruction Accordion/Info Section */}
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="bg-white border border-blue-50 rounded-[2rem] shadow-lg overflow-hidden text-left">
                <div className="p-6 md:p-8 space-y-6">
                  
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                      1
                    </div>
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed pt-1">
                      Kiểm tra hộp thư <span className="font-bold text-gray-900">Inbox (Hộp thư đến)</span> hoặc tab <span className="font-bold text-gray-900">Promotions (Quảng cáo)</span>.
                    </p>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                      2
                    </div>
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed pt-1">
                      Nếu không thấy, vui lòng kiểm tra mục <span className="font-bold text-gray-900">Spam (Thư rác)</span>.
                    </p>
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-10 h-10 rounded-full bg-[#F43F5E] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                      3
                    </div>
                    <div className="space-y-2 pt-1">
                      <p className="text-[#F43F5E] font-black text-xl md:text-2xl uppercase tracking-tight">
                        QUAN TRỌNG:
                      </p>
                      <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                        Nếu mail nằm trong Spam, hãy bấm nút <span className="font-bold text-gray-900">"Report not spam"</span> để đảm bảo bạn nhận được tài liệu từ Nguyễn Nam.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <p className="text-gray-400 text-base md:text-lg italic font-bold">
                * Email tự động có thể mất 30s để đến hộp thư của bạn.
              </p>
            </div>

            {/* Back Button and Security footer */}
            <div className="pt-4 flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setShowThankYouPage(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors font-bold text-xl cursor-pointer bg-transparent border-0"
              >
                <ArrowLeft className="w-6 h-6" />
                Quay lại trang chính
              </button>
              
              <div className="flex items-center gap-2 text-[12px] text-gray-300 font-bold uppercase tracking-[0.4em]">
                <ShieldCheck className="w-5 h-5 text-gray-300" />
                BẢO MẬT & HỖ TRỢ 24/7
              </div>
            </div>

          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
          <p>© 2026 Nguyễn Nam Academy. Toàn bộ bản quyền tài liệu được bảo hộ.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-red/15 selection:text-brand-navy antialiased">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-white font-extrabold text-xl shadow-md border-b-2 border-brand-red">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-brand-navy">
                  Nguyễn Nam<span className="text-brand-red">.</span>
                </span>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 font-semibold uppercase">
                  ACADEMY
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button 
                onClick={() => scrollToSection("loi-ich")} 
                className="hover:text-brand-navy transition-colors duration-150 cursor-pointer"
              >
                Lợi ích
              </button>
              <button 
                onClick={() => scrollToSection("noi-dung")} 
                className="hover:text-brand-navy transition-colors duration-150 cursor-pointer"
              >
                Nội dung tài liệu
              </button>
              <button 
                onClick={() => scrollToSection("preview")} 
                className="hover:text-brand-navy transition-colors duration-150 cursor-pointer"
              >
                Mẫu thử tiêu đề
              </button>
              <button 
                onClick={() => scrollToSection("faq")} 
                className="hover:text-brand-navy transition-colors duration-150 cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => {
                  const el = document.getElementById("hero-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-dark transition-all duration-200 shadow-sm border border-transparent hover:border-brand-red/30 cursor-pointer"
              >
                Nhận tài liệu miễn phí
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3 shadow-inner">
                <button
                  onClick={() => scrollToSection("loi-ich")}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Lợi ích của tài liệu
                </button>
                <button
                  onClick={() => scrollToSection("noi-dung")}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Nội dung chi tiết
                </button>
                <button
                  onClick={() => scrollToSection("preview")}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Mẫu thử tương tác
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Câu hỏi thường gặp (FAQ)
                </button>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowSignupModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-red text-white font-semibold shadow-md text-sm hover:bg-brand-red-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Nhận tài liệu ngay (Free)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:py-20 lg:pt-24 lg:pb-28 bg-white overflow-hidden">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline and Form */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-brand-neutral border border-brand-navy/10 px-3 py-1.5 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-brand-red animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-brand-navy uppercase">
                  Tài liệu thực chiến độc quyền cho môi giới & marketer BĐS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 leading-tight">
                Nhận ngay <span className="text-brand-navy relative inline-block">320 tiêu đề BĐS<span className="absolute bottom-1 left-0 w-full h-1.5 bg-brand-red/20 -z-10" /></span> hấp dẫn để viết content nhanh và hút khách hơn
              </h1>

              {/* Subheadline */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Một bộ template thực chiến giúp bạn tạo hàng trăm tiêu đề cuốn hút theo loại hình BĐS, nhóm khách hàng và khu vực cụ thể chỉ trong vài phút. Không còn lo bí ý tưởng viết bài!
              </p>

              {/* Lead Form Box */}
              <div id="hero-form" className="bg-slate-50 border border-slate-200/80 p-5 sm:p-6 rounded-2xl shadow-sm max-w-xl">
                <form onSubmit={(e) => handleLeadSubmit(e, "hero")} className="space-y-4">
                  <div className="space-y-3">
                    {/* Họ tên input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError("");
                        }}
                        placeholder="Nhập họ và tên của bạn..."
                        className={`block w-full pl-10.5 pr-3 py-3 sm:py-3.5 text-slate-900 placeholder:text-slate-400 bg-white border ${
                          nameError ? "border-brand-red focus:ring-brand-red" : "border-slate-300 focus:ring-brand-navy"
                        } rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-2`}
                        required
                      />
                    </div>
                    {nameError && (
                      <p className="text-xs text-brand-red font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {nameError}
                      </p>
                    )}

                    {/* Email input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        placeholder="Nhập địa chỉ email của bạn..."
                        className={`block w-full pl-10.5 pr-3 py-3 sm:py-3.5 text-slate-900 placeholder:text-slate-400 bg-white border ${
                          emailError ? "border-brand-red focus:ring-brand-red" : "border-slate-300 focus:ring-brand-navy"
                        } rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-2`}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-brand-red font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-dark transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        Gửi file cho tôi
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                  
                  {/* Note below form */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-3 text-slate-500 text-xs font-medium border-t border-slate-200/50">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Miễn phí 100%
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Nhận ngay trong email
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Bảo mật & Không spam
                    </span>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Premium CSS 3D Book Mockup & Key Badges */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              
              {/* 3D Book Mockup Container */}
              <div className="relative group w-64 sm:w-72 h-[360px] sm:h-[400px] mb-8 [perspective:1000px] select-none">
                
                {/* Simulated Glow Background */}
                <div className="absolute inset-x-4 inset-y-10 bg-brand-navy/10 rounded-full blur-2xl -z-10 group-hover:bg-brand-navy/15 transition-colors duration-300" />

                {/* The 3D Book */}
                <div className="relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-15deg)_rotateX(8deg)] [transform:rotateY(-5deg)_rotateX(5deg)] shadow-xl rounded-r-2xl">
                  
                  {/* Spine Cover Back shadow */}
                  <div className="absolute inset-0 bg-slate-900/10 rounded-r-2xl blur-xs -z-10 translate-x-3 translate-y-3" />

                  {/* Front Book Cover */}
                  <div className="absolute inset-0 bg-brand-navy border border-brand-navy-light rounded-r-2xl overflow-hidden flex flex-col justify-between p-6 text-white [backface-visibility:hidden] z-10 border-l-8 border-l-black/35 shadow-inner">
                    
                    {/* Top Accent */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono tracking-widest text-brand-red font-bold uppercase">
                          NGUYEN NAM ACADEMY
                        </span>
                        <span className="text-[7px] text-slate-300 font-medium">BẢN THỰC CHIẾN MÔI GIỚI</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-brand-red" />
                      </div>
                    </div>

                    {/* Book Title Design */}
                    <div className="my-auto space-y-4 pt-4">
                      <div className="h-1 w-12 bg-brand-red rounded-full" />
                      <div className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none uppercase">
                        320
                      </div>
                      <div className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
                        TIÊU ĐỀ BĐS
                        <span className="block text-brand-red text-lg sm:text-xl font-bold mt-1">
                          HẤP DẪN RA LEAD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        Công thức viết tiêu đề chạm đúng tâm lý và thúc đẩy khách hàng hành động ngay lập tức.
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] font-mono tracking-wider uppercase text-slate-400">Tác giả</span>
                        <span className="text-[11px] font-bold text-white">Nguyễn Nam</span>
                      </div>
                      <span className="bg-brand-red text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Free PDF
                      </span>
                    </div>

                    {/* Abstract architectural grid design inside cover */}
                    <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-brand-red/5 rounded-full border border-brand-red/10 -z-10" />
                    <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/5 rounded-full border border-white/5 -z-10" />
                  </div>

                  {/* Book Spine Page Thickness Mockup */}
                  <div className="absolute top-0 bottom-0 right-0 w-4 bg-slate-100 border-y border-r border-slate-300 rounded-r-md origin-right [transform:rotateY(90deg)_translateX(4px)] flex flex-col justify-between py-1 px-[2px] shadow-inner">
                    <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_1px,#ddd_1px)] bg-[size:100%_4px]" />
                  </div>
                </div>

                {/* Interactive floating pulse click helper */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/95 border border-slate-100 shadow-md p-2 rounded-full hidden sm:flex items-center justify-center text-slate-500 animate-bounce cursor-pointer group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-brand-red" />
                </div>
              </div>

              {/* Three Badges Below the Book */}
              <div className="w-full max-w-sm grid grid-cols-3 gap-2.5 text-center px-2">
                <div className="bg-white border border-slate-150 p-2.5 rounded-xl shadow-xs hover:border-brand-navy/20 transition-all duration-200">
                  <div className="inline-flex items-center justify-center p-1.5 bg-brand-neutral text-brand-navy rounded-lg mb-1">
                    <FileText className="w-4 h-4 text-brand-navy" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">320 Tiêu Đề</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mẫu biên soạn sẵn</p>
                </div>
                <div className="bg-white border border-slate-150 p-2.5 rounded-xl shadow-xs hover:border-brand-navy/20 transition-all duration-200">
                  <div className="inline-flex items-center justify-center p-1.5 bg-brand-neutral text-brand-navy rounded-lg mb-1">
                    <BookOpen className="w-4 h-4 text-brand-navy" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Đa Chủ Đề</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Bao phủ 6 chương</p>
                </div>
                <div className="bg-white border border-slate-150 p-2.5 rounded-xl shadow-xs hover:border-brand-navy/20 transition-all duration-200">
                  <div className="inline-flex items-center justify-center p-1.5 bg-brand-neutral text-brand-navy rounded-lg mb-1">
                    <CheckSquare className="w-4 h-4 text-brand-navy" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Dễ Tùy Biến</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Điền vào chỗ trống</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. TRUST BAR */}
      <section className="bg-slate-900 text-white py-6 border-y border-slate-800 relative z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 lg:gap-24 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b md:border-b-0 md:border-r border-slate-700 pb-2 md:pb-0 md:pr-10">
              Giải pháp tối ưu cho:
            </span>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm font-semibold text-slate-200 tracking-wide">Môi giới bất động sản thực chiến</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm font-semibold text-slate-200 tracking-wide">Team marketing dự án BĐS</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm font-semibold text-slate-200 tracking-wide">Chủ dự án / Sales Leader định hướng nhóm</span>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHORITY INTRO: Giói thiệu Nguyễn Nam Academy & Vì sao nên tải */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Author/Brand Profile Intro */}
          <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-2xl shadow-xs mb-16 sm:mb-20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Profile Image / Mock Avatar */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative">
                  <div className="w-48 sm:w-56 rounded-2xl bg-white border-4 border-slate-100 shadow-md relative overflow-hidden">
                    <img 
                      src="https://i.postimg.cc/j5nWg8jz/anh-dai-dien.jpg" 
                      alt="Nguyễn Nam - Founder Nguyễn Nam Academy" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-auto block" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white border border-slate-200 shadow-sm rounded-full p-2 text-brand-navy">
                    <ShieldCheck className="w-5 h-5 text-brand-red" />
                  </div>
                </div>
              </div>

              {/* Intro Content */}
              <div className="md:col-span-8 space-y-4 text-center md:text-left">
                <div className="inline-block bg-brand-navy/5 text-brand-navy text-xs font-semibold px-2.5 py-1 rounded-md uppercase">
                  Về Nguyễn Nam Academy
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  Đơn vị Đào tạo & Tư vấn Content Marketing BĐS Thực Chiến
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Được sáng lập bởi chuyên gia Nguyễn Nam, học viện đã đồng hành cùng hàng ngàn môi giới và marketer bất động sản khắp Việt Nam. Chúng tôi tin rằng Content hay không đến từ tài năng bẩm sinh, mà đến từ sự thấu hiểu sâu sắc tâm lý khách hàng được đóng gói thành các **công thức khoa học và dễ sao chép**.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" /> 10,000+ Học viên & Học giả
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" /> 50+ Tài liệu thực chiến đã phát hành
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 4. SECTION: “Bạn nhận được gì?” */}
          <div id="loi-ich" className="scroll-mt-24 space-y-12 sm:space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-red">
                Vì sao bạn nên tải tài liệu này ngay hôm nay?
              </h2>
              <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
                Giải quyết triệt để nỗi sợ bí content và nâng cao tỷ lệ ra lead
              </p>
              <div className="h-1 w-16 bg-brand-navy mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BENEFITS.map((b) => {
                return (
                  <div
                    key={b.id}
                    className="bg-white border border-slate-150 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        {b.iconName === "Zap" && <Zap className="w-6 h-6 text-brand-navy" />}
                        {b.iconName === "Target" && <Target className="w-6 h-6 text-brand-navy" />}
                        {b.iconName === "CheckSquare" && <CheckSquare className="w-6 h-6 text-brand-navy" />}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                        {b.title}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {b.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bản quyền Nguyễn Nam Academy
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECTION “Bên trong tài liệu có gì?” */}
      <section id="noi-dung" className="scroll-mt-24 py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-navy">
              Cơ cấu cấu trúc tài liệu PDF
            </h2>
            <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              Khám phá lộ trình nội dung chuyên sâu bên trong
            </p>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Tài liệu được phân loại rõ ràng thành 6 chương chuyên sâu, giúp bạn nhanh chóng tra cứu đúng chủ đề BĐS bạn đang phân phối.
            </p>
            <div className="h-1 w-16 bg-brand-red mx-auto rounded-full" />
          </div>

          {/* 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INSIDE_CONTENT.map((item, idx) => {
              return (
                <div 
                  key={item.id} 
                  className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs hover:bg-white hover:border-brand-navy/35 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle index watermark in background */}
                  <span className="absolute right-3 top-2 text-6xl font-black text-slate-100 select-none group-hover:text-slate-200/50 transition-colors pointer-events-none">
                    0{idx + 1}
                  </span>

                  <div className="relative z-10 space-y-4">
                    {/* Badge */}
                    <span className="inline-block bg-brand-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.badge}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 text-xs sm:text-sm">
                      {item.description}
                    </p>

                    {/* Nested bullet outlines */}
                    <ul className="space-y-2 pt-3 border-t border-slate-200/60 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
                      {item.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                const el = document.getElementById("hero-form");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-brand-navy hover:bg-brand-navy-dark transition-all duration-200 shadow-md cursor-pointer"
            >
              Tải trọn bộ 6 chương PDF miễn phí
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. SECTION PREVIEW: Dynamic interactive customizer! */}
      <section id="preview" className="scroll-mt-24 py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/25 text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Trình thử nghiệm tiêu đề thông minh
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              Bấm thử và tùy biến tiêu đề theo mong muốn
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Thay đổi các thông số dưới đây để xem tài liệu của Nguyễn Nam Academy tự động lắp ghép thành tiêu đề thực chiến chuẩn xác như thế nào!
            </p>
            <div className="h-1 w-16 bg-brand-navy mx-auto rounded-full" />
          </div>

          {/* The Customizer Control Console */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm max-w-4xl mx-auto space-y-6">
            
            {/* Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Option 1: BĐS Category */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  1. Loại hình BĐS
                </label>
                <select
                  value={selectedLoaiHinh}
                  onChange={(e) => setSelectedLoaiHinh(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-navy focus:outline-hidden text-slate-800 font-medium cursor-pointer"
                >
                  {FILTER_OPTIONS.loaiHinh.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Option 2: Target Audience */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  2. Nhóm khách mục tiêu
                </label>
                <select
                  value={selectedNhomKhach}
                  onChange={(e) => setSelectedNhomKhach(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-navy focus:outline-hidden text-slate-800 font-medium cursor-pointer"
                >
                  {FILTER_OPTIONS.nhomKhach.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Option 3: Location */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  3. Khu vực dự án
                </label>
                <select
                  value={selectedKhuVuc}
                  onChange={(e) => setSelectedKhuVuc(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-navy focus:outline-hidden text-slate-800 font-medium cursor-pointer"
                >
                  {FILTER_OPTIONS.khuVuc.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Simulated Live Output Cards */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                Kết quả hiển thị trực tiếp (Mẫu Thử):
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Headline Card 1: Unlocked */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-left relative group hover:border-brand-navy transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded mb-3">
                      🔓 Mẫu FREE số 01
                    </span>
                    <p className="text-slate-900 font-display font-bold text-sm sm:text-base leading-snug">
                      "{renderHeadline(HEADLINE_TEMPLATES[0].template)}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Chương 1: Xu hướng</span>
                    <button
                      onClick={() => copyToClipboard(renderHeadline(HEADLINE_TEMPLATES[0].template), "tpl-1")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-red transition-colors cursor-pointer"
                    >
                      {copiedTextId === "tpl-1" ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đã copy!
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy tiêu đề
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Headline Card 2: Unlocked */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-left relative group hover:border-brand-navy transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded mb-3">
                      🔓 Mẫu FREE số 02
                    </span>
                    <p className="text-slate-900 font-display font-bold text-sm sm:text-base leading-snug">
                      "{renderHeadline(HEADLINE_TEMPLATES[1].template)}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Chương 2: Hướng dẫn</span>
                    <button
                      onClick={() => copyToClipboard(renderHeadline(HEADLINE_TEMPLATES[1].template), "tpl-2")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-red transition-colors cursor-pointer"
                    >
                      {copiedTextId === "tpl-2" ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đã copy!
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy tiêu đề
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Headline Card 3: BLURRED / LOCKED */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-left relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  
                  {/* Blur Overlay */}
                  <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 text-center">
                    <Lock className="w-5 h-5 text-brand-red mb-1.5 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Đã khóa 318 tiêu đề còn lại
                    </span>
                    <button
                      onClick={() => {
                        const el = document.getElementById("hero-form");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[10px] text-brand-navy underline font-bold mt-1 hover:text-brand-red transition-colors cursor-pointer"
                    >
                      Đăng ký email để tải trọn bộ
                    </button>
                  </div>

                  <div>
                    <span className="inline-block bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded mb-3">
                      🔒 Mẫu khóa PRO số 03
                    </span>
                    <p className="text-slate-400 font-display font-medium text-sm leading-snug blurred-preview">
                      "{renderHeadline(HEADLINE_TEMPLATES[2].template)}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-300 font-mono">Chương 3: Top list</span>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Đã khóa
                    </span>
                  </div>
                </div>

                {/* Headline Card 4: BLURRED / LOCKED */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-left relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  
                  {/* Blur Overlay */}
                  <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 text-center">
                    <Lock className="w-5 h-5 text-brand-red mb-1.5 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Đã khóa 318 tiêu đề còn lại
                    </span>
                    <button
                      onClick={() => {
                        const el = document.getElementById("hero-form");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[10px] text-brand-navy underline font-bold mt-1 hover:text-brand-red transition-colors cursor-pointer"
                    >
                      Đăng ký email để tải trọn bộ
                    </button>
                  </div>

                  <div>
                    <span className="inline-block bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded mb-3">
                      🔒 Mẫu khóa PRO số 04
                    </span>
                    <p className="text-slate-400 font-display font-medium text-sm leading-snug blurred-preview">
                      "{renderHeadline(HEADLINE_TEMPLATES[3].template)}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-300 font-mono">Chương 4: Cảnh báo</span>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Đã khóa
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SECTION “Ai nên tải tài liệu này?” */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-red">
              Phân khúc học giả phù hợp
            </h2>
            <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              Tài liệu này được biên soạn cho ai?
            </p>
            <div className="h-1 w-16 bg-brand-navy mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TARGET_AUDIENCE_DATA.map((aud) => {
              return (
                <div
                  key={aud.id}
                  className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:bg-white hover:border-brand-navy/30 transition-all duration-300 shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Role header card */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center">
                        {aud.id === "aud-1" && <Briefcase className="w-5 h-5 text-white" />}
                        {aud.id === "aud-2" && <Target className="w-5 h-5 text-white" />}
                        {aud.id === "aud-3" && <Users className="w-5 h-5 text-white" />}
                      </div>
                      <div className="text-left">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-tight">
                          {aud.title}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">
                          {aud.role}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-left">
                      {aud.description}
                    </p>

                    {/* Pain point bullet */}
                    <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-left space-y-1">
                      <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                        Khó khăn hiện tại:
                      </span>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {aud.painPoint}
                      </p>
                    </div>

                    {/* Benefit bullet */}
                    <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-left space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Giá trị nhận được:
                      </span>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {aud.benefit}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6 text-left flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Hoàn toàn phù hợp
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. FORM CTA REPEATING (Nền Navy Block) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-brand-navy rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white overflow-hidden shadow-xl border-t-4 border-brand-red">
            {/* Ambient gold/red radial light overlay */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl -z-10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
              <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                ĐĂNG KÝ MIỄN PHÍ TRONG HÔM NAY
              </span>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                Tải ngay bộ 320 tiêu đề BĐS độc quyền gửi thẳng vào email của bạn
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Đừng bỏ lỡ cơ hội sở hữu bộ template content thực chiến được hàng ngàn môi giới viên tin dùng để thu hút khách hàng tiềm năng hiệu quả nhất.
              </p>

              {/* Form container */}
              <div className="max-w-md mx-auto">
                <form onSubmit={(e) => handleLeadSubmit(e, "bottom")} className="space-y-4 text-left">
                  <div className="space-y-3">
                    {/* Họ tên input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={bottomName}
                        onChange={(e) => {
                          setBottomName(e.target.value);
                          if (bottomNameError) setBottomNameError("");
                        }}
                        placeholder="Nhập họ và tên của bạn..."
                        className={`block w-full pl-10.5 pr-3 py-3 sm:py-3.5 text-slate-950 placeholder:text-slate-400 bg-white border ${
                          bottomNameError ? "border-brand-red focus:ring-brand-red" : "border-transparent focus:ring-brand-red"
                        } rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-2`}
                        required
                      />
                    </div>
                    {bottomNameError && (
                      <p className="text-xs text-brand-red font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {bottomNameError}
                      </p>
                    )}

                    {/* Email input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={bottomEmail}
                        onChange={(e) => {
                          setBottomEmail(e.target.value);
                          if (bottomEmailError) setBottomEmailError("");
                        }}
                        placeholder="Nhập địa chỉ email của bạn..."
                        className={`block w-full pl-10.5 pr-3 py-3 sm:py-3.5 text-slate-950 placeholder:text-slate-400 bg-white border ${
                          bottomEmailError ? "border-brand-red focus:ring-brand-red" : "border-transparent focus:ring-brand-red"
                        } rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-2`}
                        required
                      />
                    </div>
                    {bottomEmailError && (
                      <p className="text-xs text-brand-red font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {bottomEmailError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-dark transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none cursor-pointer text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                      </div>
                    ) : (
                      "Nhận tài liệu ngay"
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 font-medium text-center pt-1">
                    ⚠️ Nguyễn Nam Academy cam kết không bao giờ spam hòm thư của bạn. Bạn có thể hủy nhận tin bất kỳ lúc nào chỉ bằng 1 click.
                  </p>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="scroll-mt-24 py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-navy">
              Giải đáp thắc mắc
            </h2>
            <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              Câu hỏi thường gặp
            </p>
            <div className="h-1 w-16 bg-brand-red mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openFaqs[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-display font-bold text-slate-950 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 sm:py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            
            {/* Col 1: Brand details */}
            <div className="md:col-span-2 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-brand-navy font-black text-lg">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-white leading-none">
                    Nguyễn Nam<span className="text-brand-red">.</span>
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-slate-400 font-bold uppercase mt-0.5">
                    ACADEMY
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Đơn vị đào tạo hàng đầu chuyên sâu về giải pháp xây dựng thương hiệu cá nhân và viết bài ra lead cho ngành Bất động sản tại Việt Nam.
              </p>
            </div>

            {/* Col 2: Useful Links */}
            <div className="text-left space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                Đường dẫn nhanh
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button onClick={() => scrollToSection("loi-ich")} className="hover:text-white transition-colors cursor-pointer">
                    Lợi ích
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("noi-dung")} className="hover:text-white transition-colors cursor-pointer">
                    Nội dung chương trình
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("preview")} className="hover:text-white transition-colors cursor-pointer">
                    Mẫu thử tiêu đề BĐS
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="hover:text-white transition-colors cursor-pointer">
                    FAQ giải đáp thắc mắc
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact & Info */}
            <div className="text-left space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                Liên hệ hỗ trợ
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-red" />
                  <a href="mailto:hotro@nambds.vn" className="hover:text-white transition-colors">
                    hotro@nambds.vn
                  </a>
                </li>
                <li className="text-xs text-slate-500">
                  Thời gian phản hồi hỗ trợ kỹ thuật: 8:00 - 18:00 hàng ngày (Trừ Chủ Nhật)
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Nguyễn Nam Academy. Toàn bộ bản quyền tài liệu được bảo hộ.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>
          </div>

        </div>
      </footer>

      {/* STICKY FLOATING CTA BUTTON AT BOTTOM (FOR MOBILE CONVERSION OPTIMIZATION) */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-4 inset-x-4 z-45 md:max-w-md md:mx-auto md:left-auto md:right-4 shadow-xl"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center text-white shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">320 Tiêu Đề BĐS Miễn Phí</h4>
                  <p className="text-[10px] text-slate-500">Gửi ngay qua Email trong 1 phút</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById("hero-form");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    setShowSignupModal(true);
                  }
                }}
                className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-150 shadow-xs flex items-center gap-1 cursor-pointer hover:scale-103"
              >
                Tải Ngay <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP REGISTRATION MODAL */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignupModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-brand-navy" />
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                  Tải Trọn Bộ 320 Tiêu Đề BĐS
                </h3>

                <p className="text-slate-500 text-xs sm:text-sm">
                  Vui lòng cung cấp địa chỉ email chính xác để Nguyễn Nam Academy gửi file tài liệu PDF trực tiếp vào hòm thư của bạn.
                </p>

                <form onSubmit={(e) => handleLeadSubmit(e, "modal")} className="space-y-3 pt-2 text-left">
                  {/* Họ tên input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Users className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={modalName}
                      onChange={(e) => {
                        setModalName(e.target.value);
                        if (modalNameError) setModalNameError("");
                      }}
                      placeholder="Nhập họ và tên của bạn..."
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                        modalNameError ? "border-brand-red focus:ring-brand-red" : "border-slate-200 focus:ring-brand-navy"
                      } rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2`}
                      required
                    />
                  </div>

                  {modalNameError && (
                    <p className="text-xs text-brand-red font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {modalNameError}
                    </p>
                  )}

                  {/* Email input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={modalEmail}
                      onChange={(e) => {
                        setModalEmail(e.target.value);
                        if (modalEmailError) setModalEmailError("");
                      }}
                      placeholder="Nhập địa chỉ email của bạn..."
                      className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                        modalEmailError ? "border-brand-red focus:ring-brand-red" : "border-slate-200 focus:ring-brand-navy"
                      } rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2`}
                      required
                    />
                  </div>

                  {modalEmailError && (
                    <p className="text-xs text-brand-red font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {modalEmailError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-dark transition-all duration-150 shadow-md disabled:opacity-75 cursor-pointer text-sm"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Gửi tài liệu ngay"
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-400">
                  Miễn phí hoàn toàn • Nhận file ngay trong email
                </p>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckSquare className="w-8 h-8 text-emerald-600" />
                </div>

                <h3 className="font-display font-extrabold text-2xl text-slate-900">
                  Đăng ký thành công!
                </h3>

                <p className="text-slate-600 text-sm">
                  Nguyễn Nam Academy đã gửi email chứa file PDF tài liệu chất lượng cao đến địa chỉ của bạn:
                </p>
                <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl">
                  <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                    {submittedEmail}
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-left space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    Lưu ý kiểm tra hòm thư:
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Vui lòng kiểm tra kỹ hòm thư chính, thư rác (Spam) hoặc hộp thư quảng cáo (Promotions) để tránh bỏ lỡ thư của học viện.
                  </p>
                </div>

                {/* Direct Download Simulation Option */}
                <div className="pt-2 space-y-2">
                  <a
                    href="https://picsum.photos/seed/download/1200/800"
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-navy text-white font-bold shadow-md text-sm hover:bg-brand-navy-dark transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Tải file trực tiếp tại đây
                  </a>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-xs cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">
                  Cảm ơn bạn đã lựa chọn Nguyễn Nam Academy làm người đồng hành!
                </p>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
