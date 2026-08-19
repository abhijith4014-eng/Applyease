// ApplyEase - Master JavaScript Application Engine

// Global State
let currentProfile = null;
let matchedScholarships = [];
let activeCategoryFilter = 'all';

// Dropdown Options Definition (Central Source of Truth)
const CRITERIA_OPTIONS = {
  gender: [
    { value: 'Female', label: 'Female (Unlocks female-only CSR funds)' },
    { value: 'Male', label: 'Male' },
    { value: 'Non-binary', label: 'Non-binary / Other' }
  ],
  course: [
    { value: 'B.Tech CSE', label: 'B.Tech Computer Science & Eng (CSE)' },
    { value: 'B.Tech ECE', label: 'B.Tech Electronics & Comm (ECE/EEE)' },
    { value: 'B.Tech Mech', label: 'B.Tech Mechanical / Civil / Chemical' },
    { value: 'MBBS / BDS', label: 'MBBS / BDS / Medical' },
    { value: 'B.Sc Nursing', label: 'B.Sc Nursing / Paramedical Sciences' },
    { value: 'Polytechnic Diploma', label: 'Polytechnic Diploma (Engineering/Tech)' },
    { value: 'B.Sc CS/IT', label: 'B.Sc Computer Science / IT / BCA' },
    { value: 'B.Com / BBA', label: 'B.Com / BBA / Commerce' },
    { value: 'B.A. / B.Sc', label: 'B.A. / B.Sc / Humanities / Basic Science' },
    { value: 'Higher Secondary', label: 'Higher Secondary / Plus Two (Science/Comm/Arts)' },
    { value: 'M.Tech / MCA', label: 'M.Tech / MCA / M.Sc / Postgraduate' },
    { value: 'Other', label: 'Other Diploma / Professional Course' }
  ],
  year: [
    { value: '1st Year', label: '1st Year / Semester 1 & 2' },
    { value: '2nd Year', label: '2nd Year / Semester 3 & 4' },
    { value: '3rd Year', label: '3rd Year / Semester 5 & 6' },
    { value: '4th Year', label: '4th Year / Semester 7 & 8' },
    { value: 'Postgraduate Year 1', label: 'Postgraduate Year 1' },
    { value: 'Postgraduate Year 2', label: 'Postgraduate Year 2' }
  ],
  collegeType: [
    { value: 'Government', label: 'Government College / University Dept' },
    { value: 'Aided', label: 'Government Aided College' },
    { value: 'Self-Financing', label: 'Self-Financing / Private College' }
  ],
  admissionType: [
    { value: 'Merit Quota', label: 'Merit Quota (KEAM/CAP/Govt Seat)' },
    { value: 'Management Quota', label: 'Management Quota' },
    { value: 'NRI Quota', label: 'NRI Quota' }
  ],
  qualifyingScore: [
    { value: 'Above 90%', label: 'Above 90% (S Grade / CGPA > 9.0)' },
    { value: '80% - 89.9%', label: '80% – 89.9% (CGPA 8.0 – 8.9)' },
    { value: '70% - 79.9%', label: '70% – 79.9% (CGPA 7.0 – 7.9)' },
    { value: '60% - 69.9%', label: '60% – 69.9% (CGPA 6.0 – 6.9)' },
    { value: 'Below 60%', label: 'Below 60%' },
    { value: 'Not Applicable', label: 'Not Applicable' }
  ],
  familyIncome: [
    { value: 'Under ₹1 Lakh', label: 'Under ₹1 Lakh / Year' },
    { value: '₹1L–₹2.5L', label: '₹1.0 Lakh – ₹2.5 Lakh / Year' },
    { value: '₹2.5L–₹8L', label: '₹2.5 Lakh – ₹8.0 Lakh / Year' },
    { value: 'Above ₹8L', label: 'Above ₹8.0 Lakh / Year' }
  ],
  category: [
    { value: 'General', label: 'General Category' },
    { value: 'SC', label: 'SC (Scheduled Caste)' },
    { value: 'ST', label: 'ST (Scheduled Tribe)' },
    { value: 'OEC', label: 'OEC (Other Eligible Communities)' },
    { value: 'OBC', label: 'OBC / SEBC (Other Backward Classes)' },
    { value: 'Minority - Muslim', label: 'Minority Community - Muslim' },
    { value: 'Minority - Christian', label: 'Minority Community - Christian / Other' }
  ],
  singleParent: [
    { value: 'Neither', label: 'Neither (Both Parents Living)' },
    { value: 'Single Mother', label: 'Single Mother (Raised by Mother)' },
    { value: 'Single Father', label: 'Single Father (Raised by Father)' },
    { value: 'Orphan', label: 'Both Parents Deceased / Orphan' }
  ],
  disability: [
    { value: 'None', label: 'None / No Disability' },
    { value: 'Below 40%', label: 'Yes (Below 40% Disability)' },
    { value: '40% or Above', label: 'Yes (40% or Above Disability - Govt Certified)' }
  ],
  parentOccupation: [
    { value: 'Farmer', label: 'Farmer / Agriculturalist' },
    { value: 'Construction Worker', label: 'Construction Worker / Daily Wager / Laborer' },
    { value: 'School Teacher', label: 'School Teacher / Anganwadi Worker' },
    { value: 'Ex-Serviceman', label: 'Ex-Serviceman / Defense / Police' },
    { value: 'Govt Employee', label: 'Government Employee' },
    { value: 'Private Employee', label: 'Private Sector Employee / IT / Corporate' },
    { value: 'Self-Employed', label: 'Small Business / Self-Employed' },
    { value: 'Other', label: 'Unemployed / Other' }
  ]
};

// Scholarship Master Dataset
const MASTER_SCHOLARSHIPS = [
  {
    id: 'dce-suvarna',
    name: 'DCE Suvarna Jubilee Merit Scholarship',
    provider: 'Govt of Kerala (Collegiate Education)',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: '₹10,000 / Year',
    rewardValue: 10000,
    deadline: 'Oct 31, 2026',
    requirements: ['Income < ₹1 Lakh', 'First Year UG Student', 'Govt or Aided College'],
    criteria: {
      years: ['1st Year'],
      collegeTypes: ['Government', 'Aided'],
      familyIncomes: ['Under ₹1 Lakh'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing', 'B.Sc CS/IT', 'B.Com / BBA', 'B.A. / B.Sc', 'M.Tech / MCA', 'Other']
    }
  },
  {
    id: 'egrantz-postmatric',
    name: 'e-Grantz 3.0 Post-Matric Scholarship',
    provider: 'BCDD & SC/ST Dev Dept, Govt of Kerala',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: 'Full Fee Waiver + ₹50,000 Stipend',
    rewardValue: 50000,
    deadline: 'Nov 15, 2026',
    requirements: ['SC / ST / OEC / OBC Category', 'Income < ₹2.5L for OBC (No limit for SC/ST)', 'Merit or Govt Seat'],
    criteria: {
      categories: ['SC', 'ST', 'OEC', 'OBC'],
      admissionTypes: ['Merit Quota']
    }
  },
  {
    id: 'federal-bank-harmire',
    name: 'Federal Bank Hormis Memorial CSR Scholarship',
    provider: 'Federal Bank Corporate CSR',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '100% Tuition Fees (Up to ₹1,0,000/yr)',
    rewardValue: 100000,
    deadline: 'Dec 05, 2026',
    requirements: ['B.Tech / MBBS / Nursing / B.Sc Agri', 'Merit Quota', 'Income < ₹3 Lakhs'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing'],
      admissionTypes: ['Merit Quota'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'tata-stem-girls',
    name: 'Tata Capital STEM Excellence Grant',
    provider: 'Tata Capital Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹50,000 / Year',
    rewardValue: 50000,
    deadline: 'Dec 20, 2026',
    requirements: ['Female Student OR Disability OR Single Parent', 'STEM Professional Degree', 'Income < ₹4.0 Lakhs', 'Marks > 60%'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'Polytechnic Diploma', 'B.Sc CS/IT', 'M.Tech / MCA'],
      qualifyingScores: ['Above 90%', '80% - 89.9%', '70% - 79.9%', '60% - 69.9%'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'moma-minority-mcm',
    name: 'MOMA Merit-cum-Means Minority Scholarship',
    provider: 'Ministry of Minority Affairs, Govt of India',
    type: 'minority',
    categoryTag: 'Minority Grant',
    reward: '₹20,000 / Year + Full Course Fees',
    rewardValue: 30000,
    deadline: 'Nov 30, 2026',
    requirements: ['Muslim / Christian / Minority Community', 'Technical / Professional Course', 'Income < ₹2.5 Lakhs'],
    criteria: {
      categories: ['Minority - Muslim', 'Minority - Christian'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing', 'Polytechnic Diploma', 'B.Sc CS/IT', 'M.Tech / MCA'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'reliance-foundation-ug',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation CSR',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹2,00,000 Total Grant',
    rewardValue: 200000,
    deadline: 'Jan 15, 2027',
    requirements: ['1st Year Undergraduate Student', 'CGPA / Percentage > 75%', 'Income < ₹8.0 Lakhs'],
    criteria: {
      years: ['1st Year'],
      qualifyingScores: ['Above 90%', '80% - 89.9%', '70% - 79.9%'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing', 'Polytechnic Diploma', 'B.Sc CS/IT', 'B.Com / BBA', 'B.A. / B.Sc', 'Other']
    }
  },
  {
    id: 'infosys-sankalp',
    name: 'Infosys Foundation SANKALP Tech Scholarship',
    provider: 'Infosys CSR Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹75,000 / Year',
    rewardValue: 75000,
    deadline: 'Dec 10, 2026',
    requirements: ['B.Tech / MCA / B.Sc IT', 'Single Parent OR Farmer / Daily Wager Parent', 'Marks > 70%'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'B.Sc CS/IT', 'M.Tech / MCA'],
      qualifyingScores: ['Above 90%', '80% - 89.9%', '70% - 79.9%']
    }
  },
  {
    id: 'aicte-pragati',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'AICTE, Ministry of Education, India',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: '₹50,000 / Year',
    rewardValue: 50000,
    deadline: 'Oct 31, 2026',
    requirements: ['Female Students Only', '1st Year B.Tech / Diploma', 'Income < ₹8.0 Lakhs'],
    criteria: {
      genders: ['Female'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'Polytechnic Diploma'],
      years: ['1st Year', '2nd Year'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'aicte-saksham',
    name: 'AICTE Saksham Scholarship for PWD Students',
    provider: 'AICTE, Ministry of Education, India',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: '₹50,000 / Year',
    rewardValue: 50000,
    deadline: 'Oct 31, 2026',
    requirements: ['Physical Disability (40% or Above certified)', 'Technical Degree / Diploma Student', 'Income < ₹8.0 Lakhs'],
    criteria: {
      disabilities: ['40% or Above'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'Polytechnic Diploma', 'B.Sc CS/IT', 'M.Tech / MCA'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'snehapoorvam-kerala',
    name: 'Snehapoorvam Orphan Welfare Assistance',
    provider: 'Social Security Mission, Govt of Kerala',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: '₹10,000 / Year',
    rewardValue: 10000,
    deadline: 'Nov 30, 2026',
    requirements: ['Single Parent (Father/Mother Deceased) OR Orphan', 'Income < ₹1 Lakh'],
    criteria: {
      singleParent: ['Single Mother', 'Single Father', 'Orphan'],
      familyIncomes: ['Under ₹1 Lakh']
    }
  },
  {
    id: 'bocww-construction-grant',
    name: 'Construction Workers Welfare Board Grant',
    provider: 'Kerala Labor Welfare Board',
    type: 'govt',
    categoryTag: 'Government Grant',
    reward: '₹25,000 / Year',
    rewardValue: 25000,
    deadline: 'Dec 31, 2026',
    requirements: ['Parent must be Construction Worker / Daily Wager'],
    criteria: {
      parentOccupations: ['Construction Worker']
    }
  }
];

// Dynamic Hero Quote Rotator
const HERO_QUOTES = [
  "Your Gateway to Stress-Free Scholarships",
  "Simplify Applications, Secure Your Funding"
];
let currentQuoteIndex = 0;

function initQuoteRotator() {
  const quoteEl = document.getElementById('heroQuote');
  if (!quoteEl) return;

  setInterval(() => {
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(6px)';

    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % HERO_QUOTES.length;
      quoteEl.innerText = HERO_QUOTES[currentQuoteIndex];
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 500);
  }, 3500);
}

function populateDropdowns() {
  for (const [fieldId, options] of Object.entries(CRITERIA_OPTIONS)) {
    const selectEl = document.getElementById(fieldId);
    if (!selectEl) continue;
    
    // Keep only the placeholder option
    const placeholder = selectEl.options[0];
    selectEl.innerHTML = '';
    if (placeholder) {
      selectEl.appendChild(placeholder);
    }
    
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      selectEl.appendChild(optionEl);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initQuoteRotator();
  populateDropdowns();
});

// Mobile Menu Toggler
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('mobile-open');
  }
}

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.remove('mobile-open');
  }
}

// Helper UI functions
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Standarized criteria evaluation engine
function checkScholarshipEligibility(profile, scholarship) {
  const criteria = scholarship.criteria;
  if (!criteria) return false;

  const isMatch = (val, allowed) => {
    if (!allowed || allowed.length === 0) return true;
    return allowed.includes(val);
  };

  // Simple strict field checking
  if (!isMatch(profile.gender, criteria.genders)) return false;
  if (!isMatch(profile.course, criteria.courses)) return false;
  if (!isMatch(profile.year, criteria.years)) return false;
  if (!isMatch(profile.collegeType, criteria.collegeTypes)) return false;
  if (!isMatch(profile.admissionType, criteria.admissionTypes)) return false;
  if (!isMatch(profile.qualifyingScore, criteria.qualifyingScores)) return false;
  if (!isMatch(profile.category, criteria.categories)) return false;
  if (!isMatch(profile.singleParent, criteria.singleParent)) return false;
  if (!isMatch(profile.disability, criteria.disabilities)) return false;
  if (!isMatch(profile.parentOccupation, criteria.parentOccupations)) return false;

  // Special/Conditional Rules
  
  // 1. e-Grantz category-specific income rule (OBC has income limit, SC/ST/OEC do not)
  if (scholarship.id === 'egrantz-postmatric') {
    if (profile.category === 'OBC') {
      if (!['Under ₹1 Lakh', '₹1L–₹2.5L'].includes(profile.familyIncome)) {
        return false;
      }
    }
  } else {
    // Standard family income validation for all other scholarships
    if (!isMatch(profile.familyIncome, criteria.familyIncomes)) return false;
  }

  // 2. Tata STEM Excellence rule: Female OR Disability OR Single Parent
  if (scholarship.id === 'tata-stem-girls') {
    const isFemale = profile.gender === 'Female';
    const hasDisability = profile.disability !== 'None';
    const hasSingleParent = profile.singleParent !== 'Neither';
    if (!isFemale && !hasDisability && !hasSingleParent) {
      return false;
    }
  }

  // 3. Infosys SANKALP rule: Single Parent OR Farmer/Construction Worker parent
  if (scholarship.id === 'infosys-sankalp') {
    const hasSingleParent = profile.singleParent !== 'Neither';
    const hasTargetParentOcc = ['Farmer', 'Construction Worker'].includes(profile.parentOccupation);
    if (!hasSingleParent && !hasTargetParentOcc) {
      return false;
    }
  }

  return true;
}

// Criteria Form Handler
function handleCriteriaSubmit(e) {
  e.preventDefault();
  
  // Extract values
  currentProfile = {
    gender: document.getElementById('gender').value,
    course: document.getElementById('course').value,
    year: document.getElementById('year').value,
    collegeType: document.getElementById('collegeType').value,
    admissionType: document.getElementById('admissionType').value,
    qualifyingScore: document.getElementById('qualifyingScore').value,
    familyIncome: document.getElementById('familyIncome').value,
    category: document.getElementById('category').value,
    singleParent: document.getElementById('singleParent').value,
    disability: document.getElementById('disability').value,
    parentOccupation: document.getElementById('parentOccupation').value
  };

  // Run matching algorithm
  matchedScholarships = [];
  MASTER_SCHOLARSHIPS.forEach(sch => {
    if (checkScholarshipEligibility(currentProfile, sch)) {
      matchedScholarships.push({
        ...sch,
        matchScore: 100 // Meets all criteria perfectly
      });
    }
  });

  // Sort by highest rewardValue (primary) and alphabetically by name (secondary tie-breaker)
  matchedScholarships.sort((a, b) => {
    if (b.rewardValue !== a.rewardValue) {
      return b.rewardValue - a.rewardValue;
    }
    return a.name.localeCompare(b.name);
  });

  // Update UI
  renderResults();
  
  // Reveal and smooth scroll to results
  const resultsSection = document.getElementById('results');
  resultsSection.style.display = 'block';
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// Render Results Grid
function renderResults() {
  const grid = document.getElementById('scholarshipGrid');
  const countEl = document.getElementById('matchCount');
  
  let listToRender = matchedScholarships;
  if (activeCategoryFilter !== 'all') {
    listToRender = matchedScholarships.filter(s => s.type === activeCategoryFilter);
  }

  countEl.innerText = listToRender.length;
  grid.innerHTML = '';

  if (listToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 16px; border: 1px solid var(--sky-border);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">No Exact Matches for Selected Filter</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try selecting "All Schemes" or adjusting your background details in the criteria form.</p>
      </div>
    `;
    return;
  }

  listToRender.forEach(sch => {
    const is100 = sch.matchScore >= 90;
    const cardHtml = `
      <div class="scholarship-card">
        <div>
          <div class="card-top">
            <span class="provider-badge">${sch.categoryTag}</span>
            <span class="match-badge ${is100 ? 'match-100' : 'match-high'}">
              ${is100 ? '🎯 100% Eligible' : '🌟 High Match (' + sch.matchScore + '%)'}
            </span>
          </div>
          <h3 class="scholarship-name">${sch.name}</h3>
          <div class="scholarship-org">${sch.provider}</div>
          
          <div class="reward-box">
            <div>
              <div class="reward-label">GRANT AMOUNT</div>
              <div class="reward-amount">${sch.reward}</div>
            </div>
            <div class="deadline-tag">⏰ ${sch.deadline}</div>
          </div>

          <div class="criteria-tags">
            ${sch.requirements.map(req => `<span class="tag-mini">✓ ${req}</span>`).join('')}
          </div>
        </div>

        <div class="card-actions">
          <button class="btn-card-primary" style="width: 100%;" onclick="openGuidanceModal('${sch.id}')">Requirements & Apply Guidance</button>
        </div>
      </div>
    `;
    grid.innerHTML += cardHtml;
  });
}

// Category Filter Pills
function filterResults(category, btn) {
  activeCategoryFilter = category;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderResults();
}

// APPLYEASE EXPORTER: Generate Text File + Redirect to WhatsApp (+91 8589097195)
function handleApplyEaseExport() {
  if (!currentProfile) {
    alert('Please fill out the "Find My Scholarships" form first!');
    scrollToSection('criteria-form');
    return;
  }

  const phone = '918589097195';
  
  // Build formatted profile text
  let summaryText = `=======================================\n`;
  summaryText += `       APPLYEASE SCHOLARSHIP PROFILE\n`;
  summaryText += `=======================================\n\n`;
  summaryText += `STUDENT CRITERIA DETAILS:\n`;
  summaryText += `• Gender: ${currentProfile.gender}\n`;
  summaryText += `• Course & Branch: ${currentProfile.course}\n`;
  summaryText += `• Year of Study: ${currentProfile.year}\n`;
  summaryText += `• Institution Type: ${currentProfile.collegeType}\n`;
  summaryText += `• Admission Type: ${currentProfile.admissionType}\n`;
  summaryText += `• Qualifying Score: ${currentProfile.qualifyingScore}\n`;
  summaryText += `• Annual Family Income: ${currentProfile.familyIncome}\n`;
  summaryText += `• Category / Caste: ${currentProfile.category}\n`;
  summaryText += `• Single Parent / Orphan: ${currentProfile.singleParent}\n`;
  summaryText += `• Disability (PWD): ${currentProfile.disability}\n`;
  summaryText += `• Parent's Occupation: ${currentProfile.parentOccupation}\n\n`;

  summaryText += `MATCHED SCHOLARSHIPS (${matchedScholarships.length} Found):\n`;
  matchedScholarships.forEach((s, idx) => {
    summaryText += `${idx + 1}. ${s.name}\n   Provider: ${s.provider}\n   Reward: ${s.reward} | Deadline: ${s.deadline}\n\n`;
  });
  
  summaryText += `=======================================\n`;
  summaryText += `Sent via ApplyEase Assistance Portal\n`;
  summaryText += `=======================================`;

  // 1. Download Text File
  const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `ApplyEase_Scholarship_Summary.txt`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // 2. Open WhatsApp link directly with prefilled text
  const encodedMsg = encodeURIComponent(summaryText);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank');
}

// Guidance Modal Logic
function openGuidanceModal(schId) {
  const modal = document.getElementById('guidanceModal');
  const title = document.getElementById('modalTitle');
  const bodyText = document.getElementById('modalBodyText');

  const scheme = MASTER_SCHOLARSHIPS.find(s => s.id === schId);

  if (scheme) {
    title.innerText = scheme.name;
    bodyText.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span class="provider-badge">${scheme.categoryTag}</span>
        <span style="font-weight: 700; color: var(--primary-sky); margin-left: 0.5rem;">${scheme.reward}</span>
      </div>
      <p style="margin-bottom: 1rem; color: var(--text-main); font-weight: 600;">Provider: ${scheme.provider}</p>
      
      <h4 style="color: var(--text-main); font-weight: 800; margin-bottom: 0.5rem;">Key Eligibility Criteria:</h4>
      <ul style="padding-left: 1.25rem; margin-bottom: 1.25rem; line-height: 1.7;">
        ${scheme.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>

      <div style="background: var(--sky-ice); border: 1px solid var(--sky-border); border-radius: 12px; padding: 1rem; margin-top: 1rem;">
        <strong style="color: var(--primary-sky);">How to Apply:</strong>
        <p style="margin-top: 0.3rem; font-size: 0.9rem;">Submit your details using the <strong>ApplyEase</strong> button at the bottom of the page to download your text summary and receive 1-on-1 counselor guidance on WhatsApp (+91 8589097195)!</p>
      </div>
    `;
  } else {
    title.innerText = 'Scholarship Assistance';
    bodyText.innerHTML = `
      <p>Fill out the "Find My Scholarships" form to sort out all eligible grants, then click the <strong>ApplyEase</strong> button at the bottom of the results for WhatsApp application assistance!</p>
    `;
  }

  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeGuidanceModal() {
  const modal = document.getElementById('guidanceModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.classList.remove('modal-open');
}

// Chatbot Widget Logic
function toggleChat() {
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('active');
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msgs = document.getElementById('chatMessages');
  const text = input.value.trim();

  if (!text) return;

  // Add User Msg
  msgs.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = '';

  // Auto scroll
  msgs.scrollTop = msgs.scrollHeight;

  // Generate Response
  setTimeout(() => {
    let reply = "ApplyEase provides complete guidance! Fill out the scholarship form and click the 'ApplyEase' button to get 1-on-1 WhatsApp assistance at +91 8589097195.";
    const lower = text.toLowerCase();
    
    if (lower.includes('income') || lower.includes('limit')) {
      reply = "For DCE Suvarna Jubilee & e-Grantz OBC, income limit is ₹1 Lakh & ₹2.5 Lakhs respectively. SC/ST students have no upper income limit for e-Grantz!";
    } else if (lower.includes('egrantz') || lower.includes('e-grantz')) {
      reply = "e-Grantz 3.0 is Kerala's unified portal for Post-Matric scholarships for SC, ST, OEC, and OBC students. Requires Aadhaar-linked Bank account!";
    } else if (lower.includes('document') || lower.includes('proof') || lower.includes('tip') || lower.includes('rule')) {
      reply = "Check the Application Pro-Tips section at the bottom of the page for key rules on bank account seeding, income certificate, marksheets, and scan preparation!";
    } else if (lower.includes('whatsapp') || lower.includes('contact')) {
      reply = "You can directly text your scholarship details to our counselor at +91 8589097195 using the ApplyEase button below the results!";
    }

    msgs.innerHTML += `<div class="msg bot">${reply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
}
