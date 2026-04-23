-- ============================================================
-- RERS Prototype Seed Data: 50 Applications + Full Lifecycle
-- Prerequisites: npm run seed (creates roles first)
-- Password for all users: Password123!
-- ============================================================

BEGIN;

-- ============================================================
-- TENANT
-- ============================================================
INSERT INTO tenants (id, name, code, type, address, phone, email, "isActive", settings, "createdAt", "updatedAt")
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Rwanda Ethics Review Board',
  'RERB', 'NATIONAL',
  'KG 7 Avenue, Kigali, Rwanda',
  '+250788100000',
  'ethics@rerb.rw',
  true,
  '{"maxReviewers": 5, "reviewDays": 21, "currency": "RWF", "allowSelfRegistration": true}'::jsonb,
  '2024-01-15 08:00:00',
  '2024-01-15 08:00:00'
) ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- USERS — Applicants (10)
-- ============================================================
INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, "isActive", "isVerified", "tenantId", "roleId", "firstLogin", "createdAt", "updatedAt")
SELECT v.id::uuid, v.email, v.pw, v.fn, v.ln, v.phone, true, true,
  '10000000-0000-0000-0000-000000000001'::uuid, r.id, false, v.ts::timestamp, v.ts::timestamp
FROM (VALUES
  ('20000000-0000-0000-0000-000000000001','amara.diallo@ur.ac.rw',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Amara',   'Diallo',   '+250788201001','2024-02-01 09:00:00'),
  ('20000000-0000-0000-0000-000000000002','fatima.okonkwo@rbc.gov.rw',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Fatima',  'Okonkwo',  '+250788201002','2024-02-05 09:00:00'),
  ('20000000-0000-0000-0000-000000000003','james.mwangi@chuk.rw',        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','James',   'Mwangi',   '+250788201003','2024-02-10 09:00:00'),
  ('20000000-0000-0000-0000-000000000004','grace.nakamura@kfh.rw',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Grace',   'Nakamura', '+250788201004','2024-02-15 09:00:00'),
  ('20000000-0000-0000-0000-000000000005','samuel.mensah@rmh.rw',        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Samuel',  'Mensah',   '+250788201005','2024-02-20 09:00:00'),
  ('20000000-0000-0000-0000-000000000006','nadia.hassan@ur.ac.rw',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Nadia',   'Hassan',   '+250788201006','2024-03-01 09:00:00'),
  ('20000000-0000-0000-0000-000000000007','emmanuel.osei@rbc.gov.rw',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Emmanuel','Osei',     '+250788201007','2024-03-05 09:00:00'),
  ('20000000-0000-0000-0000-000000000008','blessing.adeyemi@chuk.rw',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Blessing','Adeyemi',  '+250788201008','2024-03-10 09:00:00'),
  ('20000000-0000-0000-0000-000000000009','victor.kamau@kfh.rw',         '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Victor',  'Kamau',    '+250788201009','2024-03-15 09:00:00'),
  ('20000000-0000-0000-0000-000000000010','alice.wangari@rmh.rw',        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Alice',   'Wangari',  '+250788201010','2024-03-20 09:00:00')
) AS v(id, email, pw, fn, ln, phone, ts)
CROSS JOIN (SELECT id FROM roles WHERE name = 'APPLICANT') AS r
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- USERS — Reviewers (4)
-- ============================================================
INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, "isActive", "isVerified", "tenantId", "roleId", "firstLogin", "createdAt", "updatedAt")
SELECT v.id::uuid, v.email, v.pw, v.fn, v.ln, v.phone, true, true,
  '10000000-0000-0000-0000-000000000001'::uuid, r.id, false, v.ts::timestamp, v.ts::timestamp
FROM (VALUES
  ('30000000-0000-0000-0000-000000000001','john.kariuki@ur.ac.rw',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','John',    'Kariuki', '+250788301001','2024-01-20 09:00:00'),
  ('30000000-0000-0000-0000-000000000002','sarah.mutua@rbc.gov.rw',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Sarah',   'Mutua',   '+250788301002','2024-01-20 09:00:00'),
  ('30000000-0000-0000-0000-000000000003','michael.otieno@chuk.rw',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Michael', 'Otieno',  '+250788301003','2024-01-20 09:00:00'),
  ('30000000-0000-0000-0000-000000000004','florence.achieng@kfh.rw',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Florence','Achieng', '+250788301004','2024-01-20 09:00:00')
) AS v(id, email, pw, fn, ln, phone, ts)
CROSS JOIN (SELECT id FROM roles WHERE name = 'REVIEWER') AS r
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- USERS — Staff (IRB Admin, RNEC Admin, Finance, Chairperson, Sysadmin)
-- ============================================================
INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, "isActive", "isVerified", "tenantId", "roleId", "firstLogin", "createdAt", "updatedAt")
SELECT v.id::uuid, v.email, '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  v.fn, v.ln, v.phone, true, true, '10000000-0000-0000-0000-000000000001'::uuid,
  (SELECT id FROM roles WHERE name = v.role_name::"UserRole"), false, '2024-01-16 09:00:00'::timestamp, '2024-01-16 09:00:00'::timestamp
FROM (VALUES
  ('40000000-0000-0000-0000-000000000001','mary.njoroge@rerb.rw',  'Mary',   'Njoroge', '+250788401001','IRB_ADMIN'),
  ('40000000-0000-0000-0000-000000000002','peter.muthoni@rerb.rw', 'Peter',  'Muthoni', '+250788401002','RNEC_ADMIN'),
  ('50000000-0000-0000-0000-000000000001','jane.waweru@rerb.rw',   'Jane',   'Waweru',  '+250788501001','FINANCE_OFFICER'),
  ('60000000-0000-0000-0000-000000000001','david.njiru@rerb.rw',   'David',  'Njiru',   '+250788601001','CHAIRPERSON'),
  ('65000000-0000-0000-0000-000000000001','admin@rerb.rw',         'System', 'Admin',   '+250788651001','SYSTEM_ADMIN')
) AS v(id, email, fn, ln, phone, role_name)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- APPLICANT PROFILES
-- ============================================================
INSERT INTO applicant_profiles (id, "userId", institution, department, position, qualifications, "orcidId", "createdAt", "updatedAt")
VALUES
  ('80000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','University of Rwanda','School of Medicine','Associate Professor','PhD Epidemiology, MPH','0000-0002-1234-0001','2024-02-01 09:30:00','2024-02-01 09:30:00'),
  ('80000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000002','Rwanda Biomedical Center','HIV/AIDS Division','Principal Investigator','MD, PhD Infectious Diseases','0000-0002-1234-0002','2024-02-05 09:30:00','2024-02-05 09:30:00'),
  ('80000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003','CHUK Hospital','Department of Internal Medicine','Senior Consultant','MD, MMed Internal Medicine','0000-0002-1234-0003','2024-02-10 09:30:00','2024-02-10 09:30:00'),
  ('80000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000004','King Faisal Hospital','Department of Oncology','Head of Oncology','MD, PhD Oncology, FACS','0000-0002-1234-0004','2024-02-15 09:30:00','2024-02-15 09:30:00'),
  ('80000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000005','Rwanda Military Hospital','Department of Pediatrics','Pediatric Specialist','MD, MMed Pediatrics','0000-0002-1234-0005','2024-02-20 09:30:00','2024-02-20 09:30:00'),
  ('80000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000006','University of Rwanda','School of Public Health','Lecturer','PhD Public Health, MSc Epidemiology','0000-0002-1234-0006','2024-03-01 09:30:00','2024-03-01 09:30:00'),
  ('80000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000007','Rwanda Biomedical Center','TB Division','Research Scientist','PhD Microbiology, MSc Biomedical Sciences','0000-0002-1234-0007','2024-03-05 09:30:00','2024-03-05 09:30:00'),
  ('80000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000008','CHUK Hospital','Department of Obstetrics','Obstetrics Consultant','MD, MMed Obs & Gynae','0000-0002-1234-0008','2024-03-10 09:30:00','2024-03-10 09:30:00'),
  ('80000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000009','King Faisal Hospital','Department of Cardiology','Cardiologist','MD, PhD Cardiovascular Medicine','0000-0002-1234-0009','2024-03-15 09:30:00','2024-03-15 09:30:00'),
  ('80000000-0000-0000-0000-000000000010','20000000-0000-0000-0000-000000000010','Rwanda Military Hospital','Department of Nutrition','Nutrition Researcher','PhD Nutrition, MSc Community Health','0000-0002-1234-0010','2024-03-20 09:30:00','2024-03-20 09:30:00')
ON CONFLICT ("userId") DO NOTHING;

-- ============================================================
-- INSTITUTIONS (5)
-- ============================================================
INSERT INTO institutions (id, name, code, type, address, phone, email, "tenantId", "isActive", "createdAt", "updatedAt")
VALUES
  ('70000000-0000-0000-0000-000000000001','University of Rwanda Teaching Hospital','URTH','UNIVERSITY_HOSPITAL','KG 11 Ave, Kigali','+250788701001','research@ur.ac.rw','10000000-0000-0000-0000-000000000001',true,'2024-01-15 10:00:00','2024-01-15 10:00:00'),
  ('70000000-0000-0000-0000-000000000002','King Faisal Hospital','KFH','REFERRAL_HOSPITAL','KG 544 St, Kigali','+250788701002','research@kfh.rw','10000000-0000-0000-0000-000000000001',true,'2024-01-15 10:00:00','2024-01-15 10:00:00'),
  ('70000000-0000-0000-0000-000000000003','Rwanda Biomedical Center','RBC','RESEARCH_CENTER','KN 4 Ave, Kigali','+250788701003','research@rbc.gov.rw','10000000-0000-0000-0000-000000000001',true,'2024-01-15 10:00:00','2024-01-15 10:00:00'),
  ('70000000-0000-0000-0000-000000000004','CHUK - Centre Hospitalier Universitaire de Kigali','CHUK','UNIVERSITY_HOSPITAL','KN 4 Ave, Kigali','+250788701004','research@chuk.rw','10000000-0000-0000-0000-000000000001',true,'2024-01-15 10:00:00','2024-01-15 10:00:00'),
  ('70000000-0000-0000-0000-000000000005','Rwanda Military Hospital','RMH','MILITARY_HOSPITAL','KG 2 Ave, Kigali','+250788701005','research@rmh.rw','10000000-0000-0000-0000-000000000001',true,'2024-01-15 10:00:00','2024-01-15 10:00:00')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- APPLICATIONS (50)
-- Statuses: 1-5 DRAFT, 6-10 SUBMITTED, 11-13 SCREENING,
--  14-16 PAYMENT_PENDING, 17-19 PAYMENT_VERIFIED,
--  20-24 UNDER_REVIEW, 25-27 QUERY_RAISED,
--  28-29 RESPONSE_RECEIVED, 30-32 DECISION_PENDING,
--  33-36 APPROVED, 37-39 CONDITIONALLY_APPROVED,
--  40-42 REJECTED, 43-44 AMENDMENT_PENDING,
--  45-47 MONITORING_ACTIVE, 48-50 CLOSED
-- ============================================================
INSERT INTO applications (
  id, "referenceNumber", title, type, status, "tenantId", "applicantId", "destinationId",
  "principalInvestigator", "coInvestigators", "studyDuration", "studyStartDate", "studyEndDate",
  population, "sampleSize", methodology, "fundingSource", budget, "ethicsStatement",
  "consentDescription", "formData", "submittedAt", "createdAt", "updatedAt"
) VALUES

-- ======== DRAFT (1-5) ========
('90000000-0000-0000-0000-000000000001',NULL,
 'Malaria Prevention Strategies in Pregnant Women in Rural Rwanda',
 'FULL_BOARD','DRAFT',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000003',
 'Dr. Amara Diallo',ARRAY['Dr. Marie Uwase','Prof. Jean Ntamwishimiro','Dr. Claire Umubyeyi'],
 '24 months','2025-07-01','2027-06-30',
 'Pregnant women in their first and second trimester attending antenatal care clinics in rural districts of Rwanda including Kayonza, Kirehe, and Ngoma',
 480,'Randomized controlled trial with cluster randomization at health facility level. Intervention arm receives monthly intermittent preventive treatment with sulfadoxine-pyrimethamine combined with insecticide-treated bed nets versus standard of care.',
 'Global Fund for AIDS, Tuberculosis and Malaria',150000,
 'This study adheres to the Declaration of Helsinki and all relevant Rwandan national research guidelines. Participant welfare is prioritized throughout all study phases.',
 'Written informed consent will be obtained in Kinyarwanda from all participants or their legal guardians. Participants are free to withdraw at any time without penalty.',
 '{"objectives": ["Reduce malaria incidence by 40% in pregnant women", "Assess IPTp adherence rates", "Evaluate birth outcome improvements"], "primaryOutcome": "Incidence of malaria parasitemia at delivery", "secondaryOutcomes": ["Low birth weight", "Preterm birth", "Maternal hemoglobin levels"]}'::jsonb,
 NULL,'2025-01-10 09:00:00','2025-01-10 09:00:00'),

('90000000-0000-0000-0000-000000000002',NULL,
 'Effectiveness of Community Health Worker Programs for Tuberculosis Case Finding',
 'EXPEDITED','DRAFT',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000003',
 'Dr. Fatima Okonkwo',ARRAY['Dr. Patrick Nkurunziza','Dr. Solange Ingabire'],
 '18 months','2025-08-01','2027-01-31',
 'Adults aged 18 and above with cough lasting more than 2 weeks in high-burden TB districts including Nyamasheke and Rusizi',
 1200,'Cross-sectional study with active case finding by trained community health workers. Screening involves symptom assessment, GeneXpert testing, and chest X-ray for suspected cases.',
 'USAID Rwanda Mission',85000,
 'The study follows international ethical standards for TB research. Community consent processes will be followed alongside individual informed consent.',
 'Oral and written informed consent will be provided in Kinyarwanda. Participants will be informed of their right to withdraw at any time.',
 '{"objectives": ["Increase TB case detection rate by 30%", "Reduce diagnostic delay"], "primaryOutcome": "TB case notification rate per 100,000 population"}'::jsonb,
 NULL,'2025-01-15 10:00:00','2025-01-15 10:00:00'),

('90000000-0000-0000-0000-000000000003',NULL,
 'Mental Health Screening Tools Validation for Adolescents in Urban Rwanda',
 'EXPEDITED','DRAFT',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000001',
 'Dr. James Mwangi',ARRAY['Prof. Clarisse Musabyimana','Dr. Eric Ndayishimiye'],
 '12 months','2025-09-01','2026-08-31',
 'Adolescents aged 13-18 years attending secondary schools in Kigali City',
 600,'Psychometric validation study using PHQ-A, GAD-7, and locally adapted screening tools. Cross-cultural adaptation of validated instruments with cognitive interviews.',
 'Wellcome Trust',42000,
 'Research involving minors requires additional ethical safeguards including parental consent and child assent procedures.',
 'Parental/guardian written consent and adolescent assent will be obtained. All data will be de-identified and stored securely.',
 '{"objectives": ["Validate mental health screening tools for Rwandan adolescents"], "targetPopulation": "13-18 year olds in urban schools"}'::jsonb,
 NULL,'2025-01-20 11:00:00','2025-01-20 11:00:00'),

('90000000-0000-0000-0000-000000000004',NULL,
 'Nutritional Interventions for Stunting Prevention in Children Under Five',
 'EXEMPT','DRAFT',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000005',
 'Dr. Grace Nakamura',ARRAY['Dr. Ange Mukamana','Nutritionist Diane Uwimana'],
 '12 months','2025-10-01','2026-09-30',
 'Children aged 6-59 months attending nutrition centers in Bugesera and Rwamagana districts',
 320,'Observational cohort study with dietary assessment using 24-hour recall and food frequency questionnaire. Anthropometric measurements monthly.',
 'UNICEF Rwanda',28000,
 'This study involves only observational data collection and poses minimal risk to participants.',
 'Written consent will be obtained from parents or guardians. Participation is entirely voluntary.',
 '{"objectives": ["Identify key dietary predictors of stunting"], "measurements": ["Weight", "Height", "MUAC", "Dietary diversity score"]}'::jsonb,
 NULL,'2025-02-01 09:00:00','2025-02-01 09:00:00'),

('90000000-0000-0000-0000-000000000005',NULL,
 'Traditional Herbal Medicine Use and Drug Interactions in HIV-Positive Patients on ART',
 'FULL_BOARD','DRAFT',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000002',
 'Dr. Samuel Mensah',ARRAY['Dr. Aimable Rukundo','Pharmacist Rose Ingabire','Dr. Janvier Hakizimana'],
 '18 months','2025-11-01','2027-04-30',
 'HIV-positive adults aged 18+ currently on antiretroviral therapy attending HIV clinics at King Faisal Hospital',
 250,'Mixed-methods study combining patient interviews, laboratory pharmacokinetic sampling, and drug interaction analysis. Semi-structured interviews to assess herbal medicine use patterns.',
 'NIH Fogarty International Center',95000,
 'The study poses potential risk through pharmacokinetic sampling. All procedures follow GCP guidelines.',
 'Written informed consent in Kinyarwanda, French, and English. Right to withdraw without impact on ART care.',
 '{"objectives": ["Prevalence of herbal medicine use", "Identify significant drug interactions", "Patient education interventions"], "biospecimens": "Blood samples for pharmacokinetic analysis"}'::jsonb,
 NULL,'2025-02-05 10:00:00','2025-02-05 10:00:00'),

-- ======== SUBMITTED (6-10) ========
('90000000-0000-0000-0000-000000000006','RERB-2025-0006',
 'Antiretroviral Therapy Adherence Interventions Among Adolescents Living with HIV',
 'FULL_BOARD','SUBMITTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000003',
 'Dr. Amara Diallo',ARRAY['Dr. Nadine Uwiringiyimana','Dr. Thomas Habimana'],
 '24 months','2025-04-01','2027-03-31',
 'HIV-positive adolescents aged 10-19 attending pediatric HIV clinics across 5 districts',
 380,'Randomized controlled trial comparing enhanced adherence counseling with standard of care. Intervention includes peer support groups, mobile health reminders, and caregiver training sessions.',
 'Elizabeth Glaser Pediatric AIDS Foundation',180000,
 'Research involving adolescents follows national guidelines on assent and consent. HIV status disclosure sensitively handled.',
 'Parent/guardian written consent and adolescent assent required. HIV status confidentiality maintained.',
 '{"primaryOutcome": "Viral load suppression at 12 months", "secondaryOutcomes": ["Pill count adherence", "Psychosocial wellbeing", "Treatment failure rate"]}'::jsonb,
 '2025-02-10 14:00:00','2025-02-08 09:00:00','2025-02-10 14:00:00'),

('90000000-0000-0000-0000-000000000007','RERB-2025-0007',
 'Barriers to Cervical Cancer Screening Uptake in Low-Resource Settings in Rwanda',
 'EXPEDITED','SUBMITTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000004',
 'Dr. Fatima Okonkwo',ARRAY['Dr. Pascaline Nihorimbere','Prof. Agnes Binagwaho'],
 '12 months','2025-05-01','2026-04-30',
 'Women aged 25-65 years in Huye and Muhanga districts who have never received cervical cancer screening',
 450,'Mixed-methods study with survey questionnaires and focus group discussions. Quantitative assessment of knowledge, attitudes, and practices, supplemented by qualitative exploration of barriers.',
 'Rwanda Ministry of Health / PATH',38000,
 'Survey-based study with minimal risk. Participant privacy and confidentiality maintained throughout.',
 'Written informed consent in Kinyarwanda. Option for oral consent for low-literacy participants.',
 '{"objectives": ["Identify socio-cultural barriers", "Assess knowledge gaps", "Design targeted interventions"], "instruments": ["Structured questionnaire", "FGD guide"]}'::jsonb,
 '2025-02-18 11:00:00','2025-02-15 09:00:00','2025-02-18 11:00:00'),

('90000000-0000-0000-0000-000000000008','RERB-2025-0008',
 'Improving Childhood Pneumonia Management Outcomes in District Hospitals',
 'FULL_BOARD','SUBMITTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000004',
 'Dr. James Mwangi',ARRAY['Dr. Celestin Sebazungu','Dr. Olive Murindahabi','Nurse Anne Mukamugema'],
 '18 months','2025-06-01','2026-11-30',
 'Children aged 2-59 months admitted with WHO-defined pneumonia at district hospitals in Northern and Eastern provinces',
 520,'Before-after study evaluating a quality improvement intervention bundle including clinical decision support tools, oxygen availability assessment, and staff training on IMCI guidelines.',
 'Gates Foundation',210000,
 'Clinical intervention study requiring close monitoring. Data Safety Monitoring Board established.',
 'Parent/guardian written consent required. Emergency waiver provisions documented for cases where immediate care is needed.',
 '{"primaryOutcome": "In-hospital case fatality rate", "interventionComponents": ["Clinical decision support", "Pulse oximetry training", "Antibiotic stewardship"]}'::jsonb,
 '2025-02-25 16:00:00','2025-02-20 09:00:00','2025-02-25 16:00:00'),

('90000000-0000-0000-0000-000000000009','RERB-2025-0009',
 'Hypertension Detection and Management Among Adults in Rural Health Centers',
 'EXEMPT','SUBMITTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000001',
 'Dr. Grace Nakamura',ARRAY['Dr. Fidele Ngabo','Nurse Jean Habimana'],
 '12 months','2025-07-01','2026-06-30',
 'Adults aged 35 and above attending outpatient clinics at rural health centers in Kamonyi district',
 800,'Cross-sectional study with opportunistic blood pressure screening and health record review. Secondary data analysis of existing health management information system data.',
 'Rwanda Ministry of Health',15000,
 'Minimal-risk study using secondary data and routine clinical data. No experimental interventions.',
 'Verbal consent for blood pressure screening. De-identified data extraction from health records.',
 '{"objectives": ["Estimate hypertension prevalence", "Assess treatment rates", "Identify management gaps"]}'::jsonb,
 '2025-03-03 10:00:00','2025-02-28 09:00:00','2025-03-03 10:00:00'),

('90000000-0000-0000-0000-000000000010','RERB-2025-0010',
 'Obstetric Fistula Treatment Outcomes and Psychosocial Recovery',
 'FULL_BOARD','SUBMITTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000002',
 'Dr. Samuel Mensah',ARRAY['Dr. Josiane Uwamahoro','Dr. Richard Seneza','Social Worker Diane Murekatete'],
 '30 months','2025-06-01','2027-11-30',
 'Women admitted for obstetric fistula repair surgery at King Faisal Hospital and selected partner facilities',
 120,'Prospective cohort study with 12-month follow-up. Assessment of surgical outcomes, continence rates, quality of life, and psychosocial recovery using validated instruments.',
 'Fistula Foundation / WHO AFRO',145000,
 'Sensitive research involving vulnerable women with stigmatizing conditions. Special privacy protections in place.',
 'Written informed consent with interpreter available. Participants can withdraw at any follow-up point.',
 '{"primaryOutcome": "Fistula closure rate at 3 months post-op", "qualityOfLifeTools": ["EQ-5D-5L", "Fistula Quality of Life instrument"]}'::jsonb,
 '2025-03-10 15:00:00','2025-03-05 09:00:00','2025-03-10 15:00:00'),

-- ======== SCREENING (11-13) ========
('90000000-0000-0000-0000-000000000011','RERB-2025-0011',
 'COVID-19 Vaccine Effectiveness Among Healthcare Workers: A Cohort Analysis',
 'EXPEDITED','SCREENING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','70000000-0000-0000-0000-000000000001',
 'Dr. Nadia Hassan',ARRAY['Dr. Modeste Gasana','Dr. Anita Uwimana'],
 '12 months','2025-03-01','2026-02-28',
 'Healthcare workers at tertiary and district hospitals who received at least one dose of COVID-19 vaccine',
 650,'Retrospective and prospective cohort study using electronic health records and active surveillance. Vaccine effectiveness calculated using test-negative design.',
 'WHO Rwanda Country Office',55000,
 'Study uses existing health records with appropriate data governance approvals.',
 'Waiver of consent for retrospective data. Prospective participants provide written consent.',
 '{"vaccines": ["AstraZeneca", "Pfizer-BioNTech", "Johnson & Johnson"], "outcomes": ["PCR-confirmed COVID-19", "Severe disease", "Hospitalization"]}'::jsonb,
 '2025-03-15 10:00:00','2025-03-12 09:00:00','2025-03-20 11:00:00'),

('90000000-0000-0000-0000-000000000012','RERB-2025-0012',
 'Drug-Resistant Tuberculosis Treatment Outcomes and Adverse Event Profile',
 'FULL_BOARD','SCREENING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000007','70000000-0000-0000-0000-000000000003',
 'Dr. Emmanuel Osei',ARRAY['Dr. Pacifique Mwanambonwa','Dr. Chantal Ingabire','Lab Scientist Jean-Baptiste Hakizimana'],
 '36 months','2025-04-01','2028-03-31',
 'Adults with confirmed rifampicin-resistant or multidrug-resistant TB enrolled in Rwanda national DR-TB program',
 180,'Retrospective cohort study with prospective follow-up. Analysis of treatment outcomes, adverse events, and factors associated with treatment success or failure.',
 'USAID / MDR-TB Program',120000,
 'Drug-resistant TB treatment involves prolonged complex regimens with significant adverse effects. Patient welfare monitoring is paramount.',
 'Written informed consent for prospective follow-up. Retrospective data covered by program evaluation waiver.',
 '{"outcomes": ["Treatment success", "Default", "Death", "Failure"], "adverseEventCategories": ["Hepatotoxicity", "Ototoxicity", "Peripheral neuropathy", "QTc prolongation"]}'::jsonb,
 '2025-03-20 14:00:00','2025-03-15 09:00:00','2025-03-25 10:00:00'),

('90000000-0000-0000-0000-000000000013','RERB-2025-0013',
 'Sickle Cell Disease Management in Pediatric Patients: A Multi-Centre Study',
 'FULL_BOARD','SCREENING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000008','70000000-0000-0000-0000-000000000002',
 'Dr. Blessing Adeyemi',ARRAY['Dr. Olive Kayitesi','Dr. Eric Bahizi','Hematologist Prof. Jean Paul Rwigema'],
 '24 months','2025-05-01','2027-04-30',
 'Children aged 1-15 years with confirmed sickle cell disease (HbSS or HbSC) at participating pediatric hematology clinics',
 220,'Prospective observational cohort study. Assessment of clinical complications, treatment patterns, quality of life, and school attendance using standardized case report forms.',
 'Sickle Cell Disease Coalition / NIH',165000,
 'Research in a vulnerable pediatric population with a serious genetic disorder requires robust safeguards.',
 'Parent/guardian written consent and child assent for participants aged 7 and above. Ongoing capacity to withdraw.',
 '{"primaryOutcome": "Annual crisis rate and hospitalization", "qualityOfLifeTool": "PedsQL Sickle Cell Module"}'::jsonb,
 '2025-03-28 11:00:00','2025-03-22 09:00:00','2025-04-02 09:00:00'),

-- ======== PAYMENT_PENDING (14-16) ========
('90000000-0000-0000-0000-000000000014','RERB-2025-0014',
 'Maternal Mental Health Screening in Antenatal and Postnatal Care Settings',
 'FULL_BOARD','PAYMENT_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000009','70000000-0000-0000-0000-000000000004',
 'Dr. Victor Kamau',ARRAY['Dr. Solange Hakizimana','Psychologist Dr. Alice Ndayambaje'],
 '18 months','2025-06-01','2026-11-30',
 'Pregnant and postpartum women attending maternal health services at urban and peri-urban health centers',
 600,'Cross-sectional and longitudinal study using Edinburgh Postnatal Depression Scale (EPDS) and locally validated tools. Prevalence estimation with risk factor analysis.',
 'Grand Challenges Canada',68000,
 'Mental health screening of postpartum women requires culturally sensitive approaches and referral pathways.',
 'Written informed consent with assurance of mental health support referral for screen-positive participants.',
 '{"screeningTools": ["EPDS", "PHQ-9", "GAD-7"], "riskFactors": ["Partner violence", "Social support", "Food insecurity"]}'::jsonb,
 '2025-04-05 10:00:00','2025-03-28 09:00:00','2025-04-10 11:00:00'),

('90000000-0000-0000-0000-000000000015','RERB-2025-0015',
 'Community-Based Diabetes Management Program Evaluation',
 'EXPEDITED','PAYMENT_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000010','70000000-0000-0000-0000-000000000005',
 'Dr. Alice Wangari',ARRAY['Dr. Joseph Ntaganda','Dietitian Carine Umwali'],
 '12 months','2025-07-01','2026-06-30',
 'Adults with type 2 diabetes mellitus registered at community health centers in Gasabo district',
 280,'Quasi-experimental pre-post evaluation of a structured diabetes education and self-management support program delivered by trained community health workers.',
 'Rwandan Diabetes Association / Novo Nordisk',48000,
 'Study involves educational intervention with minimal risk. Blood glucose monitoring using existing clinical data.',
 'Written informed consent. Participation does not affect access to standard diabetes care.',
 '{"program": "DSMES - Diabetes Self-Management Education and Support", "outcomes": ["HbA1c reduction", "Self-efficacy scores", "Medication adherence"]}'::jsonb,
 '2025-04-12 14:00:00','2025-04-05 09:00:00','2025-04-15 10:00:00'),

('90000000-0000-0000-0000-000000000016','RERB-2025-0016',
 'Neonatal Sepsis Prevention Using Chlorhexidine Umbilical Cord Care',
 'FULL_BOARD','PAYMENT_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001',
 'Dr. Amara Diallo',ARRAY['Dr. Marie Jose Uwingabire','Neonatologist Prof. Jacques Sebakara'],
 '18 months','2025-08-01','2027-01-31',
 'Neonates born at health facilities in Musanze and Burera districts in Northern Province',
 1200,'Cluster-randomized trial comparing 4% chlorhexidine cord cleansing with dry cord care. Health facility as unit of randomization. Primary outcome assessed at 28 days.',
 'PATH / Bill & Melinda Gates Foundation',230000,
 'Neonatal study with minimal intervention risk. Chlorhexidine is WHO-recommended and widely used.',
 'Parent/guardian written consent at birth. Provision for oral consent for illiterate parents with witness signature.',
 '{"primaryOutcome": "Neonatal mortality and omphalitis rate by day 28", "secondaryOutcomes": ["Cord separation time", "Systemic infection signs"]}'::jsonb,
 '2025-04-20 11:00:00','2025-04-12 09:00:00','2025-04-22 09:00:00'),

-- ======== PAYMENT_VERIFIED (17-19) ========
('90000000-0000-0000-0000-000000000017','RERB-2025-0017',
 'HIV and Tuberculosis Co-infection Treatment Outcomes in High-Burden Settings',
 'FULL_BOARD','PAYMENT_VERIFIED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000003',
 'Dr. Fatima Okonkwo',ARRAY['Dr. Leon Mutesa','Dr. Immaculate Uwimana','Lab Scientist Augustin Nshimiyimana'],
 '24 months','2025-07-01','2027-06-30',
 'Adults with newly diagnosed HIV-TB co-infection enrolled at integrated HIV-TB clinics across 8 districts',
 300,'Prospective cohort study with standardized data collection on treatment initiation, regimen changes, drug interactions, viral suppression, and TB treatment outcomes.',
 'PEPFAR / CDC Rwanda',175000,
 'HIV-TB co-infection research involves complex treatment considerations. Ethics board ensures both conditions are equally addressed.',
 'Written informed consent in Kinyarwanda. HIV status and TB diagnosis confidentiality rigorously maintained.',
 '{"primaryOutcomes": ["12-month TB treatment success", "24-month viral load suppression"], "subgroupAnalysis": "By ART regimen type"}'::jsonb,
 '2025-04-28 10:00:00','2025-04-20 09:00:00','2025-05-05 11:00:00'),

('90000000-0000-0000-0000-000000000018','RERB-2025-0018',
 'Breast Cancer Early Detection Through Community Health Worker Outreach Program',
 'EXPEDITED','PAYMENT_VERIFIED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000002',
 'Dr. James Mwangi',ARRAY['Oncologist Dr. Yvonne Uwase','Dr. Patrick Murenzi'],
 '18 months','2025-08-01','2027-01-31',
 'Women aged 30-65 in peri-urban areas of Kigali who have never undergone clinical breast examination',
 800,'Before-and-after study evaluating trained community health worker-delivered breast health education and clinical breast examination referral program.',
 'Susan G. Komen Foundation',72000,
 'Breast examination by trained CHWs is safe. Referral pathways to diagnostic services established prior to study start.',
 'Written informed consent. Women have the right to decline examination or referral.',
 '{"programComponents": ["CHW training", "Community sensitization", "Clinical breast exam", "Mammography referral"], "outcomes": ["Stage at detection", "Biopsy referral rates"]}'::jsonb,
 '2025-05-05 14:00:00','2025-04-28 09:00:00','2025-05-12 10:00:00'),

('90000000-0000-0000-0000-000000000019','RERB-2025-0019',
 'Alcohol Use Disorder Screening and Brief Intervention in University Students',
 'EXEMPT','PAYMENT_VERIFIED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000001',
 'Dr. Grace Nakamura',ARRAY['Dr. Christian Umugisha','Psychologist Diane Niyonzima'],
 '8 months','2025-09-01','2026-04-30',
 'Undergraduate students aged 18-25 at University of Rwanda campuses in Kigali',
 500,'Online survey using AUDIT-C screening tool followed by randomized assignment to brief intervention group versus waitlist control. Anonymous data collection.',
 'University of Rwanda Research Fund',18000,
 'Online survey of adults presents minimal risk. Screening tool is non-invasive and validated.',
 'Electronic informed consent provided before survey access. Anonymous responses. Opt-out at any time.',
 '{"screeningTool": "AUDIT-C", "intervention": "Brief Motivational Interviewing (BMI)", "primaryOutcome": "30-day alcohol consumption reduction"}'::jsonb,
 '2025-05-12 11:00:00','2025-05-05 09:00:00','2025-05-18 10:00:00'),

-- ======== UNDER_REVIEW (20-24) ========
('90000000-0000-0000-0000-000000000020','RERB-2025-0020',
 'Preterm Birth Prevention Through Cervical Length Screening in High-Risk Pregnancies',
 'FULL_BOARD','UNDER_REVIEW',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000004',
 'Dr. Samuel Mensah',ARRAY['Prof. Jeanine Condo','Dr. Therese Murangwa','Midwife Cecile Umuhoza'],
 '24 months','2025-06-01','2027-05-31',
 'Pregnant women with history of preterm birth or cervical surgery attending high-risk obstetric clinics',
 320,'Prospective cohort study with universal transvaginal cervical length measurement at 18-24 weeks gestation. Intervention arm receives cerclage or vaginal progesterone based on short cervix criteria.',
 'European and Developing Countries Clinical Trials Partnership',195000,
 'Cervical intervention in pregnancy requires careful risk-benefit assessment. Maternal and fetal safety is primary concern.',
 'Written informed consent. Women can decline intervention without affecting antenatal care continuation.',
 '{"primaryOutcome": "Preterm birth rate before 34 weeks", "interventions": ["Cerclage", "Vaginal progesterone"], "screeningThreshold": "Cervical length < 25mm"}'::jsonb,
 '2025-05-20 14:00:00','2025-05-10 09:00:00','2025-05-25 10:00:00'),

('90000000-0000-0000-0000-000000000021','RERB-2025-0021',
 'Oral Rehydration Therapy Optimization for Acute Watery Diarrhea in Under-Fives',
 'EXPEDITED','UNDER_REVIEW',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','70000000-0000-0000-0000-000000000005',
 'Dr. Nadia Hassan',ARRAY['Dr. Daniel Muhizi','Nurse Scholastique Uwimana'],
 '12 months','2025-07-01','2026-06-30',
 'Children aged 6-59 months with acute watery diarrhea presenting to health centers in Rulindo district',
 400,'Randomized non-inferiority trial comparing reduced-osmolarity ORS with standard ORS. Primary outcome is treatment failure requiring IV fluids.',
 'WHO Essential Medicines Program',35000,
 'Low-risk trial comparing two established WHO-approved interventions with equivalent expected safety profiles.',
 'Parent/guardian written consent. Immediate withdrawal if child shows signs of deterioration.',
 '{"primaryOutcome": "IV fluid requirement within 4 hours", "nonInferiorityMargin": "5%"}'::jsonb,
 '2025-05-28 10:00:00','2025-05-18 09:00:00','2025-06-02 09:00:00'),

('90000000-0000-0000-0000-000000000022','RERB-2025-0022',
 'Schizophrenia Treatment Outcomes in Rural Mental Health Clinics',
 'FULL_BOARD','UNDER_REVIEW',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000007','70000000-0000-0000-0000-000000000001',
 'Dr. Emmanuel Osei',ARRAY['Psychiatrist Dr. Concorde Nkusi','Dr. Claudine Uwera'],
 '24 months','2025-08-01','2027-07-31',
 'Adults with ICD-10 confirmed schizophrenia enrolled in community mental health programs across 6 rural districts',
 200,'Prospective naturalistic cohort study. Assessment of antipsychotic adherence, relapse rates, functional outcomes, and quality of life at baseline, 6, 12, and 24 months.',
 'Grand Challenges Canada / MHRP',88000,
 'Mental health research requires safeguards for vulnerable populations with reduced decision-making capacity.',
 'Written informed consent. Capacity assessment conducted. Next-of-kin co-consent for those with impaired capacity.',
 '{"primaryOutcome": "Relapse-free survival", "assessmentTools": ["PANSS", "GAF", "WHOQOL-BREF"]}'::jsonb,
 '2025-06-04 14:00:00','2025-05-25 09:00:00','2025-06-09 10:00:00'),

('90000000-0000-0000-0000-000000000023','RERB-2025-0023',
 'Infant Feeding Practices and HIV Transmission Outcomes in the Elimination Era',
 'FULL_BOARD','UNDER_REVIEW',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000008','70000000-0000-0000-0000-000000000003',
 'Dr. Blessing Adeyemi',ARRAY['Dr. Ines Gatare','Dr. Benjamin Muhairwe','Nutritionist Alice Nyiransabimana'],
 '30 months','2025-07-01','2027-12-31',
 'HIV-positive mothers and their HIV-exposed infants enrolled in Prevention of Mother-to-Child Transmission clinics',
 450,'Prospective cohort study assessing breastfeeding exclusivity, complementary feeding introduction, and infant HIV acquisition rates at 6, 12, and 18 months.',
 'PEPFAR / EGPAF',155000,
 'HIV mother-infant transmission research requires sensitive handling of HIV disclosure and infant testing.',
 'Written informed consent from mothers. Ongoing option to withdraw infant from follow-up.',
 '{"primaryOutcome": "Infant HIV acquisition by 18 months", "feedingCategories": ["Exclusive breastfeeding", "Mixed feeding", "Formula feeding"]}'::jsonb,
 '2025-06-10 11:00:00','2025-06-01 09:00:00','2025-06-14 10:00:00'),

('90000000-0000-0000-0000-000000000024','RERB-2025-0024',
 'Emergency Obstetric Care Quality Improvement: A Multi-Site Stepped-Wedge Trial',
 'FULL_BOARD','UNDER_REVIEW',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000009','70000000-0000-0000-0000-000000000004',
 'Dr. Victor Kamau',ARRAY['Prof. Jeanine Condo','Dr. Aline Umubyeyi','Dr. Pierre Ntahobari'],
 '36 months','2025-09-01','2028-08-31',
 'Women with obstetric emergencies (PPH, eclampsia, sepsis, obstructed labor) at 12 district hospitals',
 2400,'Stepped-wedge cluster randomized trial of a comprehensive EmOC quality improvement intervention including WHO Safe Childbirth Checklist, simulation training, and real-time data feedback.',
 'DFID / MRC Global Health',380000,
 'Complex health systems trial. DSMB established. Regular interim safety analyses planned.',
 'Waiver of consent for emergency care assessment. Consent obtained for non-emergency participants.',
 '{"primaryOutcome": "Severe maternal outcome rate", "interventionComponents": ["Safe Childbirth Checklist", "Simulation training", "Data dashboards"]}'::jsonb,
 '2025-06-18 16:00:00','2025-06-08 09:00:00','2025-06-22 10:00:00'),

-- ======== QUERY_RAISED (25-27) ========
('90000000-0000-0000-0000-000000000025','RERB-2025-0025',
 'Accuracy of Malaria Rapid Diagnostic Tests in Community-Based Diagnosis',
 'EXPEDITED','QUERY_RAISED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000010','70000000-0000-0000-0000-000000000003',
 'Dr. Alice Wangari',ARRAY['Dr. Jean Pierre Bizimana','Lab Scientist Etienne Ntakarutimana'],
 '12 months','2025-08-01','2026-07-31',
 'Febrile patients aged 5 years and above attending community health posts in Kayonza district',
 600,'Diagnostic accuracy study comparing community health worker-performed RDT results against microscopy and PCR as reference standards. Blinded assessment.',
 'Medicines for Malaria Venture',42000,
 'Diagnostic study with minimal intervention risk. Blood sample collection via finger-prick.',
 'Written informed consent. Parents provide consent for children under 18.',
 '{"referenceStandard": "Expert light microscopy + PCR", "RDTs_evaluated": ["SD Bioline Malaria Ag P.f", "CareStart RDT"], "primaryOutcome": "Sensitivity and specificity"}'::jsonb,
 '2025-06-25 10:00:00','2025-06-15 09:00:00','2025-07-02 09:00:00'),

('90000000-0000-0000-0000-000000000026','RERB-2025-0026',
 'Psychosocial Support Interventions for Cancer Patients Receiving Palliative Care',
 'FULL_BOARD','QUERY_RAISED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000002',
 'Dr. Amara Diallo',ARRAY['Dr. Yvette Uwimana','Psycho-oncologist Dr. Gabriel Mugisha','Social Worker Celine Ngabire'],
 '18 months','2025-09-01','2027-02-28',
 'Adult cancer patients with advanced disease receiving palliative care at King Faisal Hospital oncology unit',
 150,'Mixed-methods randomized trial of group psychosocial support versus usual care. Qualitative component explores patient experience of serious illness.',
 'African Palliative Care Association',62000,
 'Research with terminally ill patients requires heightened sensitivity, minimal burden, and robust withdrawal procedures.',
 'Written informed consent with clear understanding that declining does not affect palliative care. Consent re-assessed at each visit.',
 '{"interventionModel": "Dignity Therapy + Group Support Sessions", "primaryOutcome": "Distress Thermometer scores at 8 weeks"}'::jsonb,
 '2025-07-01 14:00:00','2025-06-20 09:00:00','2025-07-05 10:00:00'),

('90000000-0000-0000-0000-000000000027','RERB-2025-0027',
 'Household Water Purification Methods and Diarrheal Disease Prevention',
 'EXEMPT','QUERY_RAISED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000005',
 'Dr. Fatima Okonkwo',ARRAY['Dr. Anita Nsabimana','Environmental Health Officer Marcel Ntirenganya'],
 '12 months','2025-10-01','2026-09-30',
 'Households in rural Bugesera and Rwamagana districts without access to piped water',
 500,'Cluster-randomized trial comparing point-of-use water chlorination with ceramic filtration versus control (boiling only). Monthly home visits for water quality testing and diarrheal episode recording.',
 'WASH for Life Initiative',28000,
 'Household-level intervention with minimal risk. Environmental samples only, no individual biospecimens.',
 'Household representative written consent. Voluntary participation with no impact on existing water programs.',
 '{"interventions": ["Sodium hypochlorite treatment", "Ceramic pot filter"], "primaryOutcome": "Diarrheal episode rate per household per month"}'::jsonb,
 '2025-07-05 10:00:00','2025-06-25 09:00:00','2025-07-10 09:00:00'),

-- ======== RESPONSE_RECEIVED (28-29) ========
('90000000-0000-0000-0000-000000000028','RERB-2025-0028',
 'School-Based Schistosomiasis Prevention Program Evaluation',
 'EXPEDITED','RESPONSE_RECEIVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000003',
 'Dr. James Mwangi',ARRAY['Dr. Celestin Bizumuremyi','Parasitologist Dr. Odette Mukabatsinda'],
 '18 months','2025-10-01','2027-03-31',
 'Primary school children aged 6-15 years in schools near Lake Kivu in Rusizi district',
 1200,'Cluster-randomized trial of annual praziquantel mass drug administration plus health education versus standard mass drug administration alone.',
 'END Fund / Schistosomiasis Control Initiative',58000,
 'Praziquantel is an established safe drug. School-based program follows national NTD guidelines.',
 'School authority consent and parent/guardian consent. Child assent for participants aged 7 and above.',
 '{"primaryOutcome": "Schistosoma mansoni infection prevalence at 12 months", "drugRegimen": "Praziquantel 40mg/kg single annual dose"}'::jsonb,
 '2025-07-12 10:00:00','2025-07-01 09:00:00','2025-07-18 10:00:00'),

('90000000-0000-0000-0000-000000000029','RERB-2025-0029',
 'Stroke Risk Factor Reduction in Hypertensive Patients: A Behavioral Intervention',
 'FULL_BOARD','RESPONSE_RECEIVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000002',
 'Dr. Grace Nakamura',ARRAY['Neurologist Dr. Vincent Nyundo','Dr. Chantal Habimana'],
 '24 months','2025-11-01','2027-10-31',
 'Adults aged 40-75 with hypertension and at least one additional cardiovascular risk factor',
 380,'Randomized controlled trial of a culturally adapted cardiovascular risk reduction program including structured lifestyle counseling, medication adherence support, and mobile health coaching.',
 'World Heart Federation',128000,
 'RCT in cardiovascular high-risk patients with established treatment. Safety monitoring plan in place.',
 'Written informed consent. Both arms continue standard medical management.',
 '{"primaryOutcome": "10-year cardiovascular risk score reduction at 12 months", "interventionArm": "Lifestyle counseling + mHealth coaching"}'::jsonb,
 '2025-07-18 14:00:00','2025-07-08 09:00:00','2025-07-25 10:00:00'),

-- ======== DECISION_PENDING (30-32) ========
('90000000-0000-0000-0000-000000000030','RERB-2025-0030',
 'Congenital Anomaly Registry Establishment in Rwandan Tertiary Hospitals',
 'FULL_BOARD','DECISION_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000004',
 'Dr. Samuel Mensah',ARRAY['Geneticist Dr. Leon Mutesa','Dr. Espoir Byiringiro'],
 '36 months','2025-09-01','2028-08-31',
 'Neonates and infants under 1 year with confirmed or suspected congenital anomalies at 4 tertiary hospitals',
 480,'Population-based registry study using standardized EUROCAT methodology. Prospective case ascertainment with review of medical records, laboratory results, and imaging.',
 'African Cancer Registry Network / CDC',145000,
 'Registry study with de-identified data. Genetic findings may have implications for family members.',
 'Parent/guardian written consent for registry inclusion. Separate consent for tissue banking if applicable.',
 '{"registryStandard": "EUROCAT", "anomalyCategories": ["Cardiovascular", "Neural tube", "Chromosomal", "Musculoskeletal"]}'::jsonb,
 '2025-07-25 10:00:00','2025-07-12 09:00:00','2025-08-01 10:00:00'),

('90000000-0000-0000-0000-000000000031','RERB-2025-0031',
 'Standardization of Snakebite Treatment Protocols in Rwandan District Hospitals',
 'EXPEDITED','DECISION_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','70000000-0000-0000-0000-000000000005',
 'Dr. Nadia Hassan',ARRAY['Dr. Janvier Nkurunziza','Emergency Physician Dr. Christine Mukamurenzi'],
 '18 months','2025-10-01','2027-03-31',
 'Patients admitted with snakebite envenomation at district and provincial hospitals in Southern Province',
 120,'Retrospective review of existing records combined with prospective case series. Assessment of antivenom use, complications, length of stay, and outcomes.',
 'Global Snakebite Initiative / WHO',38000,
 'Retrospective review with waiver of consent. Prospective cases provide written consent.',
 'Waiver of consent for retrospective data. Written consent for prospective enrollment.',
 '{"primaryOutcome": "In-hospital mortality and complication rates", "antivenom": "Polyvalent African antivenom (SAVP)"}'::jsonb,
 '2025-07-30 14:00:00','2025-07-18 09:00:00','2025-08-05 09:00:00'),

('90000000-0000-0000-0000-000000000032','RERB-2025-0032',
 'Active Leprosy Case Detection and Treatment Completion in Remaining Endemic Districts',
 'EXPEDITED','DECISION_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000007','70000000-0000-0000-0000-000000000003',
 'Dr. Emmanuel Osei',ARRAY['Dr. Perpetue Ndihokubwayo','Community Health Officer Jean Damascene'],
 '18 months','2025-11-01','2027-04-30',
 'Contacts of confirmed leprosy cases and residents of high-prevalence villages in remaining endemic areas',
 800,'Contact tracing study with active case finding using clinical examination and slit-skin smear testing. Monitoring of treatment completion and disability grading.',
 'International Federation of Anti-Leprosy Associations',42000,
 'Stigmatizing condition requiring special privacy protections. Community-level sensitization prior to study.',
 'Written informed consent with community leader engagement. Confidential handling of diagnosis.',
 '{"primaryOutcome": "New leprosy case detection rate and grade 2 disability reduction"}'::jsonb,
 '2025-08-05 10:00:00','2025-07-22 09:00:00','2025-08-10 10:00:00'),

-- ======== APPROVED (33-36) ========
('90000000-0000-0000-0000-000000000033','RERB-2025-0033',
 'Antimicrobial Resistance Surveillance in Community Pharmacies and Primary Care',
 'FULL_BOARD','APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000008','70000000-0000-0000-0000-000000000001',
 'Dr. Blessing Adeyemi',ARRAY['Dr. Jean Claude Hakizimana','Pharmacist Dr. Anita Ndagijimana'],
 '24 months','2025-06-01','2027-05-31',
 'Patients presenting with respiratory, urinary, or skin infections at community health centers and pharmacies',
 900,'Prospective surveillance study with culture and sensitivity testing. Antimicrobial prescribing patterns analysis. AMR pathway development.',
 'Fleming Fund / UK DHSC',195000,
 'Surveillance study with minimal intervention. Specimen collection via standard clinical procedures.',
 'Written informed consent. Refusal to participate does not affect treatment.',
 '{"AMR_organisms": ["E. coli", "S. aureus", "K. pneumoniae", "S. pneumoniae"], "antibiotics_surveilled": ["Amoxicillin", "Cotrimoxazole", "Ciprofloxacin"]}'::jsonb,
 '2025-04-15 10:00:00','2025-04-05 09:00:00','2025-08-20 14:00:00'),

('90000000-0000-0000-0000-000000000034','RERB-2025-0034',
 'Combination HIV Prevention Package Among Female Sex Workers in Urban Kigali',
 'FULL_BOARD','APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000009','70000000-0000-0000-0000-000000000003',
 'Dr. Victor Kamau',ARRAY['Dr. Eugene Mutimura','Dr. Gallican Ruhangaza'],
 '24 months','2025-07-01','2027-06-30',
 'Female sex workers aged 18 and above engaged in transactional sex in Kigali City',
 300,'Randomized step-in trial of combined PrEP, STI testing and treatment, condom distribution, and peer navigation versus current prevention services.',
 'PEPFAR / NIH HPTN',220000,
 'Research with female sex workers, a key population, requires non-judgmental approach and peer-inclusive design.',
 'Written informed consent in Kinyarwanda and French. No identifying information linked to sexual work.',
 '{"interventionPackage": ["PrEP", "STI testing", "Condom provision", "Peer support"], "primaryOutcome": "HIV incidence at 12 months"}'::jsonb,
 '2025-04-22 14:00:00','2025-04-10 09:00:00','2025-08-28 15:00:00'),

('90000000-0000-0000-0000-000000000035','RERB-2025-0035',
 'Childhood Immunization Coverage and Dropout Rate Determinants',
 'EXPEDITED','APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000010','70000000-0000-0000-0000-000000000005',
 'Dr. Alice Wangari',ARRAY['Dr. Phionah Mukanyana'],
 '10 months','2025-06-01','2026-03-31',
 'Children aged 12-23 months in Nyamagabe and Nyaruguru districts',
 600,'Cross-sectional household survey using WHO 30x7 cluster sampling. Review of immunization cards and caretaker interviews.',
 'Gavi / Rwanda Ministry of Health',22000,
 'Household survey with minimal risk. No clinical procedures performed.',
 'Verbal informed consent from parents/caretakers. No child identifiers stored.',
 '{"vaccines": ["BCG", "OPV", "DTP", "Measles", "HPV"], "primaryOutcome": "Full immunization coverage by age 1"}'::jsonb,
 '2025-05-01 10:00:00','2025-04-20 09:00:00','2025-09-05 10:00:00'),

('90000000-0000-0000-0000-000000000036','RERB-2025-0036',
 'Mental Health Services Integration in Primary Healthcare: An Implementation Study',
 'EXPEDITED','APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000001',
 'Dr. Amara Diallo',ARRAY['Dr. Yvonne Kayitesi','Dr. Theoneste Nkurunziza'],
 '18 months','2025-08-01','2027-01-31',
 'Health center staff and patients with mental disorders at 20 health centers in 5 districts',
 800,'Mixed-methods implementation study using RE-AIM framework. Quantitative assessment of detection rates and treatment coverage alongside qualitative evaluation of implementation fidelity.',
 'Wellcome Trust / National Institute of Mental Health',148000,
 'Implementation research with minimal additional risk to participants. Staff training is beneficial.',
 'Written informed consent from patients. Verbal consent from health workers for interviews.',
 '{"framework": "RE-AIM", "mentalDisorders": ["Depression", "Anxiety", "Psychosis", "Epilepsy"], "primaryOutcome": "Detection and treatment coverage"}'::jsonb,
 '2025-05-08 14:00:00','2025-04-28 09:00:00','2025-09-12 11:00:00'),

-- ======== CONDITIONALLY_APPROVED (37-39) ========
('90000000-0000-0000-0000-000000000037','RERB-2025-0037',
 'Gene Expression Profiling of Breast Cancer Molecular Subtypes in East African Women',
 'FULL_BOARD','CONDITIONALLY_APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000002',
 'Dr. Fatima Okonkwo',ARRAY['Prof. Leon Mutesa','Dr. Clarisse Musabyimana','Bioinformatician Dr. Simon Rubagumya'],
 '36 months','2025-09-01','2028-08-31',
 'Women with histologically confirmed breast cancer presenting for treatment at King Faisal Hospital',
 200,'Prospective biospecimen collection study with tumor and blood sample analysis. Whole exome sequencing and RNA expression profiling. Correlation with clinical outcomes at 3 years.',
 'African Cancer Research Initiative / NCI',285000,
 'Biospecimen collection and genetic analysis require special ethical considerations including data sharing policies and incidental findings management.',
 'Written informed consent for tissue banking, genetic analysis, and data sharing. Genetic counseling available.',
 '{"biospecimens": ["FFPE tumor tissue", "Whole blood for germline DNA"], "analyses": ["WES", "RNA-seq", "IHC profiling"], "dataSharing": "Controlled access database"}'::jsonb,
 '2025-05-15 10:00:00','2025-05-02 09:00:00','2025-09-20 14:00:00'),

('90000000-0000-0000-0000-000000000038','RERB-2025-0038',
 'Tobacco Cessation Interventions Tailored for Pregnant Women in Rwanda',
 'EXPEDITED','CONDITIONALLY_APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000004',
 'Dr. James Mwangi',ARRAY['Midwife Dr. Odette Mukandutiye','Public Health Nurse Anita Uwase'],
 '18 months','2025-10-01','2027-03-31',
 'Pregnant women who self-report current tobacco use at first antenatal visit',
 240,'Randomized trial comparing brief behavioral counseling plus NRT with standard advice. Cotinine verification of cessation status.',
 'Bloomberg Philanthropies / WHO FCTC',72000,
 'NRT in pregnancy requires careful safety monitoring. Conditional approval requires DSMB review of interim safety data.',
 'Written informed consent. Clear explanation of NRT risks and benefits in pregnancy.',
 '{"primaryOutcome": "Cotinine-verified abstinence at delivery", "interventions": ["Brief behavioral counseling", "Nicotine replacement therapy"]}'::jsonb,
 '2025-05-22 14:00:00','2025-05-10 09:00:00','2025-09-28 10:00:00'),

('90000000-0000-0000-0000-000000000039','RERB-2025-0039',
 'Mpox Outbreak Response and Vaccination Coverage Assessment',
 'FULL_BOARD','CONDITIONALLY_APPROVED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000003',
 'Dr. Grace Nakamura',ARRAY['Dr. Claude Semasaka Manzi','Dr. Solange Hakizimana'],
 '12 months','2025-11-01','2026-10-31',
 'Contacts of confirmed mpox cases and high-risk adults in affected districts',
 450,'Vaccine effectiveness study using test-negative design with confirmed mpox cases as cases and test-negative contacts as controls. Ring vaccination assessment.',
 'WHO AFRO / US CDC',88000,
 'Emergency-response research during outbreak requires expedited review with robust safety oversight.',
 'Modified consent procedures approved for public health emergency context with full IRB oversight.',
 '{"vaccines": ["MVA-BN (JYNNEOS)", "LC16m8"], "primaryOutcome": "Vaccine effectiveness against confirmed mpox", "designType": "Test-negative case-control"}'::jsonb,
 '2025-06-01 10:00:00','2025-05-18 09:00:00','2025-10-05 14:00:00'),

-- ======== REJECTED (40-42) ========
('90000000-0000-0000-0000-000000000040','RERB-2025-0040',
 'Experimental Lentiviral Gene Therapy Trial for Sickle Cell Disease',
 'FULL_BOARD','REJECTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000002',
 'Dr. Samuel Mensah',ARRAY['Dr. Paul Ndebwanimana','Hematologist Dr. Jeanne Mukamutara'],
 '48 months','2025-10-01','2029-09-30',
 'Adults aged 18-45 with severe sickle cell disease (HbSS) with at least 3 crises per year',
 40,'Phase I/II dose-escalation trial of autologous hematopoietic stem cell gene therapy using modified lentiviral vector. Ex-vivo transduction followed by myeloablative conditioning.',
 'Gene Therapy Consortium',850000,
 'High-risk experimental gene therapy requires extensive safety data from prior trials.',
 'Detailed written informed consent with extensive information on risks including oncogenic potential.',
 '{"phase": "I/II", "intervention": "LentiGlobin BB305 vector", "primaryOutcome": "Safety and tolerability"}'::jsonb,
 '2025-05-05 10:00:00','2025-04-20 09:00:00','2025-08-15 10:00:00'),

('90000000-0000-0000-0000-000000000041','RERB-2025-0041',
 'Pharmacokinetics of Novel Synthetic Antimalarial Compound in Healthy Volunteers',
 'FULL_BOARD','REJECTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','70000000-0000-0000-0000-000000000001',
 'Dr. Nadia Hassan',ARRAY['Prof. Jean Bosco Nzabahimana','Pharmacologist Dr. Eric Ruhumuliza'],
 '18 months','2025-12-01','2027-05-31',
 'Healthy adult volunteers aged 18-50 with no significant medical conditions',
 48,'Phase I first-in-human study of RW-MQ-201, a novel synthetic quinolone derivative. Single ascending dose followed by multiple ascending dose cohorts with intensive PK sampling.',
 'Malaria Consortium / Rwandan Pharma Ltd',320000,
 'First-in-human phase I trial with novel compound. IND equivalent documentation required per national regulation.',
 'Comprehensive written informed consent. Volunteer insurance provided. Right to withdraw maintained.',
 '{"compound": "RW-MQ-201", "dose_levels": [50, 100, 200, 400, 800], "PKparameters": ["Cmax", "AUC", "t1/2"]}'::jsonb,
 '2025-05-10 14:00:00','2025-04-25 09:00:00','2025-08-22 10:00:00'),

('90000000-0000-0000-0000-000000000042','RERB-2025-0042',
 'Social Media-Based HIV Testing Campaign Among Young People',
 'EXEMPT','REJECTED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000007','70000000-0000-0000-0000-000000000003',
 'Dr. Emmanuel Osei',ARRAY['Digital Health Officer Ruth Kaneza'],
 '8 months','2025-09-01','2026-04-30',
 'Young people aged 15-24 using social media platforms in Kigali',
 1000,'Digital health study using social media advertising to promote HIV self-testing kit requests. Online survey of testing behavior and outcomes. Exempt review requested.',
 'UNAIDS Rwanda',12000,
 'Online study involving minors (15-17) requires parental consent which online study design cannot guarantee.',
 'Online click-through consent only. No parental consent mechanism for minor participants.',
 '{"platforms": ["Instagram", "Twitter", "Facebook"], "primaryOutcome": "HIV self-test kit request rate"}'::jsonb,
 '2025-05-15 10:00:00','2025-05-01 09:00:00','2025-08-28 10:00:00'),

-- ======== AMENDMENT_PENDING (43-44) ========
('90000000-0000-0000-0000-000000000043','RERB-2025-0043',
 'Long-Term Pulmonary Sequelae of COVID-19 in Survivors: A Longitudinal Cohort',
 'FULL_BOARD','AMENDMENT_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000008','70000000-0000-0000-0000-000000000004',
 'Dr. Blessing Adeyemi',ARRAY['Pulmonologist Dr. Eric Rwema','Dr. Christine Kayitare'],
 '36 months','2024-10-01','2027-09-30',
 'Adults with PCR-confirmed COVID-19 who were hospitalized or had severe disease in 2022-2023',
 350,'Prospective longitudinal cohort with 6-monthly assessments including spirometry, 6-minute walk test, CT chest, and patient-reported outcome measures.',
 'Rwanda Medical Research Fund',165000,
 'Long-term follow-up study. Amendment requested to add new biomarker sub-study with additional blood sampling.',
 'Written informed consent with separate addendum consent for biomarker sub-study.',
 '{"assessments": ["Spirometry", "DLCO", "6MWT", "CT chest", "PROMIS-Dyspnea"], "biomarkers": ["IL-6", "D-dimer", "Troponin", "BNP"]}'::jsonb,
 '2024-08-20 10:00:00','2024-08-10 09:00:00','2025-10-15 14:00:00'),

('90000000-0000-0000-0000-000000000044','RERB-2025-0044',
 'Non-Communicable Disease Risk Factor Burden in Elderly Rwandan Populations',
 'FULL_BOARD','AMENDMENT_PENDING',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000009','70000000-0000-0000-0000-000000000005',
 'Dr. Victor Kamau',ARRAY['Geriatrician Dr. Adeline Umurungi','Prof. Antoine Niyibizi'],
 '24 months','2024-11-01','2026-10-31',
 'Community-dwelling adults aged 60 and above in Kigali City and Muhanga district',
 500,'Cross-sectional study with nested cohort. Assessment of NCD prevalence, risk factors, functional status, frailty, and quality of life.',
 'HelpAge International / National Institute of Statistics',78000,
 'Research in elderly population requires attention to cognitive capacity for consent. Amendment adds cognitive assessment tools.',
 'Written informed consent. Capacity assessment using standardized tool. Surrogate consent if needed.',
 '{"NCDs_assessed": ["Hypertension", "Diabetes", "COPD", "Depression", "Dementia"], "functionalTools": ["Barthel Index", "Frailty Phenotype", "MMSE"]}'::jsonb,
 '2024-09-05 10:00:00','2024-08-25 09:00:00','2025-10-22 10:00:00'),

-- ======== MONITORING_ACTIVE (45-47) ========
('90000000-0000-0000-0000-000000000045','RERB-2025-0045',
 'Longitudinal Study of Naturally Acquired Malaria Immunity in Rwandan Children',
 'FULL_BOARD','MONITORING_ACTIVE',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000010','70000000-0000-0000-0000-000000000003',
 'Dr. Alice Wangari',ARRAY['Immunologist Dr. Jean Bosco Gahutu','Dr. Clarisse Musabyimana','Lab Scientist Jean Pierre Hakizimana'],
 '48 months','2024-01-01','2027-12-31',
 'Children aged 1-10 years in malaria-endemic areas of Kayonza and Kirehe districts followed annually',
 600,'Longitudinal cohort with annual enrollment. Blood sampling at each visit for malaria PCR, antibody profiling, and cellular immunology. Active and passive case detection for malaria episodes.',
 'MRC UK / Malaria Consortium',380000,
 'Longitudinal blood sampling in children requires robust assent process and parental consent at each visit.',
 'Annual re-consent from parents/guardians and child assent renewal for participants aged 7 and above.',
 '{"immunoAssays": ["Antibody ELISA", "Flow cytometry", "IFN-gamma ELISpot"], "malariaEpisodes": "Active + passive surveillance"}'::jsonb,
 '2023-10-15 10:00:00','2023-10-01 09:00:00','2024-01-15 14:00:00'),

('90000000-0000-0000-0000-000000000046','RERB-2025-0046',
 'HIV Self-Testing Distribution and Linkage to Care Program Evaluation',
 'FULL_BOARD','MONITORING_ACTIVE',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','70000000-0000-0000-0000-000000000003',
 'Dr. Amara Diallo',ARRAY['Dr. Odette Mukashyaka','Dr. Jean Claude Karangwa'],
 '24 months','2024-06-01','2026-05-31',
 'Adults aged 18-49 in urban and peri-urban areas of Kigali who have never tested for HIV or tested more than 12 months ago',
 1200,'Hybrid effectiveness-implementation trial using HIV self-test kit distribution through community networks, workplaces, and pharmacies. Linkage coordinator support for reactive testers.',
 'ViiV Healthcare Positive Action',175000,
 'HIV self-testing program. Counseling referral for reactive results. Ongoing monitoring of linkage and care outcomes.',
 'Brief electronic consent for kit receipt. Detailed written consent for follow-up interviews.',
 '{"kitDistribution": ["Community", "Workplace", "Pharmacy"], "primaryOutcome": "HIV testing coverage at 6 months", "secondaryOutcome": "Linkage to care rate among reactive testers"}'::jsonb,
 '2024-02-20 10:00:00','2024-02-10 09:00:00','2024-06-05 14:00:00'),

('90000000-0000-0000-0000-000000000047','RERB-2025-0047',
 'Iron and Folic Acid Supplementation Efficacy in Pregnant Women with Anemia',
 'EXPEDITED','MONITORING_ACTIVE',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','70000000-0000-0000-0000-000000000001',
 'Dr. Fatima Okonkwo',ARRAY['Hematologist Dr. Immaculate Uwimana','Nutritionist Vestine Mukamurenzi'],
 '18 months','2024-07-01','2025-12-31',
 'Pregnant women between 14-20 weeks gestation with hemoglobin 7-10 g/dL at antenatal clinics in 8 health centers',
 360,'Randomized controlled trial comparing standard IFA supplementation with enhanced IFA plus vitamin C for absorption optimization. Monthly CBC monitoring.',
 'Nutrition International',52000,
 'Supplementation trial with established nutritional interventions. Monthly safety monitoring for severe anemia.',
 'Written informed consent at first ANC visit. Right to continue standard care if withdrawal.',
 '{"primaryOutcome": "Hemoglobin improvement at 28 weeks", "supplementDoses": ["IFA standard", "IFA enhanced + Vitamin C"]}'::jsonb,
 '2024-03-10 10:00:00','2024-02-25 09:00:00','2024-07-05 14:00:00'),

-- ======== CLOSED (48-50) ========
('90000000-0000-0000-0000-000000000048','RERB-2024-0048',
 'Rotavirus Vaccine Effectiveness in Preventing Severe Diarrhea in Rwandan Infants',
 'EXPEDITED','CLOSED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','70000000-0000-0000-0000-000000000005',
 'Dr. James Mwangi',ARRAY['Dr. Regine Uwingabire','Dr. Celestin Gasana'],
 '24 months','2022-09-01','2024-08-31',
 'Infants aged 6 weeks to 12 months admitted with acute gastroenteritis at district hospitals',
 800,'Test-negative case-control study. Cases are rotavirus-positive, controls are rotavirus-negative among all gastroenteritis admissions. Immunization status verified from vaccination cards.',
 'Gavi / RSTC Rwanda',68000,
 'Study completed successfully. All data collected, analyzed, and manuscript submitted.',
 'Parent/guardian written consent. Study now closed to new enrollment.',
 '{"finalResults": {"casesEnrolled": 398, "controlsEnrolled": 402, "vaccineEffectiveness": "72% (95% CI: 58-82%)"}}'::jsonb,
 '2022-07-15 10:00:00','2022-07-01 09:00:00','2024-09-10 10:00:00'),

('90000000-0000-0000-0000-000000000049','RERB-2024-0049',
 'Community-Based Malaria Vector Control Using Long-Lasting Insecticidal Nets',
 'FULL_BOARD','CLOSED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','70000000-0000-0000-0000-000000000003',
 'Dr. Grace Nakamura',ARRAY['Dr. Fredrick Kateera','Entomologist Dr. Gorette Inkera'],
 '36 months','2021-06-01','2024-05-31',
 'Households in malaria-endemic areas of Eastern Province',
 2400,'Cluster-randomized trial of universal LLIN coverage with annual distribution versus standard conditional distribution. Entomological and epidemiological monitoring.',
 'Global Fund / PMI Rwanda',520000,
 'Study completed. Final report submitted to Global Fund. Publication in peer-reviewed journal pending.',
 'Household head written consent. Study closed.',
 '{"finalResults": {"baselineMalariaPrevalence": "18.4%", "endlinePrevalence": "9.2%", "reductionRate": "50%"}}'::jsonb,
 '2021-03-20 10:00:00','2021-03-01 09:00:00','2024-06-15 10:00:00'),

('90000000-0000-0000-0000-000000000050','RERB-2024-0050',
 'Quality Improvement in Antenatal Care Services at Rural Health Facilities',
 'EXPEDITED','CLOSED',
 '10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','70000000-0000-0000-0000-000000000001',
 'Dr. Samuel Mensah',ARRAY['Midwife Dr. Pascaline Ndayambaje','Dr. Leah Mukankusi'],
 '18 months','2022-11-01','2024-04-30',
 'Pregnant women attending ANC at 15 rural health centers in 3 districts',
 1800,'Stepped-wedge cluster-randomized quality improvement study implementing WHO ANC guideline bundle. Healthcare provider training and performance feedback included.',
 'UNFPA / Rwanda Ministry of Health',95000,
 'Study successfully completed. ANC quality improved significantly. Findings being integrated into national guidelines.',
 'Written consent for patient interviews. Waiver for routine care observation.',
 '{"finalResults": {"baselineANCCompliance": "42%", "endlineCompliance": "78%", "maternalOutcomes": "Improved across all indicators"}}'::jsonb,
 '2022-09-05 10:00:00','2022-08-20 09:00:00','2024-05-20 10:00:00');

-- ============================================================
-- APPLICATION DOCUMENTS (for apps 6-50 that are submitted+)
-- ============================================================
INSERT INTO application_documents (id, "applicationId", "fileName", "originalName", "mimeType", size, path, "documentType", version, "uploadedById", "createdAt") VALUES
-- App 6
(gen_random_uuid(),'90000000-0000-0000-0000-000000000006','protocol_app006_v1.pdf','Research Protocol - ART Adherence Adolescents.pdf','application/pdf',2456789,'/uploads/docs/protocol_app006_v1.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000001','2025-02-10 14:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000006','consent_app006_v1.pdf','Informed Consent Form - ART Adolescents.pdf','application/pdf',445200,'/uploads/docs/consent_app006_v1.pdf','CONSENT_FORM',1,'20000000-0000-0000-0000-000000000001','2025-02-10 14:06:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000006','cv_pi_app006.pdf','CV - Dr Amara Diallo.pdf','application/pdf',310500,'/uploads/docs/cv_pi_app006.pdf','CV',1,'20000000-0000-0000-0000-000000000001','2025-02-10 14:07:00'),
-- App 7
(gen_random_uuid(),'90000000-0000-0000-0000-000000000007','protocol_app007_v1.pdf','Research Protocol - Cervical Cancer Screening.pdf','application/pdf',1987600,'/uploads/docs/protocol_app007_v1.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000002','2025-02-18 11:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000007','questionnaire_app007.pdf','KAP Questionnaire - Cervical Cancer.pdf','application/pdf',234100,'/uploads/docs/questionnaire_app007.pdf','QUESTIONNAIRE',1,'20000000-0000-0000-0000-000000000002','2025-02-18 11:06:00'),
-- App 8
(gen_random_uuid(),'90000000-0000-0000-0000-000000000008','protocol_app008_v1.pdf','Research Protocol - Childhood Pneumonia QI.pdf','application/pdf',3102400,'/uploads/docs/protocol_app008_v1.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000003','2025-02-25 16:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000008','consent_app008_v1.pdf','Parental Consent Form - Pneumonia Study.pdf','application/pdf',512300,'/uploads/docs/consent_app008_v1.pdf','CONSENT_FORM',1,'20000000-0000-0000-0000-000000000003','2025-02-25 16:06:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000008','budget_app008.pdf','Study Budget Breakdown.pdf','application/pdf',198400,'/uploads/docs/budget_app008.pdf','BUDGET',1,'20000000-0000-0000-0000-000000000003','2025-02-25 16:07:00'),
-- App 11
(gen_random_uuid(),'90000000-0000-0000-0000-000000000011','protocol_app011_v1.pdf','Research Protocol - COVID Vaccine HCW.pdf','application/pdf',2234500,'/uploads/docs/protocol_app011_v1.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000006','2025-03-15 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000011','ethics_app011.pdf','Institutional Ethics Clearance.pdf','application/pdf',445600,'/uploads/docs/ethics_app011.pdf','ETHICS_APPROVAL',1,'20000000-0000-0000-0000-000000000006','2025-03-15 10:06:00'),
-- App 12
(gen_random_uuid(),'90000000-0000-0000-0000-000000000012','protocol_app012_v2.pdf','Research Protocol - DR-TB Outcomes v2.pdf','application/pdf',3456700,'/uploads/docs/protocol_app012_v2.pdf','PROTOCOL',2,'20000000-0000-0000-0000-000000000007','2025-03-20 14:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000012','consent_app012.pdf','Informed Consent Form - DR-TB.pdf','application/pdf',523400,'/uploads/docs/consent_app012.pdf','CONSENT_FORM',1,'20000000-0000-0000-0000-000000000007','2025-03-20 14:06:00'),
-- Apps 14-50 — representative documents
(gen_random_uuid(),'90000000-0000-0000-0000-000000000014','protocol_app014.pdf','Protocol - Maternal Mental Health Screening.pdf','application/pdf',2100000,'/uploads/docs/protocol_app014.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000009','2025-04-05 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000014','consent_app014.pdf','Consent Form - Maternal Mental Health.pdf','application/pdf',438000,'/uploads/docs/consent_app014.pdf','CONSENT_FORM',1,'20000000-0000-0000-0000-000000000009','2025-04-05 10:06:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','protocol_app017.pdf','Protocol - HIV-TB Co-infection.pdf','application/pdf',2800000,'/uploads/docs/protocol_app017.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000002','2025-04-28 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','consent_app017.pdf','Consent Form - HIV-TB Study.pdf','application/pdf',501000,'/uploads/docs/consent_app017.pdf','CONSENT_FORM',1,'20000000-0000-0000-0000-000000000002','2025-04-28 10:06:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','protocol_app020.pdf','Protocol - Preterm Birth Prevention.pdf','application/pdf',2450000,'/uploads/docs/protocol_app020.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000005','2025-05-20 14:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','protocol_app023.pdf','Protocol - Infant Feeding HIV.pdf','application/pdf',2600000,'/uploads/docs/protocol_app023.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000008','2025-06-10 11:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','protocol_app025.pdf','Protocol - Malaria RDT Accuracy.pdf','application/pdf',1890000,'/uploads/docs/protocol_app025.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000010','2025-06-25 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','protocol_app033.pdf','Protocol - AMR Surveillance.pdf','application/pdf',2340000,'/uploads/docs/protocol_app033.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000008','2025-04-15 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','protocol_app034.pdf','Protocol - HIV Prevention FSW.pdf','application/pdf',2780000,'/uploads/docs/protocol_app034.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000009','2025-04-22 14:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','protocol_app043.pdf','Protocol - Long COVID Pulmonary.pdf','application/pdf',3100000,'/uploads/docs/protocol_app043.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000008','2024-08-20 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','amendment_app043.pdf','Amendment 1 - Biomarker Sub-Study.pdf','application/pdf',890000,'/uploads/docs/amendment_app043.pdf','AMENDMENT_DOCUMENT',1,'20000000-0000-0000-0000-000000000008','2025-10-15 14:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','protocol_app045.pdf','Protocol - Malaria Immunity Longitudinal.pdf','application/pdf',3200000,'/uploads/docs/protocol_app045.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000010','2023-10-15 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','protocol_app046.pdf','Protocol - HIV Self-Testing Program.pdf','application/pdf',2100000,'/uploads/docs/protocol_app046.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000001','2024-02-20 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000048','protocol_app048.pdf','Protocol - Rotavirus Vaccine Effectiveness.pdf','application/pdf',1980000,'/uploads/docs/protocol_app048.pdf','PROTOCOL',1,'20000000-0000-0000-0000-000000000003','2022-07-15 10:05:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000049','closure_app049.pdf','Final Closure Report - LLIN Study.pdf','application/pdf',1450000,'/uploads/docs/closure_app049.pdf','CLOSURE_DOCUMENT',1,'20000000-0000-0000-0000-000000000004','2024-06-15 10:05:00');

-- ============================================================
-- WORKFLOW TRANSITIONS
-- ============================================================
INSERT INTO workflow_transitions (id, "applicationId", "fromStatus", "toStatus", "actorId", reason, notes, "createdAt") VALUES
-- Apps 6-10: DRAFT → SUBMITTED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000006','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000001',NULL,'Application submitted by principal investigator','2025-02-10 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000007','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000002',NULL,'Application submitted by principal investigator','2025-02-18 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000008','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000003',NULL,'Application submitted by principal investigator','2025-02-25 16:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000009','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000004',NULL,'Application submitted by principal investigator','2025-03-03 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000010','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000005',NULL,'Application submitted by principal investigator','2025-03-10 15:00:00'),
-- Apps 11-13: + SUBMITTED → SCREENING
(gen_random_uuid(),'90000000-0000-0000-0000-000000000011','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000006',NULL,'Application submitted','2025-03-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000011','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Initial completeness check passed. Assigned for scientific review.','2025-03-20 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000012','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000007',NULL,'Application submitted','2025-03-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000012','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Documents verified. Moving to screening committee.','2025-03-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000013','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000008',NULL,'Application submitted','2025-03-28 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000013','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'All required documents present. Proceeding to screening.','2025-04-02 09:00:00'),
-- Apps 14-16: + SCREENING → PAYMENT_PENDING
(gen_random_uuid(),'90000000-0000-0000-0000-000000000014','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000009',NULL,'Application submitted','2025-04-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000014','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-04-08 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000014','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Screening complete. Invoice generated for application fee.','2025-04-10 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000015','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000010',NULL,'Application submitted','2025-04-12 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000015','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-04-14 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000015','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Screening passed. Payment required.','2025-04-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000016','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000001',NULL,'Application submitted','2025-04-20 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000016','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-04-21 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000016','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Screening complete. Payment invoice issued.','2025-04-22 09:00:00'),
-- Apps 17-19: + PAYMENT_PENDING → PAYMENT_VERIFIED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000002',NULL,'Application submitted','2025-04-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-04-30 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Payment invoice generated','2025-05-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000017','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment of RWF 250,000 received and verified. Bank transfer confirmed.','2025-05-05 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000018','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000003',NULL,'Application submitted','2025-05-05 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000018','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-05-07 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000018','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Payment required','2025-05-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000018','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified. Bank transfer reference: RWF-2025-0018-EXP','2025-05-12 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000019','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000004',NULL,'Application submitted','2025-05-12 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000019','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-05-14 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000019','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Payment invoice generated','2025-05-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000019','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment of RWF 50,000 confirmed','2025-05-18 10:00:00'),
-- Apps 20-24: + PAYMENT_VERIFIED → UNDER_REVIEW
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000005',NULL,'Application submitted','2025-05-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-05-22 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-05-23 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-05-24 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Reviewers assigned. Full board review commenced.','2025-05-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000006',NULL,'Application submitted','2025-05-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening initiated','2025-05-30 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-05-31 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-06-01 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review assigned to two reviewers','2025-06-02 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000007',NULL,'Application submitted','2025-06-04 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-06-06 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-06-07 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment confirmed','2025-06-08 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Full board review assigned','2025-06-09 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000008',NULL,'Application submitted','2025-06-10 11:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-06-12 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice issued','2025-06-13 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-06-13 15:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Assigned to full board reviewers','2025-06-14 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000009',NULL,'Application submitted','2025-06-18 16:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-06-20 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Payment required','2025-06-21 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment confirmed','2025-06-21 16:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Full board review commenced','2025-06-22 10:00:00'),
-- Apps 25-27: + UNDER_REVIEW → QUERY_RAISED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000010',NULL,'Application submitted','2025-06-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-06-27 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-06-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-06-29 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review assigned','2025-06-30 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','UNDER_REVIEW','QUERY_RAISED','30000000-0000-0000-0000-000000000001',NULL,'Reviewer has raised questions regarding reference standard methodology','2025-07-02 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000001',NULL,'Application submitted','2025-07-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-07-03 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-07-03 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-07-04 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Full board review started','2025-07-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','UNDER_REVIEW','QUERY_RAISED','30000000-0000-0000-0000-000000000002',NULL,'Query raised regarding withdrawal procedures for terminally ill patients','2025-07-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000002',NULL,'Application submitted','2025-07-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-07-07 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-07-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment confirmed','2025-07-09 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review assigned','2025-07-10 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','UNDER_REVIEW','QUERY_RAISED','30000000-0000-0000-0000-000000000003',NULL,'Query regarding consent for children under 7 in household clusters','2025-07-12 10:00:00'),
-- Apps 28-29: + QUERY_RAISED → RESPONSE_RECEIVED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000003',NULL,'Application submitted','2025-07-12 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-07-14 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-07-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-07-15 15:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review assigned','2025-07-16 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','UNDER_REVIEW','QUERY_RAISED','30000000-0000-0000-0000-000000000004',NULL,'Query raised on praziquantel dosing for children under 10kg','2025-07-20 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','QUERY_RAISED','RESPONSE_RECEIVED','20000000-0000-0000-0000-000000000003',NULL,'Applicant has provided detailed response to reviewer queries','2025-07-25 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000004',NULL,'Application submitted','2025-07-18 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-07-20 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-07-21 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-07-22 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Full board review assigned','2025-07-23 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','UNDER_REVIEW','QUERY_RAISED','30000000-0000-0000-0000-000000000001',NULL,'Question on NRT use in first trimester safety data','2025-07-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','QUERY_RAISED','RESPONSE_RECEIVED','20000000-0000-0000-0000-000000000004',NULL,'Response with updated safety monitoring protocol received','2025-08-02 10:00:00'),
-- Apps 30-32: → DECISION_PENDING (via UNDER_REVIEW)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000005',NULL,'Application submitted','2025-07-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-07-27 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-07-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment confirmed','2025-07-29 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Full board review commenced','2025-07-30 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'All reviewers completed assessment. Presenting to full board for decision.','2025-08-05 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000006',NULL,'Application submitted','2025-07-30 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-08-01 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-08-02 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-08-03 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review assigned','2025-08-04 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Review complete. Proceeding to board decision.','2025-08-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','DRAFT','SUBMITTED','20000000-0000-0000-0000-000000000007',NULL,'Application submitted','2025-08-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','SUBMITTED','SCREENING','40000000-0000-0000-0000-000000000001',NULL,'Screening started','2025-08-07 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','SCREENING','PAYMENT_PENDING','40000000-0000-0000-0000-000000000001',NULL,'Invoice generated','2025-08-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','PAYMENT_PENDING','PAYMENT_VERIFIED','50000000-0000-0000-0000-000000000001',NULL,'Payment verified','2025-08-09 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review assigned','2025-08-10 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviewers completed. Awaiting board meeting.','2025-08-12 10:00:00'),
-- Apps 33-36: → APPROVED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review assigned','2025-04-20 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Review complete','2025-05-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Board unanimously approved. Full ethics clearance granted.','2025-08-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review assigned','2025-04-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Review complete','2025-05-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Ethics approval granted with standard monitoring conditions.','2025-08-28 15:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000035','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review started','2025-05-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000035','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Review complete','2025-06-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000035','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. Ethics certificate valid for 12 months.','2025-09-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000036','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review started','2025-05-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000036','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Review complete','2025-06-10 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000036','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved with annual progress report requirement.','2025-09-12 11:00:00'),
-- Apps 37-39: → CONDITIONALLY_APPROVED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000037','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2025-06-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000037','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-07-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000037','DECISION_PENDING','CONDITIONALLY_APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Conditionally approved. Genetic data governance plan required within 30 days.','2025-09-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000038','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2025-06-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000038','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-07-10 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000038','DECISION_PENDING','CONDITIONALLY_APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved conditional on DSMB approval of interim safety data within 6 months.','2025-09-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000039','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review started','2025-06-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000039','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-07-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000039','DECISION_PENDING','CONDITIONALLY_APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved with modified consent procedures. Ministry of Health concurrence required.','2025-10-05 14:00:00'),
-- Apps 40-42: → REJECTED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000040','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2025-05-20 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000040','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-06-20 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000040','DECISION_PENDING','REJECTED','60000000-0000-0000-0000-000000000001',NULL,'Rejected. Insufficient pre-clinical safety data for first-in-human gene therapy.','2025-08-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000041','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2025-05-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000041','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-06-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000041','DECISION_PENDING','REJECTED','60000000-0000-0000-0000-000000000001',NULL,'Rejected. IND equivalent documentation not provided. Sponsor must obtain regulatory clearance first.','2025-08-22 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000042','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Expedited review started','2025-06-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000042','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2025-06-28 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000042','DECISION_PENDING','REJECTED','60000000-0000-0000-0000-000000000001',NULL,'Rejected. EXEMPT category inappropriate - minors included without parental consent mechanism.','2025-08-28 10:00:00'),
-- Apps 43-44: → AMENDMENT_PENDING (were APPROVED, amendment submitted)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2024-09-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2024-10-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. Annual reporting required.','2024-11-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043','APPROVED','AMENDMENT_PENDING','20000000-0000-0000-0000-000000000008',NULL,'Amendment submitted to add biomarker sub-study with additional blood sampling protocol.','2025-10-15 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000044','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2024-10-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000044','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2024-11-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000044','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. 6-monthly progress reports required.','2024-12-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000044','APPROVED','AMENDMENT_PENDING','20000000-0000-0000-0000-000000000009',NULL,'Amendment to add MoCA cognitive assessment tool and extend sample size.','2025-10-22 10:00:00'),
-- Apps 45-47: → MONITORING_ACTIVE (were APPROVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2023-11-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2023-12-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. Study enrolled first participants.','2024-01-15 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'First progress report submitted. Study in active monitoring phase.','2025-01-15 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2024-03-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2024-04-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. Ethics certificate issued.','2024-06-05 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'Progress report 1 received. Monitoring activated.','2024-12-05 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047','PAYMENT_VERIFIED','UNDER_REVIEW','40000000-0000-0000-0000-000000000001',NULL,'Review started','2024-04-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047','UNDER_REVIEW','DECISION_PENDING','60000000-0000-0000-0000-000000000001',NULL,'Reviews complete','2024-05-01 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved. Quarterly safety reports required.','2024-07-05 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'Study actively enrolling. First monitoring report submitted.','2024-10-05 14:00:00'),
-- Apps 48-50: → CLOSED
(gen_random_uuid(),'90000000-0000-0000-0000-000000000048','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved','2022-09-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000048','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'Monitoring activated','2023-03-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000048','MONITORING_ACTIVE','CLOSED','40000000-0000-0000-0000-000000000001',NULL,'Study completed. Final report and publication submitted.','2024-09-10 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000049','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved','2021-06-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000049','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'Monitoring activated','2021-12-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000049','MONITORING_ACTIVE','CLOSED','40000000-0000-0000-0000-000000000001',NULL,'Closed. Findings published in Lancet Global Health.','2024-06-15 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000050','DECISION_PENDING','APPROVED','60000000-0000-0000-0000-000000000001',NULL,'Approved','2022-11-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000050','APPROVED','MONITORING_ACTIVE','40000000-0000-0000-0000-000000000001',NULL,'Monitoring activated','2023-05-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000050','MONITORING_ACTIVE','CLOSED','40000000-0000-0000-0000-000000000001',NULL,'Study closed successfully. Integrated into national ANC guidelines.','2024-05-20 10:00:00');


-- ============================================================
-- INVOICES (apps 14-50)
-- ============================================================
INSERT INTO invoices (id, "applicationId", amount, currency, description, "dueDate", status, "createdAt", "updatedAt") VALUES
-- PAYMENT_PENDING apps (status = PENDING)
('a0000000-0000-0000-0000-000000000014','90000000-0000-0000-0000-000000000014',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0014','2025-04-30 00:00:00','PENDING','2025-04-10 11:00:00','2025-04-10 11:00:00'),
('a0000000-0000-0000-0000-000000000015','90000000-0000-0000-0000-000000000015',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0015','2025-04-30 00:00:00','PENDING','2025-04-15 10:00:00','2025-04-15 10:00:00'),
('a0000000-0000-0000-0000-000000000016','90000000-0000-0000-0000-000000000016',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0016','2025-05-10 00:00:00','PENDING','2025-04-22 09:00:00','2025-04-22 09:00:00'),
-- PAYMENT_VERIFIED and above (status = VERIFIED)
('a0000000-0000-0000-0000-000000000017','90000000-0000-0000-0000-000000000017',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0017','2025-05-15 00:00:00','VERIFIED','2025-05-01 10:00:00','2025-05-05 11:00:00'),
('a0000000-0000-0000-0000-000000000018','90000000-0000-0000-0000-000000000018',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0018','2025-05-20 00:00:00','VERIFIED','2025-05-08 10:00:00','2025-05-12 10:00:00'),
('a0000000-0000-0000-0000-000000000019','90000000-0000-0000-0000-000000000019', 50000,'RWF','Ethics review fee - Exempt application RERB-2025-0019','2025-05-28 00:00:00','VERIFIED','2025-05-15 10:00:00','2025-05-18 10:00:00'),
('a0000000-0000-0000-0000-000000000020','90000000-0000-0000-0000-000000000020',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0020','2025-06-05 00:00:00','VERIFIED','2025-05-23 10:00:00','2025-05-24 10:00:00'),
('a0000000-0000-0000-0000-000000000021','90000000-0000-0000-0000-000000000021',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0021','2025-06-10 00:00:00','VERIFIED','2025-05-31 09:00:00','2025-06-01 09:00:00'),
('a0000000-0000-0000-0000-000000000022','90000000-0000-0000-0000-000000000022',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0022','2025-06-20 00:00:00','VERIFIED','2025-06-07 10:00:00','2025-06-08 09:00:00'),
('a0000000-0000-0000-0000-000000000023','90000000-0000-0000-0000-000000000023',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0023','2025-06-25 00:00:00','VERIFIED','2025-06-13 10:00:00','2025-06-13 15:00:00'),
('a0000000-0000-0000-0000-000000000024','90000000-0000-0000-0000-000000000024',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0024','2025-07-01 00:00:00','VERIFIED','2025-06-21 10:00:00','2025-06-21 16:00:00'),
('a0000000-0000-0000-0000-000000000025','90000000-0000-0000-0000-000000000025',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0025','2025-07-10 00:00:00','VERIFIED','2025-06-28 10:00:00','2025-06-29 09:00:00'),
('a0000000-0000-0000-0000-000000000026','90000000-0000-0000-0000-000000000026',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0026','2025-07-15 00:00:00','VERIFIED','2025-07-03 14:00:00','2025-07-04 09:00:00'),
('a0000000-0000-0000-0000-000000000027','90000000-0000-0000-0000-000000000027', 50000,'RWF','Ethics review fee - Exempt application RERB-2025-0027','2025-07-20 00:00:00','VERIFIED','2025-07-08 10:00:00','2025-07-09 09:00:00'),
('a0000000-0000-0000-0000-000000000028','90000000-0000-0000-0000-000000000028',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0028','2025-07-25 00:00:00','VERIFIED','2025-07-15 10:00:00','2025-07-15 15:00:00'),
('a0000000-0000-0000-0000-000000000029','90000000-0000-0000-0000-000000000029',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0029','2025-08-01 00:00:00','VERIFIED','2025-07-21 10:00:00','2025-07-22 09:00:00'),
('a0000000-0000-0000-0000-000000000030','90000000-0000-0000-0000-000000000030',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0030','2025-08-10 00:00:00','VERIFIED','2025-07-28 10:00:00','2025-07-29 09:00:00'),
('a0000000-0000-0000-0000-000000000031','90000000-0000-0000-0000-000000000031',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0031','2025-08-15 00:00:00','VERIFIED','2025-08-02 10:00:00','2025-08-03 09:00:00'),
('a0000000-0000-0000-0000-000000000032','90000000-0000-0000-0000-000000000032',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0032','2025-08-20 00:00:00','VERIFIED','2025-08-08 10:00:00','2025-08-09 09:00:00'),
('a0000000-0000-0000-0000-000000000033','90000000-0000-0000-0000-000000000033',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0033','2025-05-01 00:00:00','VERIFIED','2025-04-18 10:00:00','2025-04-19 09:00:00'),
('a0000000-0000-0000-0000-000000000034','90000000-0000-0000-0000-000000000034',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0034','2025-05-08 00:00:00','VERIFIED','2025-04-25 10:00:00','2025-04-26 09:00:00'),
('a0000000-0000-0000-0000-000000000035','90000000-0000-0000-0000-000000000035',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0035','2025-05-15 00:00:00','VERIFIED','2025-05-02 10:00:00','2025-05-03 09:00:00'),
('a0000000-0000-0000-0000-000000000036','90000000-0000-0000-0000-000000000036',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0036','2025-05-20 00:00:00','VERIFIED','2025-05-08 10:00:00','2025-05-09 09:00:00'),
('a0000000-0000-0000-0000-000000000037','90000000-0000-0000-0000-000000000037',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0037','2025-06-01 00:00:00','VERIFIED','2025-05-20 10:00:00','2025-05-21 09:00:00'),
('a0000000-0000-0000-0000-000000000038','90000000-0000-0000-0000-000000000038',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0038','2025-06-10 00:00:00','VERIFIED','2025-05-25 10:00:00','2025-05-26 09:00:00'),
('a0000000-0000-0000-0000-000000000039','90000000-0000-0000-0000-000000000039',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0039','2025-06-15 00:00:00','VERIFIED','2025-05-28 10:00:00','2025-05-29 09:00:00'),
('a0000000-0000-0000-0000-000000000040','90000000-0000-0000-0000-000000000040',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0040','2025-06-01 00:00:00','VERIFIED','2025-05-15 10:00:00','2025-05-16 09:00:00'),
('a0000000-0000-0000-0000-000000000041','90000000-0000-0000-0000-000000000041',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0041','2025-06-05 00:00:00','VERIFIED','2025-05-18 10:00:00','2025-05-19 09:00:00'),
('a0000000-0000-0000-0000-000000000042','90000000-0000-0000-0000-000000000042', 50000,'RWF','Ethics review fee - Exempt application RERB-2025-0042','2025-06-10 00:00:00','VERIFIED','2025-05-22 10:00:00','2025-05-23 09:00:00'),
('a0000000-0000-0000-0000-000000000043','90000000-0000-0000-0000-000000000043',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0043','2024-10-01 00:00:00','VERIFIED','2024-09-10 10:00:00','2024-09-11 09:00:00'),
('a0000000-0000-0000-0000-000000000044','90000000-0000-0000-0000-000000000044',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0044','2024-10-15 00:00:00','VERIFIED','2024-09-20 10:00:00','2024-09-21 09:00:00'),
('a0000000-0000-0000-0000-000000000045','90000000-0000-0000-0000-000000000045',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0045','2023-12-01 00:00:00','VERIFIED','2023-11-10 10:00:00','2023-11-11 09:00:00'),
('a0000000-0000-0000-0000-000000000046','90000000-0000-0000-0000-000000000046',250000,'RWF','Ethics review fee - Full Board application RERB-2025-0046','2024-04-01 00:00:00','VERIFIED','2024-03-10 10:00:00','2024-03-11 09:00:00'),
('a0000000-0000-0000-0000-000000000047','90000000-0000-0000-0000-000000000047',150000,'RWF','Ethics review fee - Expedited application RERB-2025-0047','2024-05-01 00:00:00','VERIFIED','2024-04-10 10:00:00','2024-04-11 09:00:00'),
('a0000000-0000-0000-0000-000000000048','90000000-0000-0000-0000-000000000048',150000,'RWF','Ethics review fee - Expedited application RERB-2024-0048','2022-08-01 00:00:00','VERIFIED','2022-07-20 10:00:00','2022-07-21 09:00:00'),
('a0000000-0000-0000-0000-000000000049','90000000-0000-0000-0000-000000000049',250000,'RWF','Ethics review fee - Full Board application RERB-2024-0049','2021-04-01 00:00:00','VERIFIED','2021-03-15 10:00:00','2021-03-16 09:00:00'),
('a0000000-0000-0000-0000-000000000050','90000000-0000-0000-0000-000000000050',150000,'RWF','Ethics review fee - Expedited application RERB-2024-0050','2022-10-01 00:00:00','VERIFIED','2022-09-15 10:00:00','2022-09-16 09:00:00');

-- ============================================================
-- PAYMENTS (apps 17-50 that have VERIFIED invoices)
-- ============================================================
INSERT INTO payments (id, "invoiceId", amount, method, "referenceNumber", status, "verifiedById", "verifiedAt", notes, "createdAt") VALUES
('b0000000-0000-0000-0000-000000000017','a0000000-0000-0000-0000-000000000017',250000,'BANK_TRANSFER','BNR-TXN-2025-0017-A','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-05 11:00:00','Bank of Kigali transfer confirmed. Reference matches invoice.','2025-05-03 10:00:00'),
('b0000000-0000-0000-0000-000000000018','a0000000-0000-0000-0000-000000000018',150000,'MOBILE_MONEY','MTN-MOMO-2025-0018-B','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-12 10:00:00','MTN Mobile Money transfer verified.','2025-05-10 09:00:00'),
('b0000000-0000-0000-0000-000000000019','a0000000-0000-0000-0000-000000000019', 50000,'MOBILE_MONEY','MTN-MOMO-2025-0019-C','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-18 10:00:00','Payment confirmed via MTN MoMo.','2025-05-16 09:00:00'),
('b0000000-0000-0000-0000-000000000020','a0000000-0000-0000-0000-000000000020',250000,'BANK_TRANSFER','BNR-TXN-2025-0020-D','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-24 10:00:00','Transfer verified. Amount matches invoice.','2025-05-22 09:00:00'),
('b0000000-0000-0000-0000-000000000021','a0000000-0000-0000-0000-000000000021',150000,'BANK_TRANSFER','BNR-TXN-2025-0021-E','VERIFIED','50000000-0000-0000-0000-000000000001','2025-06-01 09:00:00','Bank transfer confirmed.','2025-05-30 09:00:00'),
('b0000000-0000-0000-0000-000000000022','a0000000-0000-0000-0000-000000000022',250000,'MOBILE_MONEY','AIRTEL-2025-0022-F','VERIFIED','50000000-0000-0000-0000-000000000001','2025-06-08 09:00:00','Airtel Money payment verified.','2025-06-06 09:00:00'),
('b0000000-0000-0000-0000-000000000023','a0000000-0000-0000-0000-000000000023',250000,'BANK_TRANSFER','BNR-TXN-2025-0023-G','VERIFIED','50000000-0000-0000-0000-000000000001','2025-06-13 15:00:00','Payment confirmed.','2025-06-11 09:00:00'),
('b0000000-0000-0000-0000-000000000024','a0000000-0000-0000-0000-000000000024',250000,'BANK_TRANSFER','BNR-TXN-2025-0024-H','VERIFIED','50000000-0000-0000-0000-000000000001','2025-06-21 16:00:00','Payment received and verified.','2025-06-19 09:00:00'),
('b0000000-0000-0000-0000-000000000025','a0000000-0000-0000-0000-000000000025',150000,'MOBILE_MONEY','MTN-MOMO-2025-0025-I','VERIFIED','50000000-0000-0000-0000-000000000001','2025-06-29 09:00:00','MTN MoMo payment confirmed.','2025-06-27 09:00:00'),
('b0000000-0000-0000-0000-000000000026','a0000000-0000-0000-0000-000000000026',250000,'BANK_TRANSFER','BNR-TXN-2025-0026-J','VERIFIED','50000000-0000-0000-0000-000000000001','2025-07-04 09:00:00','Transfer verified.','2025-07-02 09:00:00'),
('b0000000-0000-0000-0000-000000000027','a0000000-0000-0000-0000-000000000027', 50000,'MOBILE_MONEY','MTN-MOMO-2025-0027-K','VERIFIED','50000000-0000-0000-0000-000000000001','2025-07-09 09:00:00','Payment confirmed.','2025-07-07 09:00:00'),
('b0000000-0000-0000-0000-000000000028','a0000000-0000-0000-0000-000000000028',150000,'BANK_TRANSFER','BNR-TXN-2025-0028-L','VERIFIED','50000000-0000-0000-0000-000000000001','2025-07-15 15:00:00','Verified.','2025-07-13 09:00:00'),
('b0000000-0000-0000-0000-000000000029','a0000000-0000-0000-0000-000000000029',250000,'BANK_TRANSFER','BNR-TXN-2025-0029-M','VERIFIED','50000000-0000-0000-0000-000000000001','2025-07-22 09:00:00','Confirmed.','2025-07-20 09:00:00'),
('b0000000-0000-0000-0000-000000000030','a0000000-0000-0000-0000-000000000030',250000,'BANK_TRANSFER','BNR-TXN-2025-0030-N','VERIFIED','50000000-0000-0000-0000-000000000001','2025-07-29 09:00:00','Payment verified.','2025-07-27 09:00:00'),
('b0000000-0000-0000-0000-000000000031','a0000000-0000-0000-0000-000000000031',150000,'MOBILE_MONEY','MTN-MOMO-2025-0031-O','VERIFIED','50000000-0000-0000-0000-000000000001','2025-08-03 09:00:00','Verified via MTN MoMo.','2025-08-01 09:00:00'),
('b0000000-0000-0000-0000-000000000032','a0000000-0000-0000-0000-000000000032',150000,'MOBILE_MONEY','AIRTEL-2025-0032-P','VERIFIED','50000000-0000-0000-0000-000000000001','2025-08-09 09:00:00','Confirmed via Airtel Money.','2025-08-07 09:00:00'),
('b0000000-0000-0000-0000-000000000033','a0000000-0000-0000-0000-000000000033',250000,'BANK_TRANSFER','BNR-TXN-2025-0033-Q','VERIFIED','50000000-0000-0000-0000-000000000001','2025-04-19 09:00:00','Payment confirmed.','2025-04-17 09:00:00'),
('b0000000-0000-0000-0000-000000000034','a0000000-0000-0000-0000-000000000034',250000,'BANK_TRANSFER','BNR-TXN-2025-0034-R','VERIFIED','50000000-0000-0000-0000-000000000001','2025-04-26 09:00:00','Bank transfer verified.','2025-04-24 09:00:00'),
('b0000000-0000-0000-0000-000000000035','a0000000-0000-0000-0000-000000000035',150000,'MOBILE_MONEY','MTN-MOMO-2025-0035-S','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-03 09:00:00','Confirmed.','2025-05-01 09:00:00'),
('b0000000-0000-0000-0000-000000000036','a0000000-0000-0000-0000-000000000036',150000,'MOBILE_MONEY','MTN-MOMO-2025-0036-T','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-09 09:00:00','Confirmed.','2025-05-07 09:00:00'),
('b0000000-0000-0000-0000-000000000037','a0000000-0000-0000-0000-000000000037',250000,'BANK_TRANSFER','BNR-TXN-2025-0037-U','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-21 09:00:00','Verified.','2025-05-19 09:00:00'),
('b0000000-0000-0000-0000-000000000038','a0000000-0000-0000-0000-000000000038',150000,'BANK_TRANSFER','BNR-TXN-2025-0038-V','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-26 09:00:00','Verified.','2025-05-24 09:00:00'),
('b0000000-0000-0000-0000-000000000039','a0000000-0000-0000-0000-000000000039',250000,'MOBILE_MONEY','MTN-MOMO-2025-0039-W','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-29 09:00:00','Confirmed.','2025-05-27 09:00:00'),
('b0000000-0000-0000-0000-000000000040','a0000000-0000-0000-0000-000000000040',250000,'BANK_TRANSFER','BNR-TXN-2025-0040-X','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-16 09:00:00','Confirmed.','2025-05-14 09:00:00'),
('b0000000-0000-0000-0000-000000000041','a0000000-0000-0000-0000-000000000041',250000,'BANK_TRANSFER','BNR-TXN-2025-0041-Y','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-19 09:00:00','Verified.','2025-05-17 09:00:00'),
('b0000000-0000-0000-0000-000000000042','a0000000-0000-0000-0000-000000000042', 50000,'MOBILE_MONEY','MTN-MOMO-2025-0042-Z','VERIFIED','50000000-0000-0000-0000-000000000001','2025-05-23 09:00:00','Confirmed.','2025-05-21 09:00:00'),
('b0000000-0000-0000-0000-000000000043','a0000000-0000-0000-0000-000000000043',250000,'BANK_TRANSFER','BNR-TXN-2024-0043','VERIFIED','50000000-0000-0000-0000-000000000001','2024-09-11 09:00:00','Confirmed.','2024-09-09 09:00:00'),
('b0000000-0000-0000-0000-000000000044','a0000000-0000-0000-0000-000000000044',250000,'BANK_TRANSFER','BNR-TXN-2024-0044','VERIFIED','50000000-0000-0000-0000-000000000001','2024-09-21 09:00:00','Confirmed.','2024-09-19 09:00:00'),
('b0000000-0000-0000-0000-000000000045','a0000000-0000-0000-0000-000000000045',250000,'BANK_TRANSFER','BNR-TXN-2023-0045','VERIFIED','50000000-0000-0000-0000-000000000001','2023-11-11 09:00:00','Confirmed.','2023-11-09 09:00:00'),
('b0000000-0000-0000-0000-000000000046','a0000000-0000-0000-0000-000000000046',250000,'BANK_TRANSFER','BNR-TXN-2024-0046','VERIFIED','50000000-0000-0000-0000-000000000001','2024-03-11 09:00:00','Confirmed.','2024-03-09 09:00:00'),
('b0000000-0000-0000-0000-000000000047','a0000000-0000-0000-0000-000000000047',150000,'MOBILE_MONEY','MTN-MOMO-2024-0047','VERIFIED','50000000-0000-0000-0000-000000000001','2024-04-11 09:00:00','Confirmed.','2024-04-09 09:00:00'),
('b0000000-0000-0000-0000-000000000048','a0000000-0000-0000-0000-000000000048',150000,'BANK_TRANSFER','BNR-TXN-2022-0048','VERIFIED','50000000-0000-0000-0000-000000000001','2022-07-21 09:00:00','Confirmed.','2022-07-19 09:00:00'),
('b0000000-0000-0000-0000-000000000049','a0000000-0000-0000-0000-000000000049',250000,'BANK_TRANSFER','BNR-TXN-2021-0049','VERIFIED','50000000-0000-0000-0000-000000000001','2021-03-16 09:00:00','Confirmed.','2021-03-14 09:00:00'),
('b0000000-0000-0000-0000-000000000050','a0000000-0000-0000-0000-000000000050',150000,'BANK_TRANSFER','BNR-TXN-2022-0050','VERIFIED','50000000-0000-0000-0000-000000000001','2022-09-16 09:00:00','Confirmed.','2022-09-14 09:00:00');

-- ============================================================
-- RECEIPTS (all verified payments)
-- ============================================================
INSERT INTO receipts (id, "paymentId", "receiptNumber", amount, "issuedAt", "pdfPath") VALUES
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000017','RCT-RERB-2025-0017',250000,'2025-05-05 11:30:00','/receipts/RCT-RERB-2025-0017.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000018','RCT-RERB-2025-0018',150000,'2025-05-12 10:30:00','/receipts/RCT-RERB-2025-0018.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000019','RCT-RERB-2025-0019', 50000,'2025-05-18 10:30:00','/receipts/RCT-RERB-2025-0019.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000020','RCT-RERB-2025-0020',250000,'2025-05-24 10:30:00','/receipts/RCT-RERB-2025-0020.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000021','RCT-RERB-2025-0021',150000,'2025-06-01 09:30:00','/receipts/RCT-RERB-2025-0021.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000022','RCT-RERB-2025-0022',250000,'2025-06-08 09:30:00','/receipts/RCT-RERB-2025-0022.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000033','RCT-RERB-2025-0033',250000,'2025-04-19 09:30:00','/receipts/RCT-RERB-2025-0033.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000034','RCT-RERB-2025-0034',250000,'2025-04-26 09:30:00','/receipts/RCT-RERB-2025-0034.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000045','RCT-RERB-2023-0045',250000,'2023-11-11 09:30:00','/receipts/RCT-RERB-2023-0045.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000048','RCT-RERB-2022-0048',150000,'2022-07-21 09:30:00','/receipts/RCT-RERB-2022-0048.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000049','RCT-RERB-2021-0049',250000,'2021-03-16 09:30:00','/receipts/RCT-RERB-2021-0049.pdf'),
(gen_random_uuid(),'b0000000-0000-0000-0000-000000000050','RCT-RERB-2022-0050',150000,'2022-09-16 09:30:00','/receipts/RCT-RERB-2022-0050.pdf');


-- ============================================================
-- REVIEW ASSIGNMENTS (apps 20-36 that are UNDER_REVIEW+)
-- ============================================================
INSERT INTO review_assignments (id, "applicationId", "reviewerId", "assignedById", "conflictDeclared", "isActive", "dueDate", "createdAt", "updatedAt") VALUES
-- App 20
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,true,'2025-06-14 00:00:00','2025-05-25 10:00:00','2025-05-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,true,'2025-06-14 00:00:00','2025-05-25 10:00:00','2025-05-25 10:00:00'),
-- App 21
(gen_random_uuid(),'90000000-0000-0000-0000-000000000021','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,true,'2025-06-20 00:00:00','2025-06-02 09:00:00','2025-06-02 09:00:00'),
-- App 22
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,true,'2025-06-28 00:00:00','2025-06-09 10:00:00','2025-06-09 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',false,true,'2025-06-28 00:00:00','2025-06-09 10:00:00','2025-06-09 10:00:00'),
-- App 23
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,true,'2025-07-03 00:00:00','2025-06-14 10:00:00','2025-06-14 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000023','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,true,'2025-07-03 00:00:00','2025-06-14 10:00:00','2025-06-14 10:00:00'),
-- App 24
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,true,'2025-07-10 00:00:00','2025-06-22 10:00:00','2025-06-22 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000024','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',false,true,'2025-07-10 00:00:00','2025-06-22 10:00:00','2025-06-22 10:00:00'),
-- App 25 (QUERY_RAISED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000025','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,true,'2025-07-18 00:00:00','2025-06-30 10:00:00','2025-06-30 10:00:00'),
-- App 26 (QUERY_RAISED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,true,'2025-07-24 00:00:00','2025-07-05 10:00:00','2025-07-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000026','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,true,'2025-07-24 00:00:00','2025-07-05 10:00:00','2025-07-05 10:00:00'),
-- App 27 (QUERY_RAISED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000027','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,true,'2025-07-28 00:00:00','2025-07-10 09:00:00','2025-07-10 09:00:00'),
-- App 28 (RESPONSE_RECEIVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000028','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',false,true,'2025-08-05 00:00:00','2025-07-16 09:00:00','2025-07-16 09:00:00'),
-- App 29 (RESPONSE_RECEIVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,true,'2025-08-12 00:00:00','2025-07-23 09:00:00','2025-07-23 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000029','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,true,'2025-08-12 00:00:00','2025-07-23 09:00:00','2025-07-23 09:00:00'),
-- Apps 30-32 (DECISION_PENDING)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,false,'2025-08-20 00:00:00','2025-07-30 10:00:00','2025-08-05 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,false,'2025-08-20 00:00:00','2025-07-30 10:00:00','2025-08-05 09:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',false,false,'2025-08-22 00:00:00','2025-08-04 09:00:00','2025-08-08 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,false,'2025-08-25 00:00:00','2025-08-10 09:00:00','2025-08-12 10:00:00'),
-- Apps 33-36 (APPROVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,false,'2025-05-20 00:00:00','2025-04-20 10:00:00','2025-08-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,false,'2025-05-20 00:00:00','2025-04-20 10:00:00','2025-08-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',false,false,'2025-05-28 00:00:00','2025-04-28 10:00:00','2025-08-28 15:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',false,false,'2025-05-28 00:00:00','2025-04-28 10:00:00','2025-08-28 15:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000035','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',false,false,'2025-06-01 00:00:00','2025-05-08 10:00:00','2025-09-05 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000036','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',false,false,'2025-06-08 00:00:00','2025-05-15 10:00:00','2025-09-12 11:00:00');

-- ============================================================
-- REVIEWS (completed for DECISION_PENDING and above)
-- ============================================================
INSERT INTO reviews (id, "applicationId", "reviewerId", comments, recommendation, conditions, "isComplete", "completedAt", "createdAt", "updatedAt") VALUES
-- App 30 reviews (complete)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','30000000-0000-0000-0000-000000000002',
 'Well-designed registry study following international EUROCAT standards. Data governance plan is robust. Sample size justification adequate. Consent process appropriate for this population. Minor suggestion: consider adding ICBDSR membership for data quality benchmarking.',
 'APPROVE',NULL,true,'2025-08-04 10:00:00','2025-07-30 10:00:00','2025-08-04 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000030','30000000-0000-0000-0000-000000000003',
 'Strong scientific rationale. Registry methodology sound. Ethics procedures well documented. Incidental genetic findings management plan is clear and follows best practice. Recommend approval.',
 'APPROVE',NULL,true,'2025-08-03 15:00:00','2025-07-30 10:00:00','2025-08-03 15:00:00'),
-- App 31 reviews (complete)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000031','30000000-0000-0000-0000-000000000004',
 'Important public health study addressing neglected snakebite burden. Retrospective component appropriately includes data waiver. Prospective consent procedures clearly described. Statistical approach suitable.',
 'APPROVE',NULL,true,'2025-08-07 14:00:00','2025-08-04 09:00:00','2025-08-07 14:00:00'),
-- App 32 reviews (complete)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000032','30000000-0000-0000-0000-000000000001',
 'Critical study for leprosy elimination goals. Community sensitization plan is comprehensive. Privacy protections for this stigmatized condition are well addressed. Recommend approval with a requirement for stigma-sensitive training for data collectors.',
 'APPROVE_WITH_CONDITIONS','Data collectors must complete stigma-sensitivity training certified by Rwanda Leprosy Control Program prior to field work.',true,'2025-08-11 10:00:00','2025-08-10 09:00:00','2025-08-11 10:00:00'),
-- App 33 reviews (complete - APPROVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','30000000-0000-0000-0000-000000000002',
 'Excellent AMR surveillance design. Laboratory methods are well described and follow WHO GLASS protocols. Consent procedures appropriate. Budget is reasonable. Highly recommend approval.',
 'APPROVE',NULL,true,'2025-05-12 10:00:00','2025-04-20 10:00:00','2025-05-12 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000033','30000000-0000-0000-0000-000000000003',
 'Sound surveillance methodology. Important contribution to national AMR action plan. Ethics procedures adequate. Approve.',
 'APPROVE',NULL,true,'2025-05-14 09:00:00','2025-04-20 10:00:00','2025-05-14 09:00:00'),
-- App 34 reviews (complete - APPROVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','30000000-0000-0000-0000-000000000001',
 'Innovative HIV prevention package for a key population. Peer-inclusive design is commendable. Confidentiality protections are strong. Stepped-wedge design minimizes exposure to control condition. Strongly recommend approval.',
 'APPROVE',NULL,true,'2025-05-22 14:00:00','2025-04-28 10:00:00','2025-05-22 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000034','30000000-0000-0000-0000-000000000004',
 'Well-justified study with key population. Non-judgmental consent process documented. PrEP safety monitoring adequate. Approve.',
 'APPROVE',NULL,true,'2025-05-24 10:00:00','2025-04-28 10:00:00','2025-05-24 10:00:00'),
-- App 37 reviews (complete - CONDITIONALLY_APPROVED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000037','30000000-0000-0000-0000-000000000002',
 'Important genomic study addressing under-representation of African women in cancer research. Scientific methodology is excellent. Main concern: genetic data governance plan is insufficient - specifically lacks provisions for controlling international data access and commercial use. Recommend conditional approval.',
 'APPROVE_WITH_CONDITIONS','Applicant must submit detailed genetic data governance plan specifying: (1) controlled access database procedures, (2) restrictions on commercial use without participant consent, (3) benefit-sharing provisions with Rwandan participants.',true,'2025-06-28 14:00:00','2025-06-01 10:00:00','2025-06-28 14:00:00'),
-- App 40 reviews (complete - REJECTED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000040','30000000-0000-0000-0000-000000000001',
 'Scientifically promising but ethically premature. The preclinical package is insufficient - only 6-month mouse data with no non-human primate studies. Risk of insertional mutagenesis not adequately addressed. No regulatory clearance from RURA for novel gene therapy. Cannot support approval at this stage.',
 'REJECT',NULL,true,'2025-06-18 14:00:00','2025-05-20 10:00:00','2025-06-18 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000040','30000000-0000-0000-0000-000000000003',
 'Agree with co-reviewer. Insufficient safety data for first-in-human gene therapy in this jurisdiction. Recommend the team complete required regulatory pathway first. Resubmission encouraged after addressing safety data gaps.',
 'REJECT',NULL,true,'2025-06-20 10:00:00','2025-05-20 10:00:00','2025-06-20 10:00:00'),
-- App 41 reviews (complete - REJECTED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000041','30000000-0000-0000-0000-000000000004',
 'Phase I first-in-human trial of a novel synthetic compound requires RURA IND equivalent approval before ethics review can proceed. The application lacks this regulatory clearance document. Additionally, the sponsor qualification documentation is incomplete. Recommend rejection pending regulatory pathway completion.',
 'REJECT',NULL,true,'2025-06-26 10:00:00','2025-05-25 10:00:00','2025-06-26 10:00:00'),
-- App 42 reviews (complete - REJECTED)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000042','30000000-0000-0000-0000-000000000002',
 'The exempt review category is inappropriate given the inclusion of minors (ages 15-17). Online click-through consent is insufficient for a study involving potentially sensitive HIV-related data collection in minors. Parental consent mechanism is absent. Reject as submitted; recommend resubmission as expedited review with proper consent procedures.',
 'REJECT',NULL,true,'2025-06-27 14:00:00','2025-06-01 10:00:00','2025-06-27 14:00:00'),
-- App 45 reviews (complete - APPROVED, now monitoring)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','30000000-0000-0000-0000-000000000001',
 'Exceptional longitudinal immunology study design. Annual re-consent procedures are exemplary and respectful of evolving assent capacity. Blood collection volumes are within safe pediatric limits. Strongly recommend approval.',
 'APPROVE',NULL,true,'2023-11-28 10:00:00','2023-11-01 10:00:00','2023-11-28 10:00:00'),
-- In-progress reviews for apps 20-24
(gen_random_uuid(),'90000000-0000-0000-0000-000000000020','30000000-0000-0000-0000-000000000001',
 'Initial review: Strong clinical rationale. Need to review power calculation for cerclage arm in detail.',
 NULL,NULL,false,NULL,'2025-05-25 10:00:00','2025-05-25 10:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000022','30000000-0000-0000-0000-000000000004',
 'Reviewing consent capacity assessment procedures. Study design looks sound.',
 NULL,NULL,false,NULL,'2025-06-09 10:00:00','2025-06-09 10:00:00');

-- ============================================================
-- QUERIES (apps 25-29)
-- ============================================================
INSERT INTO queries (id, "applicationId", "raisedById", question, "isResolved", "resolvedAt", "createdAt") VALUES
('f0000000-0000-0000-0000-000000000025','90000000-0000-0000-0000-000000000025','30000000-0000-0000-0000-000000000001',
 'The protocol specifies light microscopy as the reference standard but does not clarify whether the microscopists will be blinded to RDT results. Please confirm blinding procedures and describe the quality assurance processes for microscopy reading, including double-reading protocols and threshold for discordance resolution.',
 false,NULL,'2025-07-02 09:00:00'),
('f0000000-0000-0000-0000-000000000026','90000000-0000-0000-0000-000000000026','30000000-0000-0000-0000-000000000002',
 'The withdrawal procedures state participants can withdraw "at any follow-up point" but do not address the situation where a participant becomes too ill to make this decision. Please describe the procedures for proxy decision-making or advance directives for withdrawal in terminally ill participants who lose decision-making capacity during the study.',
 false,NULL,'2025-07-08 10:00:00'),
('f0000000-0000-0000-0000-000000000027','90000000-0000-0000-0000-000000000027','30000000-0000-0000-0000-000000000003',
 'The consent form states household representative consent covers all household members. For children aged 7-17 in enrolled households, please clarify how individual child assent will be obtained and how opt-out will be managed for children who do not wish to participate in the water quality surveys, even if the household head has consented.',
 false,NULL,'2025-07-12 10:00:00'),
-- App 28 (resolved)
('f0000000-0000-0000-0000-000000000028','90000000-0000-0000-0000-000000000028','30000000-0000-0000-0000-000000000004',
 'Section 4.2 states praziquantel will be dosed at 40mg/kg but the dosing table provided does not include a weight band for children weighing less than 10kg. Please provide the dosing guidance and safety data for children in this weight range, or clarify whether children under 10kg will be excluded from treatment.',
 true,'2025-07-28 10:00:00','2025-07-20 10:00:00'),
-- App 29 (resolved)
('f0000000-0000-0000-0000-000000000029','90000000-0000-0000-0000-000000000029','30000000-0000-0000-0000-000000000001',
 'The protocol proposes nicotine replacement therapy (NRT) starting in the second trimester. However, the safety data cited are primarily from studies in non-pregnant populations. Please provide a summary of available evidence on NRT safety in the first and second trimester and explain the rationale for including women at 14 weeks gestation.',
 true,'2025-08-05 10:00:00','2025-07-28 10:00:00');

-- ============================================================
-- QUERY RESPONSES (apps 28, 29)
-- ============================================================
INSERT INTO query_responses (id, "queryId", "responderId", response, "createdAt") VALUES
(gen_random_uuid(),'f0000000-0000-0000-0000-000000000028','20000000-0000-0000-0000-000000000003',
 'Thank you for this important question. We have reviewed the praziquantel dosing guidelines and have updated Section 4.2 as follows: Children weighing less than 10kg (typically under 2 years of age) will be excluded from the mass drug administration component due to insufficient safety data in this weight band. The protocol amendment reflects this exclusion criterion. We have also added a note that children in this weight category will be referred to the district hospital for individual clinical assessment and treatment as per national NTD guidelines. The revised protocol and dosing table are attached.',
 '2025-07-25 09:00:00'),
(gen_random_uuid(),'f0000000-0000-0000-0000-000000000029','20000000-0000-0000-0000-000000000004',
 'We appreciate the reviewer''s important question on NRT safety in pregnancy. We have conducted a systematic review of available evidence and provide the following summary: (1) The SNAP trial (Cooper et al., 2014, NEJM) demonstrated no significant increase in adverse neonatal outcomes with NRT patches starting at 12 weeks; (2) Current WHO guidelines conditionally recommend NRT in pregnancy when behavioural support has failed; (3) Our protocol has been updated to only enroll women from 14 weeks (second trimester) and to exclude women with placenta praevia or bleeding complications. A revised safety monitoring plan with monthly fetal wellbeing assessments has been added. We have also established a direct line with the DSMB for any safety signal review. Updated protocol version 3.0 is attached for review.',
 '2025-08-01 14:00:00');

-- ============================================================
-- DECISIONS (apps 33-50)
-- ============================================================
INSERT INTO decisions (id, "applicationId", type, conditions, rationale, "decidedById", "letterPath", "createdAt") VALUES
-- APPROVED
('d0000000-0000-0000-0000-000000000033','90000000-0000-0000-0000-000000000033','APPROVED',NULL,
 'The board unanimously approved this antimicrobial resistance surveillance study. The protocol demonstrates rigorous methodology aligned with WHO GLASS standards, appropriate consent procedures, and a well-justified budget. AMR surveillance is a priority for Rwanda''s national action plan.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app033.pdf','2025-08-20 14:00:00'),
('d0000000-0000-0000-0000-000000000034','90000000-0000-0000-0000-000000000034','APPROVED',NULL,
 'The board approved this HIV prevention study targeting female sex workers. The peer-inclusive design and robust confidentiality measures are commendable. The combination prevention package addresses an important gap in current HIV services.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app034.pdf','2025-08-28 15:00:00'),
('d0000000-0000-0000-0000-000000000035','90000000-0000-0000-0000-000000000035','APPROVED',NULL,
 'Approved. The immunization coverage survey follows established WHO sampling methodology. Minimal risk, important public health data for national immunization program planning.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app035.pdf','2025-09-05 10:00:00'),
('d0000000-0000-0000-0000-000000000036','90000000-0000-0000-0000-000000000036','APPROVED',NULL,
 'Approved. Implementation science study with strong theoretical framework. The RE-AIM evaluation approach is appropriate for this health systems intervention.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app036.pdf','2025-09-12 11:00:00'),
-- CONDITIONALLY_APPROVED
('d0000000-0000-0000-0000-000000000037','90000000-0000-0000-0000-000000000037','CONDITIONALLY_APPROVED',
 'Applicant must submit: (1) Genetic data governance plan specifying controlled access procedures and commercial use restrictions, (2) Benefit-sharing provision document, (3) Incidental genetic findings management protocol, all within 30 days of receiving this decision.',
 'The board found the scientific design to be excellent and the study to address an important gap in African cancer genomics. Conditional approval granted pending submission of required data governance documentation.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app037.pdf','2025-09-20 14:00:00'),
('d0000000-0000-0000-0000-000000000038','90000000-0000-0000-0000-000000000038','CONDITIONALLY_APPROVED',
 'Conditional on: (1) Establishment of a DSMB with terms of reference submitted to the board within 60 days, (2) Interim safety data review by DSMB at 3 months and report submitted to RERB, (3) Protocol amendment to include first trimester exclusion criteria.',
 'The study addresses an important gap in tobacco cessation for pregnant women. Conditional approval granted with enhanced safety monitoring requirements given the NRT intervention.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app038.pdf','2025-09-28 10:00:00'),
('d0000000-0000-0000-0000-000000000039','90000000-0000-0000-0000-000000000039','CONDITIONALLY_APPROVED',
 'Conditional on: (1) Written concurrence from Rwanda Ministry of Health, Division of Emergency Preparedness, (2) Updated community engagement plan reviewed by affected district councils.',
 'Emergency response research approved conditionally given public health urgency. Modified consent procedures accepted within established ethical framework.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app039.pdf','2025-10-05 14:00:00'),
-- REJECTED
('d0000000-0000-0000-0000-000000000040','90000000-0000-0000-0000-000000000040','REJECTED',NULL,
 'The application is rejected on the following grounds: (1) Insufficient pre-clinical safety data - only 6-month murine data without non-human primate toxicology studies; (2) Absence of IND equivalent regulatory clearance from Rwanda Utilities Regulatory Authority (RURA); (3) Inadequate long-term genotoxicity risk assessment. The board encourages resubmission after completing required regulatory and pre-clinical steps.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app040.pdf','2025-08-15 10:00:00'),
('d0000000-0000-0000-0000-000000000041','90000000-0000-0000-0000-000000000041','REJECTED',NULL,
 'Rejected pending regulatory clearance. First-in-human trials require prior authorization from RURA per the Rwanda Medicines and Medical Devices Authority Act 2019. The application must include the regulatory clearance certificate before ethics review can proceed.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app041.pdf','2025-08-22 10:00:00'),
('d0000000-0000-0000-0000-000000000042','90000000-0000-0000-0000-000000000042','REJECTED',NULL,
 'Rejected. The EXEMPT review category is inappropriate for studies involving minors. Online click-through consent is insufficient for sensitive HIV-related research in adolescents aged 15-17. The applicant should resubmit as EXPEDITED review with robust parental/guardian consent procedures and age-appropriate assent processes.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app042.pdf','2025-08-28 10:00:00'),
-- APPROVED (amendment_pending and monitoring_active)
('d0000000-0000-0000-0000-000000000043','90000000-0000-0000-0000-000000000043','APPROVED',NULL,
 'Approved. Well-designed longitudinal cohort with appropriate follow-up schedule. Safety monitoring plan is adequate.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app043.pdf','2024-11-01 14:00:00'),
('d0000000-0000-0000-0000-000000000044','90000000-0000-0000-0000-000000000044','APPROVED',NULL,
 'Approved. Geriatric research with appropriately rigorous consent capacity assessment procedures.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app044.pdf','2024-12-01 14:00:00'),
('d0000000-0000-0000-0000-000000000045','90000000-0000-0000-0000-000000000045','APPROVED',NULL,
 'Approved. Exemplary longitudinal immunology study with best-in-class pediatric assent procedures. Annual re-consent framework is strongly commended.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app045.pdf','2024-01-15 14:00:00'),
('d0000000-0000-0000-0000-000000000046','90000000-0000-0000-0000-000000000046','APPROVED',NULL,
 'Approved. HIV self-testing distribution program with adequate linkage to care provisions. Community-based design is appropriate.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app046.pdf','2024-06-05 14:00:00'),
('d0000000-0000-0000-0000-000000000047','90000000-0000-0000-0000-000000000047','APPROVED',NULL,
 'Approved. RCT of nutritional supplementation with quarterly safety monitoring. Hemoglobin monitoring plan is adequate.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app047.pdf','2024-07-05 14:00:00'),
('d0000000-0000-0000-0000-000000000048','90000000-0000-0000-0000-000000000048','APPROVED',NULL,
 'Approved. Test-negative case-control design is appropriate for vaccine effectiveness estimation. Minimal risk study.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app048.pdf','2022-09-01 14:00:00'),
('d0000000-0000-0000-0000-000000000049','90000000-0000-0000-0000-000000000049','APPROVED',NULL,
 'Approved. Cluster-randomized trial with appropriate entomological and epidemiological endpoints.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app049.pdf','2021-06-01 14:00:00'),
('d0000000-0000-0000-0000-000000000050','90000000-0000-0000-0000-000000000050','APPROVED',NULL,
 'Approved. Stepped-wedge QI study with strong health systems rationale.',
 '60000000-0000-0000-0000-000000000001','/letters/decision_app050.pdf','2022-11-01 14:00:00');

-- ============================================================
-- CERTIFICATES (approved apps: 33-39, 43-50 — not rejected 40-42)
-- ============================================================
INSERT INTO certificates (id, "applicationId", "decisionId", "certificateNumber", "verificationToken", "pdfPath", "issuedAt", "expiresAt") VALUES
('e0000000-0000-0000-0000-000000000033','90000000-0000-0000-0000-000000000033','d0000000-0000-0000-0000-000000000033','RERB-CERT-2025-0033','tok-33-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6','/certs/RERB-CERT-2025-0033.pdf','2025-08-20 14:30:00','2027-08-20 14:30:00'),
('e0000000-0000-0000-0000-000000000034','90000000-0000-0000-0000-000000000034','d0000000-0000-0000-0000-000000000034','RERB-CERT-2025-0034','tok-34-b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7','/certs/RERB-CERT-2025-0034.pdf','2025-08-28 15:30:00','2027-08-28 15:30:00'),
('e0000000-0000-0000-0000-000000000035','90000000-0000-0000-0000-000000000035','d0000000-0000-0000-0000-000000000035','RERB-CERT-2025-0035','tok-35-c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8','/certs/RERB-CERT-2025-0035.pdf','2025-09-05 10:30:00','2026-09-05 10:30:00'),
('e0000000-0000-0000-0000-000000000036','90000000-0000-0000-0000-000000000036','d0000000-0000-0000-0000-000000000036','RERB-CERT-2025-0036','tok-36-d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9','/certs/RERB-CERT-2025-0036.pdf','2025-09-12 11:30:00','2027-03-12 11:30:00'),
('e0000000-0000-0000-0000-000000000037','90000000-0000-0000-0000-000000000037','d0000000-0000-0000-0000-000000000037','RERB-CERT-2025-0037','tok-37-e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0','/certs/RERB-CERT-2025-0037.pdf','2025-10-20 10:30:00','2028-10-20 10:30:00'),
('e0000000-0000-0000-0000-000000000038','90000000-0000-0000-0000-000000000038','d0000000-0000-0000-0000-000000000038','RERB-CERT-2025-0038','tok-38-f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1','/certs/RERB-CERT-2025-0038.pdf','2025-10-28 10:30:00','2027-04-28 10:30:00'),
('e0000000-0000-0000-0000-000000000039','90000000-0000-0000-0000-000000000039','d0000000-0000-0000-0000-000000000039','RERB-CERT-2025-0039','tok-39-g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2','/certs/RERB-CERT-2025-0039.pdf','2025-11-05 10:30:00','2026-11-05 10:30:00'),
('e0000000-0000-0000-0000-000000000043','90000000-0000-0000-0000-000000000043','d0000000-0000-0000-0000-000000000043','RERB-CERT-2024-0043','tok-43-h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3','/certs/RERB-CERT-2024-0043.pdf','2024-11-01 14:30:00','2027-11-01 14:30:00'),
('e0000000-0000-0000-0000-000000000044','90000000-0000-0000-0000-000000000044','d0000000-0000-0000-0000-000000000044','RERB-CERT-2024-0044','tok-44-i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4','/certs/RERB-CERT-2024-0044.pdf','2024-12-01 14:30:00','2026-12-01 14:30:00'),
('e0000000-0000-0000-0000-000000000045','90000000-0000-0000-0000-000000000045','d0000000-0000-0000-0000-000000000045','RERB-CERT-2024-0045','tok-45-j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5','/certs/RERB-CERT-2024-0045.pdf','2024-01-15 14:30:00','2028-01-15 14:30:00'),
('e0000000-0000-0000-0000-000000000046','90000000-0000-0000-0000-000000000046','d0000000-0000-0000-0000-000000000046','RERB-CERT-2024-0046','tok-46-k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6','/certs/RERB-CERT-2024-0046.pdf','2024-06-05 14:30:00','2026-06-05 14:30:00'),
('e0000000-0000-0000-0000-000000000047','90000000-0000-0000-0000-000000000047','d0000000-0000-0000-0000-000000000047','RERB-CERT-2024-0047','tok-47-l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7','/certs/RERB-CERT-2024-0047.pdf','2024-07-05 14:30:00','2026-01-05 14:30:00'),
('e0000000-0000-0000-0000-000000000048','90000000-0000-0000-0000-000000000048','d0000000-0000-0000-0000-000000000048','RERB-CERT-2022-0048','tok-48-m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8','/certs/RERB-CERT-2022-0048.pdf','2022-09-01 14:30:00','2024-09-01 14:30:00'),
('e0000000-0000-0000-0000-000000000049','90000000-0000-0000-0000-000000000049','d0000000-0000-0000-0000-000000000049','RERB-CERT-2021-0049','tok-49-n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9','/certs/RERB-CERT-2021-0049.pdf','2021-06-01 14:30:00','2024-06-01 14:30:00'),
('e0000000-0000-0000-0000-000000000050','90000000-0000-0000-0000-000000000050','d0000000-0000-0000-0000-000000000050','RERB-CERT-2022-0050','tok-50-o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0','/certs/RERB-CERT-2022-0050.pdf','2022-11-01 14:30:00','2024-05-01 14:30:00');

-- ============================================================
-- AMENDMENTS (apps 43-47)
-- ============================================================
INSERT INTO amendments (id, "applicationId", title, description, reason, status, "submittedAt", "createdAt", "updatedAt") VALUES
-- App 43 (AMENDMENT_PENDING - submitted amendment)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000043',
 'Amendment 1: Addition of Biomarker Sub-Study',
 'We propose to add a biomarker sub-study to the existing cohort involving collection of 10ml additional blood at each 6-monthly visit for inflammatory biomarker analysis (IL-6, TNF-alpha, D-dimer, BNP, and NT-proBNP). An additional sub-group of 80 participants will undergo bronchoscopy for airway inflammation assessment.',
 'Emerging evidence suggests systemic inflammation and cardiac biomarkers may be important prognostic markers for long-COVID pulmonary outcomes. Adding these measures will significantly enhance the scientific value of the study.',
 'SUBMITTED','2025-10-15 14:00:00','2025-10-10 09:00:00','2025-10-15 14:00:00'),
-- App 44 (AMENDMENT_PENDING - submitted amendment)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000044',
 'Amendment 1: Addition of Cognitive Assessment and Sample Size Increase',
 'We propose to: (1) Add Montreal Cognitive Assessment (MoCA) to all participant assessments, (2) Add Alzheimer Disease Assessment Scale-Cognitive Subscale (ADAS-Cog) for participants with MMSE < 24, (3) Increase sample size from 500 to 650 to account for 15% loss-to-follow-up in the nested cohort component.',
 'Cognitive impairment is a significant but underassessed NCD burden in the elderly. Adding validated cognitive tools will allow a more complete picture of NCD burden in this population.',
 'SUBMITTED','2025-10-22 10:00:00','2025-10-15 09:00:00','2025-10-22 10:00:00'),
-- App 45 (MONITORING_ACTIVE - approved amendment)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045',
 'Amendment 1: Addition of Whole Blood Transcriptomics Sub-Study',
 'Amendment to add whole blood RNA extraction at year 2 and year 4 visits for transcriptomic analysis of immune gene expression signatures associated with protective immunity.',
 'Transcriptomic data will complement existing antibody and cellular assay data to provide mechanistic insights into malaria immunity development.',
 'APPROVED','2025-02-01 10:00:00','2025-01-20 09:00:00','2025-03-01 14:00:00'),
-- App 46 (MONITORING_ACTIVE - approved amendment)
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046',
 'Amendment 1: Addition of Partner Testing Component',
 'Amendment to add an optional HIV partner testing module for reactive testers who consent. Partners will be offered home-based testing by trained peer navigators.',
 'Index testing has shown high yield in similar programs. Partner testing will enhance program impact and is specifically requested by community advisory board.',
 'APPROVED','2025-03-15 10:00:00','2025-03-01 09:00:00','2025-04-01 14:00:00');

-- ============================================================
-- PROGRESS REPORTS (monitoring active apps 45-47)
-- ============================================================
INSERT INTO progress_reports (id, "applicationId", "reportPeriod", summary, "participantsEnrolled", findings, status, "submittedAt", "createdAt", "updatedAt") VALUES
-- App 45 progress reports
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045','Year 1 (Jan 2024 - Dec 2024)',
 'Year 1 of the longitudinal malaria immunity cohort study has been completed successfully. All 600 enrolled children completed baseline assessments. Annual blood sampling achieved 94% completion rate. No serious adverse events related to study procedures. Three children withdrew (2 moved out of study area, 1 parental request). Malaria incidence in Year 1 was 1.8 episodes per child-year.',
 597,
 'Baseline antibody profiles established for all enrolled children. High seroprevalence to Plasmodium falciparum antigens MSP-1 (78%) and AMA-1 (65%) at baseline. Age-stratified analysis shows increasing antibody titers with age as expected. Cellular immunity data from ELISpot assays pending batch analysis.',
 'APPROVED','2025-01-10 10:00:00','2025-01-05 09:00:00','2025-02-01 10:00:00'),
-- App 46 progress reports
(gen_random_uuid(),'90000000-0000-0000-0000-000000000046','6-Month Report (Jun 2024 - Nov 2024)',
 'HIV self-testing distribution reached 1,847 individuals in the first 6 months, exceeding the 6-month target of 1,200. Kit redemption rate was 87% at community distribution points, 92% at pharmacies, and 74% at workplaces. Of 1,607 individuals who completed testing, 48 (3.0%) were reactive. Linkage coordinator contacted all reactive testers; 41 (85%) linked to HIV care within 30 days.',
 1847,
 'HIV testing coverage increased significantly in target communities (baseline 58%, 6-month 74%). Reactive rate of 3.0% is consistent with national HIV prevalence estimates for Kigali. Linkage to care rate of 85% exceeds the UNAIDS target. Self-report of testing status shows high concordance with kit distribution data.',
 'APPROVED','2024-12-01 10:00:00','2024-11-25 09:00:00','2025-01-05 10:00:00'),
-- App 47 progress reports
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047','Q1 Safety Report (Jul 2024 - Sep 2024)',
 'First quarterly safety report for the IFA supplementation trial. 360 participants enrolled across 8 health centers, meeting enrollment target. Randomization balance achieved (181 standard vs 179 enhanced arm). No serious adverse events. Two participants experienced mild gastrointestinal side effects from enhanced IFA (nausea grade 1) resolving spontaneously within 2 weeks.',
 360,
 'Mean baseline hemoglobin 8.4 g/dL (SD 0.8). Distribution between arms: standard 8.3 g/dL vs enhanced 8.5 g/dL (p=0.31, well balanced). Compliance with supplementation assessed at 4 weeks: 89% in standard arm, 92% in enhanced arm. First interim hemoglobin check at 16 weeks shows trend toward improvement in both arms.',
 'APPROVED','2024-10-01 10:00:00','2024-09-25 09:00:00','2024-10-15 10:00:00');

-- ============================================================
-- ADVERSE EVENTS (app 47 - one moderate AE)
-- ============================================================
INSERT INTO adverse_events (id, "applicationId", "eventDate", description, severity, "affectedParticipants", "actionTaken", status, "submittedAt", "createdAt", "updatedAt") VALUES
(gen_random_uuid(),'90000000-0000-0000-0000-000000000047',
 '2024-09-15',
 'Two participants in the enhanced IFA arm (participant IDs masked per protocol) developed grade 1 nausea within 72 hours of commencing enhanced iron-folic acid plus vitamin C supplementation. No vomiting, no systemic symptoms, no impact on fetal wellbeing assessed at emergency visit. Both participants continued supplementation after temporary dose reduction.',
 'MILD',2,
 'Participants reviewed by study clinician at health center within 24 hours of report. Dose temporarily reduced for 5 days then resumed at full dose. Both participants tolerating supplement well at 4-week follow-up. No protocol modification required. DSMB notified per protocol.',
 'APPROVED','2024-09-20 09:00:00','2024-09-18 10:00:00','2024-10-05 14:00:00');

-- ============================================================
-- PROTOCOL DEVIATIONS (app 45 - minor deviation)
-- ============================================================
INSERT INTO protocol_deviations (id, "applicationId", "deviationDate", description, impact, "correctiveAction", status, "submittedAt", "createdAt", "updatedAt") VALUES
(gen_random_uuid(),'90000000-0000-0000-0000-000000000045',
 '2024-06-10',
 'Protocol specifies blood samples should be processed within 4 hours of collection. At Kayonza site, three samples from the June 2024 annual visit were processed at 5.5 hours due to centrifuge malfunction. The samples were labeled and stored appropriately but processing delay may affect cellular assay results.',
 'Potential minor impact on lymphocyte viability for ELISpot assays from three samples. Antibody ELISA results from these samples are not expected to be affected. Samples flagged in laboratory database.',
 'Centrifuge maintenance contract established with certified technician for quarterly servicing. Backup portable centrifuge procured for all field sites. Affected samples will be retested where feasible; if results are outliers they will be excluded from cellular assay analysis per pre-specified protocol.',
 'APPROVED','2024-06-20 09:00:00','2024-06-15 10:00:00','2024-07-10 14:00:00');

-- ============================================================
-- CLOSURE REPORTS (apps 48-50)
-- ============================================================
INSERT INTO closure_reports (id, "applicationId", "closureDate", description, "totalEnrolled", findings, status, "submittedAt", "createdAt", "updatedAt") VALUES
(gen_random_uuid(),'90000000-0000-0000-0000-000000000048',
 '2024-08-31',
 'The rotavirus vaccine effectiveness study was completed on schedule. All study activities have been completed including final data collection, database lock, statistical analysis, and manuscript submission. The study was conducted according to the approved protocol with one minor amendment (addition of stool samples for rotavirus genotyping). All participant data has been securely archived per RERB requirements.',
 800,
 'Final vaccine effectiveness estimate: 72% (95% CI: 58-82%) against severe rotavirus gastroenteritis requiring hospitalization. Effectiveness was consistent across age groups and vaccine types (Rotarix: 74%, RotaTeq: 69%). Results support continued inclusion of rotavirus vaccine in Rwanda national immunization schedule. Manuscript submitted to Vaccine journal.',
 'APPROVED','2024-09-01 10:00:00','2024-08-28 09:00:00','2024-09-20 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000049',
 '2024-05-31',
 'The community-based malaria vector control trial was completed after 36 months of follow-up. The trial was extended by 3 months due to COVID-19 disruption of field activities. All 2,400 enrolled households completed the study period. Final entomological surveys, parasite rate surveys, and qualitative exit interviews have been completed. Data analysis finalized and results published.',
 2400,
 'Universal LLIN coverage achieved a 50% reduction in malaria parasite prevalence (18.4% to 9.2%) compared to 28% reduction in the standard distribution arm (17.9% to 12.9%). Results published in Lancet Global Health (Nakamura et al., 2024). Study data contributed to Rwanda National Malaria Control Program policy update.',
 'APPROVED','2024-06-01 09:00:00','2024-05-28 09:00:00','2024-07-01 14:00:00'),
(gen_random_uuid(),'90000000-0000-0000-0000-000000000050',
 '2024-04-30',
 'The ANC quality improvement study has been completed. The stepped-wedge implementation was completed across all 15 health facilities on schedule. All data collection, follow-up assessments, and staff interviews have been completed. Final analysis complete and findings presented to Rwanda Ministry of Health.',
 1800,
 'ANC guideline compliance improved significantly from 42% at baseline to 78% at endline across all participating health centers. Significant improvements seen in: blood pressure measurement (68% to 95%), urine dipstick (45% to 88%), and fetal position documentation (52% to 91%). Findings integrated into national 2025 ANC quality improvement guidelines by Rwanda Ministry of Health.',
 'APPROVED','2024-05-01 10:00:00','2024-04-28 09:00:00','2024-06-01 14:00:00');

-- ============================================================
-- NOTIFICATIONS (sample for key users)
-- ============================================================
INSERT INTO notifications (id, "userId", type, title, message, "isRead", metadata, "createdAt") VALUES
-- Applicant notifications
(gen_random_uuid(),'20000000-0000-0000-0000-000000000001','APPLICATION_SUBMITTED','Application Submitted Successfully','Your application RERB-2025-0006 has been successfully submitted for ethics review.',true,'{"applicationId": "90000000-0000-0000-0000-000000000006"}'::jsonb,'2025-02-10 14:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000001','PAYMENT_PENDING','Payment Required - RERB-2025-0016','Your application RERB-2025-0016 has passed initial screening. Please proceed with payment of RWF 250,000 to advance your application.',false,'{"applicationId": "90000000-0000-0000-0000-000000000016", "amount": 250000}'::jsonb,'2025-04-22 09:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000001','DECISION_ISSUED','Ethics Approval Granted - RERB-2025-0036','Congratulations! Your application RERB-2025-0036 has been approved by the ethics board. Your certificate of approval is ready for download.',true,'{"applicationId": "90000000-0000-0000-0000-000000000036", "certificateId": "e0000000-0000-0000-0000-000000000036"}'::jsonb,'2025-09-12 11:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000002','APPLICATION_SUBMITTED','Application Submitted - RERB-2025-0007','Your application has been received and is under review.',true,'{"applicationId": "90000000-0000-0000-0000-000000000007"}'::jsonb,'2025-02-18 11:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000002','PAYMENT_VERIFIED','Payment Verified - RERB-2025-0017','Your payment of RWF 250,000 for application RERB-2025-0017 has been verified. Your application will now proceed to the review stage.',true,'{"applicationId": "90000000-0000-0000-0000-000000000017", "amount": 250000}'::jsonb,'2025-05-05 11:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000005','DECISION_ISSUED','Application Rejected - RERB-2025-0040','Your application RERB-2025-0040 has not been approved at this time. Please review the board decision letter for detailed feedback and guidance on resubmission.',false,'{"applicationId": "90000000-0000-0000-0000-000000000040"}'::jsonb,'2025-08-15 10:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000003','QUERY_RAISED','Reviewer Query - RERB-2025-0028','A reviewer has raised a query on your application RERB-2025-0028 regarding praziquantel dosing for children under 10kg. Please log in to respond.',true,'{"applicationId": "90000000-0000-0000-0000-000000000028", "queryId": "f0000000-0000-0000-0000-000000000028"}'::jsonb,'2025-07-20 10:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000003','APPLICATION_SUBMITTED','Response Submitted','Your response to the reviewer query on RERB-2025-0028 has been submitted successfully.',true,'{"applicationId": "90000000-0000-0000-0000-000000000028"}'::jsonb,'2025-07-25 14:01:00'),
-- Reviewer notifications
(gen_random_uuid(),'30000000-0000-0000-0000-000000000001','REVIEWER_ASSIGNED','New Application Assigned for Review','Application RERB-2025-0020 has been assigned to you for ethics review. The review is due by 14 June 2025.',false,'{"applicationId": "90000000-0000-0000-0000-000000000020"}'::jsonb,'2025-05-25 10:01:00'),
(gen_random_uuid(),'30000000-0000-0000-0000-000000000002','REVIEWER_ASSIGNED','New Application Assigned for Review','Application RERB-2025-0033 has been assigned to you for ethics review.',true,'{"applicationId": "90000000-0000-0000-0000-000000000033"}'::jsonb,'2025-04-20 10:01:00'),
(gen_random_uuid(),'30000000-0000-0000-0000-000000000004','QUERY_RESPONSE','Response Received - RERB-2025-0028','The applicant has responded to your query on application RERB-2025-0028. Please review the response and complete your assessment.',false,'{"applicationId": "90000000-0000-0000-0000-000000000028", "queryId": "f0000000-0000-0000-0000-000000000028"}'::jsonb,'2025-07-25 14:02:00'),
-- Finance officer notifications
(gen_random_uuid(),'50000000-0000-0000-0000-000000000001','PAYMENT_PENDING','New Payment to Verify','A payment has been submitted for application RERB-2025-0017. Please verify the bank transfer reference BNR-TXN-2025-0017-A.',true,'{"applicationId": "90000000-0000-0000-0000-000000000017", "paymentId": "b0000000-0000-0000-0000-000000000017"}'::jsonb,'2025-05-03 10:01:00'),
-- Admin notifications
(gen_random_uuid(),'40000000-0000-0000-0000-000000000001','GENERAL','New Application Received','Application RERB-2025-0024 has been submitted and requires screening.',true,'{"applicationId": "90000000-0000-0000-0000-000000000024"}'::jsonb,'2025-06-18 16:01:00'),
(gen_random_uuid(),'40000000-0000-0000-0000-000000000001','MONITORING_REMINDER','Progress Report Due - RERB-2025-0045','Annual progress report for application RERB-2025-0045 (Malaria Immunity Cohort) is due within 30 days.',false,'{"applicationId": "90000000-0000-0000-0000-000000000045"}'::jsonb,'2025-12-15 08:00:00'),
-- Monitoring reminders for monitoring-active studies
(gen_random_uuid(),'20000000-0000-0000-0000-000000000010','MONITORING_REMINDER','Annual Progress Report Due','Your approved study RERB-2025-0045 requires a progress report submission within 30 days.',false,'{"applicationId": "90000000-0000-0000-0000-000000000045"}'::jsonb,'2025-12-15 08:01:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000001','CERTIFICATE_AVAILABLE','Ethics Certificate Available','Your ethics certificate for RERB-2025-0036 is available for download from your dashboard.',true,'{"applicationId": "90000000-0000-0000-0000-000000000036", "certificateId": "e0000000-0000-0000-0000-000000000036"}'::jsonb,'2025-09-12 11:02:00'),
(gen_random_uuid(),'20000000-0000-0000-0000-000000000008','CERTIFICATE_AVAILABLE','Ethics Certificate Available','Your certificate for RERB-2025-0043 is available.',true,'{"applicationId": "90000000-0000-0000-0000-000000000043", "certificateId": "e0000000-0000-0000-0000-000000000043"}'::jsonb,'2024-11-01 14:31:00');

COMMIT;
