import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export type Lang = 'en' | 'al';

export const en = {
  /* nav */
  nav_technology: 'Technology',
  nav_automotive: 'Automotive',
  nav_light_lab: 'Light Lab',
  nav_about: 'About',
  nav_careers: 'Careers',
  scroll: 'Scroll',
  nav_menu: 'Menu',
  back_to_munda: 'Back to MUNDA',
  loading_system: 'Loading system',
  sound_on: 'Sound on',
  sound_off: 'Sound off',
  system_nominal: 'System nominal',
  build: 'Build',

  /* hero */
  hero_kicker: 'MUNDA Automotive · Lighting Technology',
  hero_title_1: 'LIGHT,',
  hero_title_2: 'REIMAGINED.',
  hero_sub:
    'Intelligent textile lighting for the next generation of mobility.',
  explore_technology: 'Explore Technology',
  enter_light_lab: 'Enter Light Lab',

  /* technology */
  sec_technology: 'Technology',
  tech_title: 'LIGHTING BEYOND THE VISIBLE',
  tech_text:
    'MUNDA combines textile structures, optical technologies and intelligent LED systems to create flexible and integrated lighting solutions.',
  tech_01_title: 'Textile',
  tech_01_text: 'Flexible textile structures designed for integrated lighting.',
  tech_02_title: 'Optics',
  tech_02_text: 'Advanced optical structures distribute light across complex surfaces.',
  tech_03_title: 'LED',
  tech_03_text: 'Efficient LED technology enables dynamic and customizable illumination.',

  /* automotive */
  sec_automotive: 'Automotive',
  auto_title: 'LIGHTING AS PART OF THE INTERIOR',
  auto_text:
    'From functional illumination to emotional experiences, integrated lighting transforms the way we experience vehicle interiors.',
  auto_1_k: 'Door panel',
  auto_1_v: 'Light integrated into the door card surface',
  auto_2_k: 'Ambient lighting',
  auto_2_v: 'Dynamic light bars across dashboard and panels',
  auto_3_k: 'Dashboard',
  auto_3_v: 'Optical light guides in the instrument area',
  auto_4_k: 'Textile surfaces',
  auto_4_v: 'Light-emitting textile substrates',

  /* light lab section */
  sec_light_lab: 'Light Lab',
  labsec_title: 'BUILD YOUR LIGHT.',
  labsec_sub: 'Step inside the lab and design your own automotive lighting system.',
  launch_light_lab: 'Launch Light Lab',
  flow_design: 'Design',
  flow_test: 'Test',
  flow_analyze: 'Analyze',
  flow_optimize: 'Optimize',
  labsec_desc:
    'Place LEDs, route optical fibers and choose the textile layer — then run the validation test and push your score past 90.',

  /* about */
  sec_about: 'About',
  about_title: 'ENGINEERING THE FUTURE OF LIGHT',
  about_text:
    'MUNDA combines automotive expertise, textile technology and lighting technology to develop integrated lighting solutions — light that becomes part of the interior itself, not an add-on.',
  about_text2:
    'The MUNDA Light Lab is an interactive simulator where the same three technologies — LED, optical fibers and textile layers — are combined to design a door-panel lighting system.',
  pillar_1_title: 'Automotive expertise',
  pillar_1_text:
    'Interior lighting engineered for the vehicle environment — from door panels to dashboards.',
  pillar_2_title: 'Textile technology',
  pillar_2_text: 'Light-emitting textile structures that integrate with the surfaces of the cabin.',
  pillar_3_title: 'Lighting technology',
  pillar_3_text:
    'LED systems and optical structures combined into flexible, controllable illumination.',

  /* careers */
  sec_careers: 'Careers',
  careers_title: 'BUILD WHAT COMES NEXT.',
  careers_text:
    'Join the people developing new ways to integrate light into the mobility experience.',
  explore_careers: 'Explore Careers',
  careers_val_1_title: 'Engineering depth',
  careers_val_1_text: 'We work where materials science, optics and electronics meet.',
  careers_val_2_title: 'Craft',
  careers_val_2_text: 'Interior lighting is a craft — every surface and every light guide matters.',
  careers_val_3_title: 'Mobility focus',
  careers_val_3_text: 'Everything we build is measured against the vehicle experience.',

  /* footer */
  footer_tagline: 'Intelligent textile lighting for the next generation of mobility.',
  footer_company: 'Company',
  footer_contact: 'Contact',
  footer_copyright: '© 2026 MUNDA Lighting Technology',
  sim_build: 'Sim build',

  /* game entry */
  entry_kicker: 'MUNDA Automotive · Lighting Division',
  entry_tagline: 'Design the future of automotive lighting',
  start: 'Start',
  how_it_works: 'How it works?',
  spec_technology: 'Technology',
  spec_target: 'Target',
  spec_standard: 'Standard',
  spec_tech_value: 'LED / FIBER / TEXTILE',
  spec_target_value: 'DOOR-PANEL LIGHTING',
  spec_standard_value: 'AUTOMOTIVE GRADE',
  footer_sim: 'MUNDA Lighting Systems — Internal Simulation',

  /* tutorial */
  tut_header: 'Tutorial — How it works?',
  step: 'Step',
  tut_1_title: 'LED',
  tut_1_text: 'The LED is the light source. It generates the light that illuminates the car door panel.',
  tut_2_title: 'OPTICAL FIBER',
  tut_2_text:
    'The optical fiber carries the light from the LED to different areas of the panel — even where the LED cannot be placed.',
  tut_3_title: 'TEXTILE',
  tut_3_text:
    'The textile structure spreads the light across the whole surface, creating soft and uniform illumination.',
  tut_4_title: 'OPTIMIZE',
  tut_4_text:
    'Find the best combination of lighting, energy and cost. Every component you add affects all three.',
  next: 'Next',
  back: 'Back',
  start_lab: 'Start the lab',
  tut_intro:
    'You are a Lighting Engineer. Your mission: build an integrated lighting system for a car door panel — combining LED, optical fibers and textiles.',
  tut_role_title: 'Your role — Lighting Engineer',
  tut_role_text:
    'Each workstation simulates a real design phase: from component selection to fiber routing, textile integration and final photometric validation.',
  tut_modules: 'Lab modules',
  open: 'Open',
  locked: 'Locked',
  tut_roadmap: 'Roadmap',
  tut_step1_title: 'Enter the lab',
  tut_step1_text: 'Pick the Light Configurator module from the workstations.',
  tut_step2_title: 'Configure the system',
  tut_step2_text: 'Combine LED, fiber and textile layers to build the light signature.',
  tut_step3_title: 'Pass validation',
  tut_step3_text: 'Next modules unlock once the current station meets its targets.',

  /* design lab */
  design_lab: 'Design Lab',
  light_configurator: 'LIGHT CONFIGURATOR',
  lab_subtitle:
    "Build the panel's light signature: place LEDs, route fibers and choose the textile.",
  level: 'Level',
  active_config: 'Active configuration',
  current_mission: 'Current mission',
  led_control: 'LED Control',
  no_led_selected:
    'Select an LED on the panel or click the panel to add a new one.',
  color: 'Color',
  custom_color: 'Custom color',
  intensity: 'Intensity',
  delete_led: 'Delete LED',
  materials: 'Materials',
  fiber_config: 'Fiber configuration',
  door_panel: 'Door panel',
  panel_hint: 'Click: add LED · Drag: move',
  show_heatmap: 'Show heatmap',
  hide_heatmap: 'Hide heatmap',
  no_light: 'No light',
  strong: 'Strong',
  test_in_progress: 'Test in progress',
  project_stats: 'Project statistics',
  live: 'LIVE',
  metric_uniformity: 'Light uniformity',
  metric_energy: 'Energy efficiency',
  metric_cost: 'Production cost',
  metric_design: 'Design quality',
  metric_manufacturability: 'Manufacturability',
  total_score: 'Total score',
  weights: 'U 30% · E 20% · C 20% · D 15% · M 15%',
  fillo_testin: 'Start the test',
  zone_a: 'ZONE A',
  zone_b: 'ZONE B',
  zone_c: 'ZONE C',

  /* materials */
  mat_textile_name: 'Textile',
  mat_textile_desc: 'Wide light diffusion',
  mat_carbon_name: 'Carbon',
  mat_carbon_desc: 'Focused light, light weight',
  mat_soft_name: 'Soft-touch',
  mat_soft_desc: 'Quality–cost balance',
  mat_alu_name: 'Aluminum',
  mat_alu_desc: 'Strong reflection, less diffusion',

  /* fiber configs */
  fiber_off_name: 'No fibers',
  fiber_off_desc: 'LEDs only',
  fiber_linear_name: 'Linear',
  fiber_linear_desc: 'One main light axis',
  fiber_distributed_name: 'Distributed',
  fiber_distributed_desc: 'Fibers toward side zones',
  fiber_ring_name: 'Ring',
  fiber_ring_desc: 'Full perimeter lighting',

  /* stations */
  stn_configurator: 'Light Configurator',
  stn_fiber: 'Fiber Routing',
  stn_textile: 'Textile Integration',
  stn_validation: 'Validation Bench',

  /* levels */
  level_prefix: 'LEVEL',
  l1_name: 'BASIC LIGHTING',
  l1_objective: 'Reach 80% light uniformity.',
  l1_c1: 'Uniformity ≥ 80%',
  l1_c2: 'Maximum 3 LEDs',
  l2_name: 'EFFICIENCY',
  l2_objective: 'Reach 85% uniformity using energy efficiently.',
  l2_c1: 'Uniformity ≥ 85%',
  l2_c2: 'Energy efficiency ≥ 75%',
  l3_name: 'PREMIUM INTERIOR',
  l3_objective: 'Create a design with high visual quality.',
  l3_c1: 'Design quality ≥ 80%',
  l4_name: 'PRODUCTION',
  l4_objective: 'Balance production cost with manufacturability.',
  l4_c1: 'Production cost ≥ 75%',
  l4_c2: 'Manufacturability ≥ 80%',
  l5_name: 'MUNDA MASTER',
  l5_objective: 'Reach at least 90/100 in total score.',
  l5_c1: 'Total score ≥ 90',

  /* report */
  report_header: 'Validation report',
  report_title: 'TEST COMPLETED',
  report_criteria: 'Level criteria',
  report_pass: 'Level completed',
  report_fail: 'Project needs optimization',
  report_next: 'Next level',
  report_finish: 'Finish',
  optimize_design: 'Optimize design',
} as const;

export type TKey = keyof typeof en;

export const al: Record<TKey, string> = {
  nav_technology: 'Teknologjia',
  nav_automotive: 'Automotive',
  nav_light_lab: 'Light Lab',
  nav_about: 'Rreth',
  nav_careers: 'Karriera',
  scroll: 'Shkrollo',
  nav_menu: 'Menu',
  back_to_munda: 'Kthehu te MUNDA',
  loading_system: 'Duke ngarkuar sistemin',
  sound_on: 'Zëri ndezur',
  sound_off: 'Zëri fikur',
  system_nominal: 'Sistemi nominal',
  build: 'Build',

  hero_kicker: 'MUNDA Automotive · Teknologji Ndriçimi',
  hero_title_1: 'DRITË,',
  hero_title_2: 'E RISHPIKUR.',
  hero_sub:
    'Ndriçim inteligjent me tekstile për gjeneratën e ardhshme të lëvizshmërisë.',
  explore_technology: 'Eksploro teknologjinë',
  enter_light_lab: 'Hyr në Light Lab',

  sec_technology: 'Teknologjia',
  tech_title: 'NDRIÇIM PËRTEJ TË DUKSHMES',
  tech_text:
    'MUNDA kombinon strukturat tekstile, teknologjitë optike dhe sistemet inteligjente LED për të krijuar zgjidhje ndriçimi fleksibël dhe të integruara.',
  tech_01_title: 'Tekstil',
  tech_01_text: 'Struktura fleksibël tekstile të dizajnuara për ndriçim të integruar.',
  tech_02_title: 'Optikë',
  tech_02_text: 'Struktura optike të avancuara që e shpërndajnë dritën nëpër sipërfaqe komplekse.',
  tech_03_title: 'LED',
  tech_03_text: 'Teknologjia efikase LED mundëson ndriçim dinamik dhe të personalizueshëm.',

  sec_automotive: 'Automotive',
  auto_title: 'NDRIÇIMI SI PJESË E INTERIERIT',
  auto_text:
    'Nga ndriçimi funksional te përvojat emocionale, ndriçimi i integruar transformon mënyrën si e përjetojmë interierin e mjetit.',
  auto_1_k: 'Paneli i derës',
  auto_1_v: 'Dritë e integruar në sipërfaqen e panelit',
  auto_2_k: 'Ndriçimi ambient',
  auto_2_v: 'Shirita drite dinamikë nëpër pult dhe panele',
  auto_3_k: 'Pulti i instrumenteve',
  auto_3_v: 'Udhërrëfyes optikë drite në zonën e instrumenteve',
  auto_4_k: 'Sipërfaqet tekstile',
  auto_4_v: 'Substrate tekstile që lëshojnë dritë',

  sec_light_lab: 'Light Lab',
  labsec_title: 'NDËRTO DRITËN TËNDE.',
  labsec_sub:
    'Hyr në laborator dhe dizajno sistemin tënd të ndriçimit automotive.',
  launch_light_lab: 'Nis Light Lab',
  flow_design: 'Dizajno',
  flow_test: 'Testo',
  flow_analyze: 'Analizo',
  flow_optimize: 'Optimizo',
  labsec_desc:
    'Vendos LED, rrugëto fibra optike dhe zgjidh shtresën tekstile — pastaj krye testin e validimit dhe kalo rezultatin mbi 90.',

  sec_about: 'Rreth',
  about_title: 'INXHINIERIA E SË ARDHMES SË DRITËS',
  about_text:
    'MUNDA kombinon ekspertizën automotive, teknologjinë tekstile dhe teknologjinë e ndriçimit për të zhvilluar zgjidhje ndriçimi të integruara — dritë që bëhet pjesë e vetë interierit, jo një shtesë.',
  about_text2:
    'MUNDA Light Lab është një simulator interaktiv ku të njëjtat tri teknologji — LED, fibra optike dhe shtresa tekstile — kombinohen për të dizajnuar një sistem ndriçimi për panelin e derës.',
  pillar_1_title: 'Ekspertizë automotive',
  pillar_1_text:
    'Ndriçim interieri i inxhinieruar për mjedisin e mjetit — nga panelet e derës te pulti i instrumenteve.',
  pillar_2_title: 'Teknologji tekstile',
  pillar_2_text:
    'Struktura tekstile që lëshojnë dritë, të integruara me sipërfaqet e kabinës.',
  pillar_3_title: 'Teknologji ndriçimi',
  pillar_3_text:
    'Sisteme LED dhe struktura optike të kombinuara në ndriçim fleksibël dhe të kontrollueshëm.',

  sec_careers: 'Karriera',
  careers_title: 'NDËRTO ATË QË VIEN MË PAS.',
  careers_text:
    'Bashkohu me njerëzit që zhvillojnë mënyra të reja për të integruar dritën në përvojën e lëvizshmërisë.',
  explore_careers: 'Eksploro karrierat',
  careers_val_1_title: 'Thellësi inxhinierike',
  careers_val_1_text: 'Punojmë aty ku takohen shkenca e materialeve, optika dhe elektronika.',
  careers_val_2_title: 'Mjeshtëri',
  careers_val_2_text:
    'Ndriçimi i interierit është mjeshtëri — çdo sipërfaqe dhe çdo udhërrëfyes drite ka rëndësi.',
  careers_val_3_title: 'Fokus në lëvizshmëri',
  careers_val_3_text: 'Gjithçka që ndërtojmë matet me përvojën në mjet.',

  footer_tagline:
    'Ndriçim inteligjent me tekstile për gjeneratën e ardhshme të lëvizshmërisë.',
  footer_company: 'Kompania',
  footer_contact: 'Kontakt',
  footer_copyright: '© 2026 MUNDA Lighting Technology',
  sim_build: 'Sim build',

  entry_kicker: 'MUNDA Automotive · Divizioni i Ndriçimit',
  entry_tagline: 'Projekto të ardhmen e ndriçimit automotive',
  start: 'Fillimi',
  how_it_works: 'Si funksionon?',
  spec_technology: 'Teknologjia',
  spec_target: 'Objektivi',
  spec_standard: 'Standardi',
  spec_tech_value: 'LED / FIBER / TEXTILE',
  spec_target_value: 'NDRIÇIM PANELI DERE',
  spec_standard_value: 'AUTOMOTIVE GRADE',
  footer_sim: 'Sisteme Ndriçimi MUNDA — Simulim i Brendshëm',

  tut_header: 'Tutorial — Si funksionon?',
  step: 'Hapi',
  tut_1_title: 'LED',
  tut_1_text:
    'LED-i është burimi i dritës. Ai gjeneron dritën që ndriçon panelin e derës së veturës.',
  tut_2_title: 'FIBRA OPTIKE',
  tut_2_text:
    'Fibra optike e transporton dritën nga LED-i drejt zonave të ndryshme të panelit — edhe aty ku LED-i nuk mund të vendoset.',
  tut_3_title: 'TEKSTILI',
  tut_3_text:
    'Struktura tekstile e shpërndan dritën në të gjithë sipërfaqen, duke krijuar një ndriçim të butë dhe uniform.',
  tut_4_title: 'OPTIMIZO',
  tut_4_text:
    'Gjej kombinimin më të mirë mes ndriçimit, energjisë dhe kostos. Çdo komponent që shton ka efekt në të trija.',
  next: 'Tjetër',
  back: 'Kthehu',
  start_lab: 'Filloni laboratorin',
  tut_intro:
    'Ti je Lighting Engineer. Misioni yt: të ndërtosh një sistem ndriçimi të integruar për panelin e derës së një veture — duke kombinuar LED, fibra optike dhe tekstile.',
  tut_role_title: 'Roli yt — Lighting Engineer',
  tut_role_text:
    'Çdo stacion pune simulon një fazë reale të projektimit: nga përzgjedhja e komponentëve te rrugëtimi i fibrave, integrimi në tekstile dhe validimi final fotometrik.',
  tut_modules: 'Modulet e lab-it',
  open: 'I hapur',
  locked: 'I kyçur',
  tut_roadmap: 'Udhërrëfimi',
  tut_step1_title: 'Hyr në laborator',
  tut_step1_text: 'Zgjidh modulin Light Configurator nga stacionet e punës.',
  tut_step2_title: 'Konfiguro sistemin',
  tut_step2_text: 'Kombino shtresat LED, fibra dhe tekstile për të ndërtuar sinjaturën e dritës.',
  tut_step3_title: 'Kalo validimin',
  tut_step3_text:
    'Modulet e ardhshme zhbllokohen pasi stacioni aktual plotëson objektivat.',

  design_lab: 'Design Lab',
  light_configurator: 'KONFIGURUESI I DRITËS',
  lab_subtitle:
    'Ndërto sinjaturën e dritës së panelit: vendos LED, rrugëto fibra dhe zgjidh tekstilin.',
  level: 'Niveli',
  active_config: 'Konfigurim aktiv',
  current_mission: 'Misioni aktual',
  led_control: 'Kontrolli i LED-it',
  no_led_selected:
    'Zgjidh një LED në panel ose kliko në panel për të shtuar një të ri.',
  color: 'Ngjyra',
  custom_color: 'Ngjyrë e personalizuar',
  intensity: 'Intensiteti',
  delete_led: 'Fshij LED-in',
  materials: 'Materialet',
  fiber_config: 'Konfigurimi i fibrave',
  door_panel: 'Paneli i derës',
  panel_hint: 'Kliko: shto LED · Zvarrit: lëviz',
  show_heatmap: 'Shfaq heatmap',
  hide_heatmap: 'Fsheh heatmap',
  no_light: 'Pa dritë',
  strong: 'E fortë',
  test_in_progress: 'Testi në vazhdim',
  project_stats: 'Statistikat e projektit',
  live: 'LIVE',
  metric_uniformity: 'Uniformiteti i dritës',
  metric_energy: 'Efikasiteti i energjisë',
  metric_cost: 'Kostoja e prodhimit',
  metric_design: 'Cilësia e dizajnit',
  metric_manufacturability: 'Mundësia e prodhimit',
  total_score: 'Rezultati total',
  weights: 'U 30% · E 20% · K 20% · D 15% · P 15%',
  fillo_testin: 'Fillo testin',
  zone_a: 'ZONA A',
  zone_b: 'ZONA B',
  zone_c: 'ZONA C',

  mat_textile_name: 'Tekstil',
  mat_textile_desc: 'Shpërndarje e gjerë e dritës',
  mat_carbon_name: 'Karbon',
  mat_carbon_desc: 'Dritë e fokusuar, peshë e lehtë',
  mat_soft_name: 'Soft-touch',
  mat_soft_desc: 'Ekuilibër cilësi–kosto',
  mat_alu_name: 'Alumini',
  mat_alu_desc: 'Reflektim i fortë, më pak shpërndarje',

  fiber_off_name: 'Pa fibra',
  fiber_off_desc: 'Vetëm LED',
  fiber_linear_name: 'Lineare',
  fiber_linear_desc: 'Një bosht kryesor drite',
  fiber_distributed_name: 'Shpërndarëse',
  fiber_distributed_desc: 'Fibra drejt zonave anësore',
  fiber_ring_name: 'Unazore',
  fiber_ring_desc: 'Perimetër i plotë ndriçimi',

  stn_configurator: 'Light Configurator',
  stn_fiber: 'Fiber Routing',
  stn_textile: 'Textile Integration',
  stn_validation: 'Validation Bench',

  level_prefix: 'NIVELI',
  l1_name: 'NDRIÇIMI BAZË',
  l1_objective: 'Arri 80% uniformitet të dritës në panel.',
  l1_c1: 'Uniformiteti ≥ 80%',
  l1_c2: 'Maksimumi 3 LED',
  l2_name: 'EFIKASITETI',
  l2_objective: 'Arri 85% uniformitet duke e përdorur energjinë në mënyrë efikase.',
  l2_c1: 'Uniformiteti ≥ 85%',
  l2_c2: 'Efikasiteti i energjisë ≥ 75%',
  l3_name: 'INTERIOR PREMIUM',
  l3_objective: 'Krijo një dizajn me cilësi të lartë vizuale.',
  l3_c1: 'Cilësia e dizajnit ≥ 80%',
  l4_name: 'PRODHIMI',
  l4_objective: 'Balanco koston e prodhimit me prodhueshmërinë.',
  l4_c1: 'Kostoja e prodhimit ≥ 75%',
  l4_c2: 'Prodhueshmëria ≥ 80%',
  l5_name: 'MUNDA MASTER',
  l5_objective: 'Arri të paktën 90/100 në rezultatin total.',
  l5_c1: 'Rezultati total ≥ 90',

  report_header: 'Raporti i validimit',
  report_title: 'TESTI I PËRFUNDUAR',
  report_criteria: 'Kriteret e nivelit',
  report_pass: 'Niveli i përfunduar',
  report_fail: 'Projekti duhet optimizuar',
  report_next: 'Niveli tjetër',
  report_finish: 'Përfundo',
  optimize_design: 'Optimizo dizajnin',
};

export function useT() {
  const lang = useSettingsStore((s) => s.lang);
  return useCallback(
    (k: TKey): string => (lang === 'al' ? al[k] : en[k]) ?? en[k] ?? k,
    [lang],
  );
}
