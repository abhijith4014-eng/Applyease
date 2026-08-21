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
  deadline: 'Nov 30, 2026',
  requirements: ['BPL Family', 'First Year UG/PG Student', 'Govt or Aided College', 'Min 50% Marks'],
  criteria: {
    years: ['1st Year'],
    collegeTypes: ['Government', 'Aided'],
    familyIncomes: ['Under ₹1 Lakh']
  }
},
  {
  id: 'egrantz-postmatric',
  name: 'E-Grantz 3.0 Post-Matric Scholarship',
  provider: 'Govt of Kerala (SC/ST/OBC Development Depts)',
  type: 'govt',
  categoryTag: 'Government Grant',
  reward: '₹100 - ₹1,500 / Month',
  rewardValue: 1500,
  deadline: 'Nov 30, 2026',
  requirements: ['SC/ST/OEC/OBC Category', 'Domicile of Kerala', 'Min 75% Attendance', 'Merit or Reservation Quota Admission'],
  criteria: {
    collegeTypes: ['Government', 'Aided', 'Self-Financing'],
    familyIncomes: ['Under ₹1 Lakh'],
    categories: ['SC', 'ST', 'OEC', 'OBC']
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
  },
  {
    id: 'ffe-scholarship',
    name: 'Foundation for Excellence (FFE) Scholarship',
    provider: 'Foundation For Excellence India Trust',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹40,000 - ₹50,000 / Year',
    rewardValue: 50000,
    deadline: 'Varies (Check Official Site)',
    requirements: ['1st Year BE/B.Tech, Integrated M.Tech, MBBS or 5-Yr Law', 'Min 70% in Class 12', 'Income < ₹3 Lakhs', 'Qualify via State/National Entrance Exam'],
    criteria: {
      years: ['1st Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'hdfc-parivartan-ecss',
    name: 'HDFC Bank Parivartan ECSS Programme',
    provider: 'HDFC Bank Parivartan (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹15,000 - ₹75,000 (By Course Level)',
    rewardValue: 75000,
    deadline: 'Aug 31, 2026',
    requirements: ['Class 1 to PG / Diploma / ITI / Polytechnic', 'Min 55% Marks', 'Income ≤ ₹2.5 Lakhs', 'Preference: Personal or Family Crisis'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'tata-capital-pankh',
    name: 'Tata Capital Pankh Scholarship Programme',
    provider: 'Tata Capital Limited (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹10,000 - ₹1,00,000 (Up to 80% of Tuition)',
    rewardValue: 100000,
    deadline: 'Sep 30, 2026',
    requirements: ['Class 11 to UG / Diploma / PG', 'Min 60% Marks (80% for Professional Courses)', 'Income ≤ ₹2.5 - 4 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'kotak-kanya',
    name: 'Kotak Kanya Scholarship',
    provider: 'Kotak Education Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹1,50,000 / Year',
    rewardValue: 150000,
    deadline: 'Aug 20, 2026',
    requirements: ['Female Student', '1st Year Professional UG (Engg/MBBS/Law/Design/Architecture)', 'Min 75% in Class 12', 'Income < ₹6 Lakhs'],
    criteria: {
      genders: ['Female'],
      years: ['1st Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'kotak-suraksha',
    name: 'Kotak Suraksha Scholarship Programme',
    provider: 'Kotak Securities / Kotak Education Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹1,00,000 / Year',
    rewardValue: 100000,
    deadline: 'Jan 23, 2027',
    requirements: ['Persons with Disabilities (PwD)', 'Class 9-12 or UG Student', 'Min 55% Marks', 'Income < ₹3.2 Lakhs'],
    criteria: {
      disabilities: ['Below 40%', '40% or Above'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'panasonic-ratti-chhatr',
    name: 'Panasonic Ratti Chhatr Scholarship',
    provider: 'Panasonic Life Solutions India (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹70,250 / Year (4 Years)',
    rewardValue: 70250,
    deadline: 'Aug 20, 2026',
    requirements: ['1st Year B.E./B.Tech at an IIT Only', 'Min 75% in Class 12', 'Income ≤ ₹8 Lakhs'],
    criteria: {
      years: ['1st Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'aditya-birla-capital',
    name: 'Aditya Birla Capital Scholarship',
    provider: 'Aditya Birla Capital Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹60,000 (One-time)',
    rewardValue: 60000,
    deadline: 'Dec 07, 2026',
    requirements: ['Female Student', 'Class 9 to PG', 'Min 60% Marks', 'Income ≤ ₹6 Lakhs'],
    criteria: {
      genders: ['Female'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'sitaram-jindal-scholarship',
    name: 'Sitaram Jindal Foundation Scholarship',
    provider: 'Sitaram Jindal Foundation',
    type: 'csr',
    categoryTag: 'NGO Grant',
    reward: '₹500 - ₹3,200 / Month',
    rewardValue: 38400,
    deadline: 'Round the Year (Rolling)',
    requirements: ['Class 11 to PG (Govt/Aided/Affordable Private)', 'Min 50-65% Marks (Relaxed for Girls)', 'Income < ₹2.5 - 4 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'mea-houston-scholarship',
    name: 'Malayalee Engineers\' Association (MEA) Houston Scholarship',
    provider: 'Malayalee Engineers\' Association, Houston (USA)',
    type: 'csr',
    categoryTag: 'NGO Grant',
    reward: 'USD 600 / Year (~₹52,000)',
    rewardValue: 52000,
    deadline: 'Nov 30, 2026',
    requirements: ['Kerala Origin Student Only', '1st Year Engineering/Tech/CS/Architecture', 'Top 7000 Rank in KEAM or NATA', 'Income < ₹1.5 Lakhs'],
    criteria: {
      years: ['1st Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh']
    }
  },
  {
    id: 'santoor-scholarship',
    name: 'Santoor Scholarship Programme',
    provider: 'Wipro Consumer Care & Wipro Cares (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹30,000 (One-time)',
    rewardValue: 30000,
    deadline: 'Oct 15, 2026',
    requirements: ['Female Student Only', '1st Year UG (Andhra Pradesh / Maharashtra)', 'Class 10 & 12 from Govt School'],
    criteria: {
      genders: ['Female'],
      years: ['1st Year']
    }
  },
  {
    id: 'virtusa-engineering-excellence',
    name: 'Virtusa Engineering Excellence Scholarship',
    provider: 'Virtusa Foundation',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹50,000 / Year',
    rewardValue: 50000,
    deadline: 'Jan 31, 2027',
    requirements: ['1st or 2nd Year B.E./B.Tech', 'Min 70% in Class 12', 'Income < ₹6 Lakhs'],
    criteria: {
      years: ['1st Year', '2nd Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'jk-tyre-shiksha-sarthi',
    name: 'JK Tyre Shiksha Sarthi Scholarship',
    provider: 'JK Tyre & Industries Ltd (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹15,000 - ₹25,000 (One-time)',
    rewardValue: 25000,
    deadline: 'Sep 10, 2026',
    requirements: ['Female, Daughter of Heavy Vehicle (HMV) Driver', 'UG or Diploma Student', 'Min 55% Marks', 'Income ≤ ₹5 Lakhs', 'Resident of Rajasthan/MP/Uttarakhand/Karnataka/Tamil Nadu'],
    criteria: {
      genders: ['Female'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'sbif-asha-scholarship',
    name: 'SBIF Asha Scholarship Programme',
    provider: 'SBI Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹15,000 - ₹20,00,000 (Class 6 to Overseas)',
    rewardValue: 200000,
    deadline: 'Oct 01, 2026',
    requirements: ['Class 6 to PG / IIT / IIM / Overseas', 'Min 75% Marks', 'Income ≤ ₹3 - 6 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'nsdl-shiksha-sahyog',
    name: 'NSDL Shiksha Sahyog Scholarship',
    provider: 'National Securities Depository Ltd (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹12,000 / Year',
    rewardValue: 12000,
    deadline: 'Oct 01, 2026',
    requirements: ['Class 11 to PG', 'Min 60% Marks', 'Income < ₹3 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'redington-sahayog',
    name: 'Redington Foundation Sahayog Scholarship',
    provider: 'Redington Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹15,000 / Year',
    rewardValue: 15000,
    deadline: 'Feb 07, 2027',
    requirements: ['1st Year UG (Any Stream)', 'Min 60% in Class 12', 'Income < ₹5 Lakhs'],
    criteria: {
      years: ['1st Year'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'wagh-bakri-scholarship',
    name: 'Wagh Bakri Foundation Scholarship',
    provider: 'Wagh Bakri Tea Group (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹20,000 - ₹75,000 (Course-Based)',
    rewardValue: 75000,
    deadline: 'Aug 31, 2026',
    requirements: ['Diploma / B.E./B.Tech / MBBS / BDS / Nursing / B.Ed', 'Min 50% in Class 10 & 12', 'Income < ₹5 Lakhs', 'Gujarat Residents Only'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing', 'Polytechnic Diploma'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'colgate-keep-india-smiling',
    name: 'Keep India Smiling Foundational Scholarship (Colgate-Palmolive)',
    provider: 'Colgate-Palmolive (India) Limited (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹75,000 (Course-Based)',
    rewardValue: 75000,
    deadline: 'Feb 18, 2027',
    requirements: ['Class 11, UG, Engineering, Vocational Course or Sportsperson', 'Income < ₹5 - 8 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'lt-build-india',
    name: 'L&T Build-India Scholarship',
    provider: 'Larsen & Toubro Construction (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹13,400 / Month for 24 Months (₹3,21,600 Total + Sponsored M.Tech)',
    rewardValue: 321600,
    deadline: 'Mar 12, 2027',
    requirements: ['Final Year B.E./B.Tech (Core Civil or Electrical Only)', 'Min 70% or 7.0 CGPA', 'Sponsored M.Tech (CT&M) at IIT/NIT + 5-Year Service Bond'],
    criteria: {}
  },
  {
    id: 'siemens-scholarship',
    name: 'Siemens Scholarship Programme',
    provider: 'Siemens India (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Tuition Reimbursement + ₹20,000/Year Allowance (4 Years)',
    rewardValue: 120000,
    deadline: 'Sep 30, 2026',
    requirements: ['1st Year B.Tech at a Govt Engineering College', 'Age ≤ 20', 'Min 60% in Class 10, PCM 60% in Class 12', 'Income ≤ ₹2 Lakhs'],
    criteria: {
      years: ['1st Year'],
      collegeTypes: ['Government'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'google-generation-scholarship',
    name: 'Google Generation Scholarship (APAC)',
    provider: 'Google.org',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'USD 2,500 (~₹2,10,000, One-time)',
    rewardValue: 210000,
    deadline: 'Aug 31, 2026',
    requirements: ['Female Student', '2nd or 3rd Year UG in Computer Science / Related Field', 'Demonstrated Financial Need', 'Essay + Resume Required'],
    criteria: {
      genders: ['Female'],
      years: ['2nd Year', '3rd Year'],
      courses: ['B.Sc CS/IT', 'B.Tech CSE']
    }
  },
  {
    id: 'muthoot-m-george',
    name: 'Muthoot M George Higher Education Scholarship',
    provider: 'Muthoot M George Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹1,20,000 - ₹2,40,000 (Course-Based)',
    rewardValue: 240000,
    deadline: 'Nov 30, 2026',
    requirements: ['MBBS / B.Tech / B.Sc Nursing Student', 'Min 80% in Class 12', 'Income ≤ ₹2 Lakhs', 'Resident of Kerala or Select Metro Cities'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'hpcl-scholarship',
    name: 'HPCL Educational Scholarship',
    provider: 'Hindustan Petroleum Corporation Limited (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Merit-Based Award (Amount Varies by Class/Year)',
    rewardValue: 20000,
    deadline: 'Varies (Check Official Site)',
    requirements: ['SC / ST / OBC / PWD Category Only', 'Class 12 to Graduation/PG', 'Min 45% Marks', 'Income ≤ ₹2.5 Lakhs'],
    criteria: {
      categories: ['SC', 'ST', 'OBC'],
      disabilities: ['Below 40%', '40% or Above'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L']
    }
  },
  {
    id: 'ongc-foundation-scholarship',
    name: 'ONGC Foundation Scholarship',
    provider: 'ONGC Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹48,000 / Year',
    rewardValue: 48000,
    deadline: 'May 15, 2027',
    requirements: ['SC / ST / OBC / General-EWS', '1st Year Engineering / MBBS / MBA / M.Sc Geology-Geophysics', 'Min 60% Marks', 'Income ≤ ₹2 - 4.5 Lakhs'],
    criteria: {
      categories: ['SC', 'ST', 'OBC', 'General'],
      years: ['1st Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'schindler-igniting-minds',
    name: 'Schindler Igniting Minds (SIM) Scholarship',
    provider: 'Schindler India Pvt Ltd (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹20,000 - ₹75,000 (Course-Based)',
    rewardValue: 75000,
    deadline: 'Jan 17, 2027',
    requirements: ['ITI / Diploma / B.E./B.Tech Student', 'Min 50-70% Marks', 'Income < ₹3 - 5 Lakhs'],
    criteria: {
      courses: ['Polytechnic Diploma', 'B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'jsw-udaan-scholarship',
    name: 'JSW UDAAN Scholarship',
    provider: 'JSW Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹10,000 - ₹60,000 (Course-Based)',
    rewardValue: 60000,
    deadline: 'Feb 28, 2027',
    requirements: ['ITI / Diploma / UG / PG Student', 'Min 50-60% Marks', 'Income < ₹8 Lakhs', 'Preference: Near JSW Plant Locations'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'transunion-cibil-scholarship',
    name: 'TransUnion CIBIL Scholarship',
    provider: 'TransUnion CIBIL (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹40,000 (Course-Based)',
    rewardValue: 40000,
    deadline: 'Nov 30, 2026',
    requirements: ['Female Student Only', 'B.E./B.Tech / BDS / MCA / Pharmacy / Nursing', 'Min 65% in Class 12', 'Income < ₹3 - 10 Lakhs'],
    criteria: {
      genders: ['Female'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'MBBS / BDS', 'B.Sc Nursing'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'timken-india-scholarship',
    name: 'Timken India Scholarship',
    provider: 'Timken Engineering & Research India Pvt Ltd (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹10,000 - ₹50,000 (Course-Based)',
    rewardValue: 50000,
    deadline: 'Dec 31, 2026',
    requirements: ['ITI / Diploma / B.E./B.Tech / B.Sc Nursing', 'Min 35-50% Marks', 'Income < ₹8 Lakhs', 'Preference: Pune/Chennai/Jamshedpur/Bharuch Region'],
    criteria: {
      courses: ['Polytechnic Diploma', 'B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'B.Sc Nursing'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'rbl-bank-shiksha',
    name: 'RBL Bank Shiksha Scholarship',
    provider: 'RBL Bank (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹20,000 / Year (Up to ₹60,000 over 3 Years)',
    rewardValue: 20000,
    deadline: 'Feb 28, 2027',
    requirements: ['1st Year of a 3-Year UG Course', 'Min 60% in Class 10 & 12', 'Income < ₹4 Lakhs'],
    criteria: {
      years: ['1st Year'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'alkem-shri-samprada-singh',
    name: 'Alkem Foundation Scholarship (Shri Samprada Singh Programme)',
    provider: 'Alkem Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹30,000 - ₹70,000 (Class-Based)',
    rewardValue: 70000,
    deadline: 'Varies (Check Official Site)',
    requirements: ['Class 2 to UG/Diploma Student', 'Family Affected by a Death or Health Crisis', 'Min 35% Marks'],
    criteria: {}
  },
  {
    id: 'astral-foundation-scholarship',
    name: 'Astral Foundation Scholarship',
    provider: 'Astral Limited (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹10,000 - ₹40,000 (Course-Based)',
    rewardValue: 40000,
    deadline: 'Aug 29, 2026',
    requirements: ['UG / B.E./B.Tech / B.Ed / Diploma Student', 'Min 50% in Class 10 & 12', 'Income < ₹5 Lakhs'],
    criteria: {
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'arvind-foundation-scholarship',
    name: 'Arvind Foundation Scholarship',
    provider: 'Arvind Limited (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹5,000 - ₹40,000 (Class-Based)',
    rewardValue: 40000,
    deadline: 'Jan 30, 2027',
    requirements: ['Class 11 to PG (Incl. ITI/Diploma)', 'Min 50% in Class 10', 'Income < ₹5 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'eaton-india-vidyavikas',
    name: 'Eaton India Foundation Scholarship (VidyaVikas Programme)',
    provider: 'Eaton India Foundation (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: 'Up to ₹75,000 / Year',
    rewardValue: 75000,
    deadline: 'Dec 31, 2026',
    requirements: ['UG Student (BBA/BCA/B.Com/B.Sc/B.A/B.E./B.Tech)', 'Min 35% Marks', 'Income < ₹5 Lakhs'],
    criteria: {
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
    }
  },
  {
    id: 'vivo-kanyagyaan-scholarship',
    name: 'Vivo Mobile India CSR Scholarship (KanyaGyaan Programme)',
    provider: 'Vigour Mobile India Pvt Ltd / vivo India (CSR)',
    type: 'csr',
    categoryTag: 'Corporate CSR',
    reward: '₹60,000 / Year (Renewable up to 3 Years)',
    rewardValue: 60000,
    deadline: 'Mar 03, 2027',
    requirements: ['Female Student Only', '1st or 2nd Year STEM UG', 'Min 70% Marks', 'Income ≤ ₹5 Lakhs'],
    criteria: {
      genders: ['Female'],
      years: ['1st Year', '2nd Year'],
      courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'B.Sc CS/IT'],
      familyIncomes: ['Under ₹1 Lakh', '₹1L–₹2.5L', '₹2.5L–₹8L']
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
