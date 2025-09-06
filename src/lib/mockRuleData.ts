import { RuleData } from './types';

const templateNames = [
  'ANOC',
  'EOC'
];

const chapterNames = {
  'ANOC': ['ANOC Cover Page'],
  'EOC': ['Chapter 1', 'Chapter 4', 'Chapter 5']
};

const sectionNames = {
  'ANOC Cover Page': ['Cover Page'],
  'Chapter 1': ['Section 1'],
  'Chapter 4': ['Section 1'],
  'Chapter 5': ['Section 2', 'Section 3', 'Section 4']
};

const subsectionNames = {
  'Cover Page': [''],
  'Section 1': ['1.1', 'Section 1.2', 'Section 1.3'],
  'Section 2': ['Section 2.1'],
  'Section 3': ['Section 3.1'],
  'Section 4': ['Section 4.1']
};

const serviceGroups = [
  'Medical Services',
  'Pharmacy Services',
  'Behavioral Health',
  'Emergency Services',
  'Preventive Care',
  'Specialty Services'
];

const sampleRules = [
  'All employees must complete safety training within 30 days of employment',
  'Equipment inspections must be conducted weekly by certified personnel',
  'Documentation must be submitted within 48 hours of completion',
  'Emergency protocols must be followed without exception',
  'Quality checks are required before product release',
  'Compliance audits shall be conducted quarterly',
  'Training records must be maintained for minimum 5 years',
  'Incident reports must be filed within 24 hours',
  'Access controls must be reviewed monthly',
  'Data backup procedures must be executed daily'
];

const sampleEnglishText = [
  'This requirement ensures compliance with industry standards and regulatory guidelines.',
  'The procedure involves multiple steps: Initial assessment, Documentation review, Final approval.',
  'Special attention must be paid to critical safety measures during this process.',
  'Note: Exceptions require management approval and proper documentation.',
  'Regular monitoring ensures continuous compliance with established protocols.'
];

const sampleSpanishText = [
  'Este requisito garantiza el cumplimiento de los estándares de la industria y las pautas regulatorias.',
  'El procedimiento involucra múltiples pasos: Evaluación inicial, Revisión de documentación, Aprobación final.',
  'Se debe prestar especial atención a las medidas de seguridad críticas durante este proceso.',
  'Nota: Las excepciones requieren aprobación de la gerencia y documentación adecuada.',
  'El monitoreo regular garantiza el cumplimiento continuo de los protocolos establecidos.'
];

const benefitTypes = [
  'Medical',
  'Pharmacy',
  'Dental',
  'Vision',
  'Mental Health',
  'Wellness'
];

const businessAreas = [
  'Clinical',
  'Operational',
  'Administrative',
  'Financial',
  'Regulatory',
  'Quality'
];

const subBusinessAreas = [
  'Primary Care',
  'Specialty Care',
  'Emergency Services',
  'Preventive Care',
  'Customer Service',
  'Claims Processing',
  'Provider Network',
  'Utilization Management',
  'Compliance',
  'Risk Management'
];

const sampleDescriptions = [
  'Outlines coverage requirements and member responsibilities for medical services',
  'Defines eligibility criteria and enrollment procedures for health plan benefits',
  'Specifies copayment and coinsurance amounts for various healthcare services',
  'Describes prior authorization requirements for specialty medications',
  'Details network provider access and referral procedures',
  'Explains appeal and grievance processes for benefit determinations',
  'Covers emergency and urgent care access guidelines',
  'Outlines preventive care services and wellness program benefits'
];

const statusOptions = ['Draft', 'Review', 'Approved', 'Published', 'Archived'];

function getRandomDate(daysAgo: number): string {
  const date = new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

export function generateMockRuleData(): Promise<RuleData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rules: RuleData[] = [];
      
      // Generate data matching the new column structure
      const dataStructure = [
        { template: 'ANOC', chapter: 'ANOC Cover Page', section: 'Cover Page', subsection: '' },
        { template: 'ANOC', chapter: 'ANOC Cover Page', section: 'Cover Page', subsection: '' },
        { template: 'EOC', chapter: 'Chapter 1', section: 'Section 1', subsection: 'Section 1.2' },
        { template: 'EOC', chapter: 'Chapter 1', section: 'Section 1', subsection: '1.1' },
        { template: 'EOC', chapter: 'Chapter 4', section: 'Section 1', subsection: 'Section 1.3' },
        { template: 'EOC', chapter: 'Chapter 5', section: 'Section 4', subsection: 'Section 4.1' },
        { template: 'EOC', chapter: 'Chapter 4', section: 'Section 1', subsection: 'Section 1.2' },
        { template: 'EOC', chapter: 'Chapter 5', section: 'Section 3', subsection: 'Section 3.1' },
        { template: 'EOC', chapter: 'Chapter 5', section: 'Section 2', subsection: 'Section 2.1' },
        { template: 'EOC', chapter: 'Chapter 4', section: 'Section 1', subsection: 'Section 1.1' }
      ];
      
      dataStructure.forEach((item, i) => {
        rules.push({
          id: `rule-${i + 1}`,
          ruleId: `R${String(i + 1).padStart(4, '0')}`,
          effectiveDate: '01/01/2025',
          version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
          benefitType: benefitTypes[Math.floor(Math.random() * benefitTypes.length)],
          businessArea: businessAreas[Math.floor(Math.random() * businessAreas.length)],
          subBusinessArea: subBusinessAreas[Math.floor(Math.random() * subBusinessAreas.length)],
          description: sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)],
          templateName: item.template,
          serviceId: `SRV${String(i + 1).padStart(3, '0')}`,
          cmsRegulated: Math.random() > 0.6,
          chapterName: item.chapter,
          sectionName: item.section,
          subsectionName: item.subsection,
          serviceGroup: serviceGroups[Math.floor(Math.random() * serviceGroups.length)],
          sourceMapping: `MAP${String(i + 1).padStart(3, '0')}`,
          tiers: `Tier ${Math.floor(Math.random() * 3) + 1}`,
          key: `KEY${String(i + 1).padStart(3, '0')}`,
          rule: sampleRules[Math.floor(Math.random() * sampleRules.length)],
          isTabular: Math.random() > 0.7,
          english: sampleEnglishText[Math.floor(Math.random() * sampleEnglishText.length)],
          englishStatus: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          spanish: sampleSpanishText[Math.floor(Math.random() * sampleSpanishText.length)],
          spanishStatus: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          published: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
      
      // Add additional random entries
      for (let i = 10; i < 25; i++) {
        const template = templateNames[Math.floor(Math.random() * templateNames.length)];
        const chapters = chapterNames[template];
        const chapter = chapters[Math.floor(Math.random() * chapters.length)];
        const sections = sectionNames[chapter];
        const section = sections[Math.floor(Math.random() * sections.length)];
        const subsections = subsectionNames[section];
        const subsection = subsections[Math.floor(Math.random() * subsections.length)];
        
        rules.push({
          id: `rule-${i + 1}`,
          ruleId: `R${String(i + 1).padStart(4, '0')}`,
          effectiveDate: '01/01/2025',
          version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
          benefitType: benefitTypes[Math.floor(Math.random() * benefitTypes.length)],
          businessArea: businessAreas[Math.floor(Math.random() * businessAreas.length)],
          subBusinessArea: subBusinessAreas[Math.floor(Math.random() * subBusinessAreas.length)],
          description: sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)],
          templateName: template,
          serviceId: `SRV${String(i + 1).padStart(3, '0')}`,
          cmsRegulated: Math.random() > 0.6,
          chapterName: chapter,
          sectionName: section,
          subsectionName: subsection,
          serviceGroup: serviceGroups[Math.floor(Math.random() * serviceGroups.length)],
          sourceMapping: `MAP${String(i + 1).padStart(3, '0')}`,
          tiers: `Tier ${Math.floor(Math.random() * 3) + 1}`,
          key: `KEY${String(i + 1).padStart(3, '0')}`,
          rule: sampleRules[Math.floor(Math.random() * sampleRules.length)],
          isTabular: Math.random() > 0.7,
          english: sampleEnglishText[Math.floor(Math.random() * sampleEnglishText.length)],
          englishStatus: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          spanish: sampleSpanishText[Math.floor(Math.random() * sampleSpanishText.length)],
          spanishStatus: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          published: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
      
      // Add specific RULE - 175 that can be deleted
      rules.push({
        id: 'rule-175',
        ruleId: '175',
        effectiveDate: '01/01/2025',
        version: '1.0',
        benefitType: 'Medical',
        businessArea: 'Clinical',
        subBusinessArea: 'Primary Care',
        description: 'Rule 175 - Test rule for deletion',
        templateName: 'EOC',
        serviceId: 'SRV175',
        cmsRegulated: true,
        chapterName: 'Chapter 1',
        sectionName: 'Section 1',
        subsectionName: '1.1',
        serviceGroup: 'Medical Services',
        sourceMapping: 'MAP175',
        tiers: 'Tier 1',
        key: 'KEY175',
        rule: 'This is test rule 175 that will be deleted automatically',
        isTabular: false,
        english: 'This is rule 175 content in English',
        englishStatus: 'Draft',
        spanish: 'Este es el contenido de la regla 175 en español',
        spanishStatus: 'Draft',
        published: false,
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      resolve(rules);
    }, 300);
  });
}