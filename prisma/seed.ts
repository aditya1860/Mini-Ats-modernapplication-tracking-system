import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const STAGES = ['Applied', 'Screening', 'Interview', 'Technical Round', 'Offer', 'Hired', 'Rejected']
const SOURCES = ['LinkedIn', 'Referral', 'Job Board', 'Website', 'Other']

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear
  await prisma.interviewNote.deleteMany()
  await prisma.stageHistory.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()

  // Create recruiter
  const recruiter = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'recruiter@miniats.com',
      passwordHash: await bcrypt.hash('Demo@1234', 12),
      role: 'RECRUITER',
    },
  })

  // Create jobs
  const jobs = await Promise.all([
    prisma.job.create({ data: { title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Open', description: 'We are looking for a Senior Software Engineer to join our core platform team. You will design, build, and maintain critical infrastructure serving millions of users.', createdAt: daysAgo(60) } }),
    prisma.job.create({ data: { title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time', status: 'Open', description: 'Drive the product roadmap for our consumer-facing applications. Work closely with engineering, design, and go-to-market teams to ship features that delight users.', createdAt: daysAgo(55) } }),
    prisma.job.create({ data: { title: 'UX Designer', department: 'Design', location: 'Austin, TX', type: 'Full-time', status: 'Open', description: 'Create beautiful, accessible user experiences across our product suite. You will own end-to-end design from research and wireframes to final pixel-perfect specs.', createdAt: daysAgo(45) } }),
    prisma.job.create({ data: { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Open', description: 'Own our cloud infrastructure on AWS. Implement CI/CD pipelines, manage Kubernetes clusters, and drive reliability and security best practices.', createdAt: daysAgo(40) } }),
    prisma.job.create({ data: { title: 'Marketing Manager', department: 'Marketing', location: 'San Francisco, CA', type: 'Full-time', status: 'Open', description: 'Lead growth marketing initiatives including SEO, paid acquisition, and lifecycle campaigns. Own the funnel from awareness to conversion.', createdAt: daysAgo(30) } }),
    prisma.job.create({ data: { title: 'Data Analyst', department: 'Engineering', location: 'Remote', type: 'Contract', status: 'Closed', description: 'Analyze large datasets to provide actionable insights to product and business teams. Build dashboards, run experiments, and support data-driven decision making.', createdAt: daysAgo(25) } }),
  ])

  // Candidate data
  const candidateData = [
    // Applied (6)
    { fullName: 'Liam Johnson', email: 'liam.j@email.com', phone: '+1-555-0101', currentRole: 'Software Engineer', currentCompany: 'StartupXYZ', experienceYears: 4, skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'], source: 'LinkedIn', expectedSalary: 130000, location: 'Remote', stage: 'Applied', rating: 0, jobIndex: 0, daysAgoCreated: 5 },
    { fullName: 'Sophia Martinez', email: 'sophia.m@email.com', phone: '+1-555-0102', currentRole: 'Product Designer', currentCompany: 'DesignCo', experienceYears: 3, skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'], source: 'Website', expectedSalary: 95000, location: 'Austin, TX', stage: 'Applied', rating: 0, jobIndex: 2, daysAgoCreated: 3 },
    { fullName: 'Noah Williams', email: 'noah.w@email.com', phone: '+1-555-0103', currentRole: 'Junior DevOps', currentCompany: 'CloudBase', experienceYears: 2, skills: ['AWS', 'Docker', 'Terraform', 'Python'], source: 'Job Board', expectedSalary: 85000, location: 'Remote', stage: 'Applied', rating: 0, jobIndex: 3, daysAgoCreated: 4 },
    { fullName: 'Emma Davis', email: 'emma.d@email.com', phone: '+1-555-0104', currentRole: 'Marketing Specialist', currentCompany: 'GrowthAgency', experienceYears: 5, skills: ['SEO', 'Google Ads', 'HubSpot', 'Analytics'], source: 'LinkedIn', expectedSalary: 90000, location: 'San Francisco, CA', stage: 'Applied', rating: 0, jobIndex: 4, daysAgoCreated: 2 },
    { fullName: 'Oliver Brown', email: 'oliver.b@email.com', phone: '+1-555-0105', currentRole: 'Full Stack Developer', currentCompany: 'WebWorks', experienceYears: 6, skills: ['Vue.js', 'Python', 'Django', 'MySQL'], source: 'Referral', expectedSalary: 125000, location: 'Remote', stage: 'Applied', rating: 0, jobIndex: 0, daysAgoCreated: 1 },
    { fullName: 'Ava Wilson', email: 'ava.w@email.com', phone: '+1-555-0106', currentRole: 'Data Scientist', currentCompany: 'DataDriven', experienceYears: 4, skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'], source: 'Job Board', expectedSalary: 115000, location: 'Remote', stage: 'Applied', rating: 0, jobIndex: 5, daysAgoCreated: 2 },
    // Screening (7)
    { fullName: 'James Taylor', email: 'james.t@email.com', phone: '+1-555-0107', currentRole: 'Backend Engineer', currentCompany: 'ApiFirst', experienceYears: 5, skills: ['Go', 'gRPC', 'Kubernetes', 'PostgreSQL'], source: 'LinkedIn', expectedSalary: 140000, location: 'Remote', stage: 'Screening', rating: 3, jobIndex: 0, daysAgoCreated: 15 },
    { fullName: 'Isabella Anderson', email: 'isabella.a@email.com', phone: '+1-555-0108', currentRole: 'UX Researcher', currentCompany: 'UserFirst', experienceYears: 4, skills: ['User Testing', 'Figma', 'Survey Design', 'Analytics'], source: 'Referral', expectedSalary: 88000, location: 'Austin, TX', stage: 'Screening', rating: 4, jobIndex: 2, daysAgoCreated: 20 },
    { fullName: 'Ethan Jackson', email: 'ethan.j@email.com', phone: '+1-555-0109', currentRole: 'Product Manager', currentCompany: 'ProductHouse', experienceYears: 7, skills: ['Product Strategy', 'Roadmapping', 'SQL', 'Agile'], source: 'LinkedIn', expectedSalary: 150000, location: 'New York, NY', stage: 'Screening', rating: 4, jobIndex: 1, daysAgoCreated: 22 },
    { fullName: 'Mia Thomas', email: 'mia.t@email.com', phone: '+1-555-0110', currentRole: 'Cloud Engineer', currentCompany: 'SkyOps', experienceYears: 3, skills: ['AWS', 'Azure', 'CI/CD', 'Ansible'], source: 'Job Board', expectedSalary: 100000, location: 'Remote', stage: 'Screening', rating: 3, jobIndex: 3, daysAgoCreated: 18 },
    { fullName: 'Alexander Garcia', email: 'alex.g@email.com', phone: '+1-555-0111', currentRole: 'Marketing Lead', currentCompany: 'BrandUp', experienceYears: 6, skills: ['Content Strategy', 'PPC', 'Analytics', 'CRM'], source: 'Website', expectedSalary: 95000, location: 'San Francisco, CA', stage: 'Screening', rating: 2, jobIndex: 4, daysAgoCreated: 25 },
    { fullName: 'Charlotte Martinez', email: 'charlotte.m@email.com', phone: '+1-555-0112', currentRole: 'Data Analyst', currentCompany: 'InsightCo', experienceYears: 3, skills: ['SQL', 'Python', 'Power BI', 'Excel'], source: 'LinkedIn', expectedSalary: 80000, location: 'Remote', stage: 'Screening', rating: 3, jobIndex: 5, daysAgoCreated: 28 },
    { fullName: 'Henry Robinson', email: 'henry.r@email.com', phone: '+1-555-0113', currentRole: 'Frontend Developer', currentCompany: 'UIFactory', experienceYears: 4, skills: ['React', 'TypeScript', 'CSS', 'Next.js'], source: 'Referral', expectedSalary: 120000, location: 'Remote', stage: 'Screening', rating: 4, jobIndex: 0, daysAgoCreated: 30 },
    // Interview (7)
    { fullName: 'Amelia Lee', email: 'amelia.l@email.com', phone: '+1-555-0114', currentRole: 'Senior Engineer', currentCompany: 'TechGiant', experienceYears: 8, skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'], source: 'LinkedIn', expectedSalary: 160000, location: 'Remote', stage: 'Interview', rating: 4, jobIndex: 0, daysAgoCreated: 35 },
    { fullName: 'Benjamin Walker', email: 'ben.w@email.com', phone: '+1-555-0115', currentRole: 'Senior Product Manager', currentCompany: 'ProductLab', experienceYears: 9, skills: ['Product Vision', 'Analytics', 'Stakeholder Management', 'Agile'], source: 'LinkedIn', expectedSalary: 170000, location: 'New York, NY', stage: 'Interview', rating: 5, jobIndex: 1, daysAgoCreated: 38 },
    { fullName: 'Harper Hall', email: 'harper.h@email.com', phone: '+1-555-0116', currentRole: 'Lead Designer', currentCompany: 'PixelStudio', experienceYears: 7, skills: ['Figma', 'Design Systems', 'Motion Design', 'Accessibility'], source: 'Referral', expectedSalary: 120000, location: 'Austin, TX', stage: 'Interview', rating: 5, jobIndex: 2, daysAgoCreated: 40 },
    { fullName: 'Evelyn Young', email: 'evelyn.y@email.com', phone: '+1-555-0117', currentRole: 'Platform Engineer', currentCompany: 'InfraTeam', experienceYears: 6, skills: ['Kubernetes', 'Helm', 'Prometheus', 'Terraform'], source: 'Job Board', expectedSalary: 140000, location: 'Remote', stage: 'Interview', rating: 4, jobIndex: 3, daysAgoCreated: 42 },
    { fullName: 'Michael Harris', email: 'michael.h@email.com', phone: '+1-555-0118', currentRole: 'Growth Marketing Manager', currentCompany: 'ScaleUp', experienceYears: 8, skills: ['Growth Hacking', 'Email Marketing', 'Paid Social', 'A/B Testing'], source: 'LinkedIn', expectedSalary: 105000, location: 'San Francisco, CA', stage: 'Interview', rating: 3, jobIndex: 4, daysAgoCreated: 44 },
    { fullName: 'Abigail Clark', email: 'abigail.c@email.com', phone: '+1-555-0119', currentRole: 'BI Analyst', currentCompany: 'DataViz', experienceYears: 5, skills: ['Looker', 'SQL', 'dbt', 'Python'], source: 'Website', expectedSalary: 95000, location: 'Remote', stage: 'Interview', rating: 4, jobIndex: 5, daysAgoCreated: 45 },
    { fullName: 'Daniel Lewis', email: 'daniel.l@email.com', phone: '+1-555-0120', currentRole: 'Software Engineer', currentCompany: 'CodeCraft', experienceYears: 5, skills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'], source: 'Referral', expectedSalary: 130000, location: 'Remote', stage: 'Interview', rating: 3, jobIndex: 0, daysAgoCreated: 47 },
    // Technical Round (5)
    { fullName: 'Emily Robinson', email: 'emily.r@email.com', phone: '+1-555-0121', currentRole: 'Staff Engineer', currentCompany: 'EngineeringCo', experienceYears: 10, skills: ['System Design', 'TypeScript', 'Distributed Systems', 'AWS'], source: 'LinkedIn', expectedSalary: 180000, location: 'Remote', stage: 'Technical Round', rating: 5, jobIndex: 0, daysAgoCreated: 50 },
    { fullName: 'Matthew Thompson', email: 'matthew.t@email.com', phone: '+1-555-0122', currentRole: 'Senior PM', currentCompany: 'SaaSCo', experienceYears: 8, skills: ['B2B Product', 'Metrics', 'Customer Discovery', 'Roadmapping'], source: 'Referral', expectedSalary: 165000, location: 'New York, NY', stage: 'Technical Round', rating: 5, jobIndex: 1, daysAgoCreated: 52 },
    { fullName: 'Grace White', email: 'grace.w@email.com', phone: '+1-555-0123', currentRole: 'Principal Designer', currentCompany: 'CreativeAgency', experienceYears: 11, skills: ['Design Leadership', 'Brand Systems', 'Figma', 'Workshop Facilitation'], source: 'LinkedIn', expectedSalary: 140000, location: 'Austin, TX', stage: 'Technical Round', rating: 4, jobIndex: 2, daysAgoCreated: 54 },
    { fullName: 'Joshua Moore', email: 'joshua.m@email.com', phone: '+1-555-0124', currentRole: 'SRE', currentCompany: 'Reliability Inc', experienceYears: 7, skills: ['SRE', 'On-call', 'Incident Response', 'Kubernetes'], source: 'Job Board', expectedSalary: 155000, location: 'Remote', stage: 'Technical Round', rating: 4, jobIndex: 3, daysAgoCreated: 55 },
    { fullName: 'Ella Scott', email: 'ella.s@email.com', phone: '+1-555-0125', currentRole: 'Analytics Engineer', currentCompany: 'DataStack', experienceYears: 6, skills: ['dbt', 'Snowflake', 'SQL', 'Airflow'], source: 'LinkedIn', expectedSalary: 125000, location: 'Remote', stage: 'Technical Round', rating: 5, jobIndex: 5, daysAgoCreated: 56 },
    // Offer (3)
    { fullName: 'Aiden King', email: 'aiden.k@email.com', phone: '+1-555-0126', currentRole: 'Principal Engineer', currentCompany: 'MegaCorp', experienceYears: 12, skills: ['Architecture', 'TypeScript', 'React', 'AWS', 'Leadership'], source: 'Referral', expectedSalary: 200000, location: 'Remote', stage: 'Offer', rating: 5, jobIndex: 0, daysAgoCreated: 57 },
    { fullName: 'Lily Adams', email: 'lily.a@email.com', phone: '+1-555-0127', currentRole: 'Director of Product', currentCompany: 'ProductFirst', experienceYears: 11, skills: ['Product Leadership', 'Vision', 'Team Building', 'Strategy'], source: 'LinkedIn', expectedSalary: 185000, location: 'New York, NY', stage: 'Offer', rating: 5, jobIndex: 1, daysAgoCreated: 58 },
    { fullName: 'Jackson Baker', email: 'jackson.b@email.com', phone: '+1-555-0128', currentRole: 'Head of DevOps', currentCompany: 'CloudNative', experienceYears: 10, skills: ['Platform Engineering', 'AWS', 'Kubernetes', 'Leadership'], source: 'Referral', expectedSalary: 175000, location: 'Remote', stage: 'Offer', rating: 5, jobIndex: 3, daysAgoCreated: 59 },
    // Hired (5)
    { fullName: 'Scarlett Nelson', email: 'scarlett.n@email.com', phone: '+1-555-0129', currentRole: 'Software Engineer', currentCompany: 'PrevCorp', experienceYears: 6, skills: ['React', 'Next.js', 'TypeScript', 'GraphQL'], source: 'LinkedIn', expectedSalary: 145000, location: 'Remote', stage: 'Hired', rating: 5, jobIndex: 0, daysAgoCreated: 58 },
    { fullName: 'Carter Mitchell', email: 'carter.m@email.com', phone: '+1-555-0130', currentRole: 'Product Manager', currentCompany: 'OldCo', experienceYears: 6, skills: ['Mobile Product', 'Analytics', 'User Stories', 'OKRs'], source: 'Job Board', expectedSalary: 135000, location: 'New York, NY', stage: 'Hired', rating: 4, jobIndex: 1, daysAgoCreated: 55 },
    { fullName: 'Penelope Perez', email: 'penelope.p@email.com', phone: '+1-555-0131', currentRole: 'Senior Designer', currentCompany: 'DesignHub', experienceYears: 8, skills: ['Figma', 'Prototyping', 'Design Tokens', 'User Research'], source: 'Referral', expectedSalary: 110000, location: 'Austin, TX', stage: 'Hired', rating: 5, jobIndex: 2, daysAgoCreated: 52 },
    { fullName: 'Lucas Rivera', email: 'lucas.r@email.com', phone: '+1-555-0132', currentRole: 'DevOps Lead', currentCompany: 'InfraGroup', experienceYears: 9, skills: ['AWS', 'Terraform', 'Kubernetes', 'GitHub Actions'], source: 'LinkedIn', expectedSalary: 160000, location: 'Remote', stage: 'Hired', rating: 5, jobIndex: 3, daysAgoCreated: 50 },
    { fullName: 'Zoey Collins', email: 'zoey.c@email.com', phone: '+1-555-0133', currentRole: 'Marketing Manager', currentCompany: 'GrowthBrand', experienceYears: 7, skills: ['Brand Strategy', 'Content', 'Demand Gen', 'Marketing Ops'], source: 'Website', expectedSalary: 100000, location: 'San Francisco, CA', stage: 'Hired', rating: 4, jobIndex: 4, daysAgoCreated: 48 },
    // Rejected (10)
    { fullName: 'Ryan Stewart', email: 'ryan.s@email.com', phone: '+1-555-0134', currentRole: 'Junior Developer', currentCompany: 'SmallShop', experienceYears: 1, skills: ['JavaScript', 'HTML', 'CSS'], source: 'Job Board', expectedSalary: 65000, location: 'Remote', stage: 'Rejected', rating: 2, jobIndex: 0, daysAgoCreated: 45, rejectionReason: 'Insufficient experience' },
    { fullName: 'Natalie Sanchez', email: 'natalie.s@email.com', phone: '+1-555-0135', currentRole: 'Marketing Coordinator', currentCompany: 'LocalBiz', experienceYears: 2, skills: ['Social Media', 'Canva', 'Email'], source: 'LinkedIn', expectedSalary: 55000, location: 'Chicago, IL', stage: 'Rejected', rating: 2, jobIndex: 4, daysAgoCreated: 40, rejectionReason: 'Not a culture fit' },
    { fullName: 'Dylan Morris', email: 'dylan.m@email.com', phone: '+1-555-0136', currentRole: 'Designer', currentCompany: 'Freelance', experienceYears: 3, skills: ['Photoshop', 'Illustrator'], source: 'Website', expectedSalary: 70000, location: 'Austin, TX', stage: 'Rejected', rating: 2, jobIndex: 2, daysAgoCreated: 38, rejectionReason: 'Skills mismatch' },
    { fullName: 'Hannah Rogers', email: 'hannah.r@email.com', phone: '+1-555-0137', currentRole: 'Junior Analyst', currentCompany: 'AnalyticsCo', experienceYears: 1, skills: ['Excel', 'SQL basics'], source: 'Job Board', expectedSalary: 60000, location: 'Remote', stage: 'Rejected', rating: 1, jobIndex: 5, daysAgoCreated: 35, rejectionReason: 'Insufficient experience' },
    { fullName: 'Sebastian Reed', email: 'sebastian.r@email.com', phone: '+1-555-0138', currentRole: 'QA Engineer', currentCompany: 'TestCo', experienceYears: 4, skills: ['Selenium', 'Manual Testing'], source: 'LinkedIn', expectedSalary: 80000, location: 'Remote', stage: 'Rejected', rating: 2, jobIndex: 0, daysAgoCreated: 33, rejectionReason: 'Skills mismatch' },
    { fullName: 'Victoria Price', email: 'victoria.p@email.com', phone: '+1-555-0139', currentRole: 'Marketing Analyst', currentCompany: 'BrandCo', experienceYears: 3, skills: ['Google Analytics', 'Excel', 'Reporting'], source: 'Referral', expectedSalary: 72000, location: 'San Francisco, CA', stage: 'Rejected', rating: 2, jobIndex: 4, daysAgoCreated: 30, rejectionReason: 'Offer declined by candidate' },
    { fullName: 'David Cooper', email: 'david.c@email.com', phone: '+1-555-0140', currentRole: 'Backend Dev', currentCompany: 'StartupABC', experienceYears: 3, skills: ['PHP', 'Laravel', 'MySQL'], source: 'Job Board', expectedSalary: 90000, location: 'Remote', stage: 'Rejected', rating: 2, jobIndex: 0, daysAgoCreated: 28, rejectionReason: 'Skills mismatch' },
    { fullName: 'Chloe Richardson', email: 'chloe.r@email.com', phone: '+1-555-0141', currentRole: 'UI Designer', currentCompany: 'DesignAgency', experienceYears: 2, skills: ['Sketch', 'Zeplin', 'CSS'], source: 'LinkedIn', expectedSalary: 70000, location: 'Austin, TX', stage: 'Rejected', rating: 2, jobIndex: 2, daysAgoCreated: 25, rejectionReason: 'Position filled' },
    { fullName: 'Elijah Cox', email: 'elijah.c@email.com', phone: '+1-555-0142', currentRole: 'Network Admin', currentCompany: 'NetCo', experienceYears: 5, skills: ['Cisco', 'Networking', 'Linux'], source: 'Job Board', expectedSalary: 85000, location: 'Remote', stage: 'Rejected', rating: 1, jobIndex: 3, daysAgoCreated: 22, rejectionReason: 'Skills mismatch' },
    { fullName: 'Sofia Ward', email: 'sofia.ward@email.com', phone: '+1-555-0143', currentRole: 'Content Writer', currentCompany: 'MediaCo', experienceYears: 4, skills: ['Copywriting', 'SEO Writing', 'WordPress'], source: 'Website', expectedSalary: 65000, location: 'Chicago, IL', stage: 'Rejected', rating: 2, jobIndex: 4, daysAgoCreated: 20, rejectionReason: 'Not a culture fit' },
  ]

  // Create candidates and stage histories
  for (const data of candidateData) {
    const { jobIndex, daysAgoCreated, rejectionReason, ...candidateFields } = data
    const createdAt = daysAgo(daysAgoCreated)
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000)

    const candidate = await prisma.candidate.create({
      data: {
        ...candidateFields,
        jobId: jobs[jobIndex].id,
        rejectionReason: rejectionReason || null,
        notes: `Candidate notes for ${candidateFields.fullName}. Strong background in their field with relevant experience.`,
        resumeUrl: `https://example.com/resumes/${candidateFields.email.split('@')[0]}.pdf`,
        createdAt,
        updatedAt,
      },
    })

    // Create stage history
    const stageOrder = ['Applied', 'Screening', 'Interview', 'Technical Round', 'Offer', 'Hired']
    const finalStage = candidateFields.stage
    const stagesReached = finalStage === 'Rejected' 
      ? ['Applied', 'Screening'] 
      : stageOrder.slice(0, stageOrder.indexOf(finalStage) + 1)

    let currentDate = new Date(createdAt.getTime())
    for (let i = 0; i < stagesReached.length - 1; i++) {
      currentDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: stagesReached[i],
          toStage: stagesReached[i + 1],
          changedById: recruiter.id,
          changedAt: currentDate,
          note: `Moved to ${stagesReached[i + 1]} after positive evaluation.`,
        },
      })
    }

    // If rejected, add rejection history entry
    if (finalStage === 'Rejected') {
      currentDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: 'Screening',
          toStage: 'Rejected',
          changedById: recruiter.id,
          changedAt: currentDate,
          note: `Rejected: ${rejectionReason || 'Did not proceed'}`,
          rejectionReason: rejectionReason,
        },
      })
    }
  }

  console.log('✅ Seed complete!')
  console.log(`👤 Demo login: recruiter@miniats.com / Demo@1234`)
  console.log(`📊 Created ${candidateData.length} candidates across ${jobs.length} jobs`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
