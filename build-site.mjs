import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { peopleLinks, institutionLinks, footerGroups } from './external-links.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const base = 'https://tejasramdassds-sudo.github.io';
const cornellSite = 'https://sites.coecis.cornell.edu/tejasramdas/';
const version = '20260916-cornell';
const updated = '2026-09-24';
const searchVerification = 'HO2lcfGB0txjI-IF2DABt29dFvfqq5JjdVegt3W-X1k';
const person = {
  '@type':'Person', '@id':base+'/#person', name:'Tejas Ramdas', url:base+'/',
  image:base+'/assets/tejas-ramdas-portrait-wide.jpg', email:'mailto:tr336@cornell.edu',
  description:'Ph.D. in Management, Cornell University (August 2026); Ph.D. candidate in Statistics (expected December 2026). Research in strategy, organization theory, innovation, and statistical methods.',
  affiliation:{'@type':'CollegeOrUniversity',name:'Cornell University',url:'https://www.cornell.edu/'},
  knowsAbout:['Competitive strategy','Organization theory','Innovation search','Generative inventions','AI coordination','Statistics','Explainable AI','Natural language processing'],
  sameAs:[cornellSite,'https://bowers.cornell.edu/people/tejas-ramdas','https://stat.cornell.edu/people/tejas-ramdas','https://www.nber.org/people/rtejasonline','https://www.linkedin.com/in/tejas-ramdas-']
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
// Icon paths from Lucide, used under the ISC license (assets/lucide-LICENSE).
const paths = {
  arrow: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  left: '<path d="m15 18-6-6 6-6"/>'
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
const link = (href, label, target = '', symbol = 'arrow', cls = 'text-link') => `<a class="${cls}" href="${esc(href)}"${target ? ` data-track="${href.endsWith('.pdf') ? 'download_document' : 'click_link'}" data-track-target="${esc(target)}"` : ''}>${esc(label)}${icon(symbol)}</a>`;
const namedLinks = new Map([...peopleLinks, ...institutionLinks]);
const namePattern = new RegExp('(' + [...namedLinks.keys()].sort((a,b)=>b.length-a.length).map(name=>name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')', 'g');
// Link only plain-text fields, escaping every segment before rendering HTML.
const linkedText = (text) => String(text).split(namePattern).map(part=>namedLinks.has(part)
  ? `<a class="inline-reference" href="${esc(namedLinks.get(part))}" data-track="click_external" data-track-target="${esc(part)}">${esc(part)}</a>`
  : esc(part)).join('');
const footerDirectory = () => `<div class="container footer-directory">${footerGroups.map(([heading,items])=>`<nav class="footer-group" aria-label="${esc(heading)}"><h2>${esc(heading)}</h2><ul>${items.map(([label,url])=>`<li><a href="${esc(url)}" data-track="click_external" data-track-target="footer_${esc(label)}">${esc(label)}</a></li>`).join('')}</ul></nav>`).join('')}</div>`;
const papers = [
  { id:'generative-inventions', group:'innovation', title:'Generative Inventions and Search Incursions: Technological Proximity and the Nature of Follow-On Inventive Activity', short:'Generative Inventions and Search Incursions', authors:'Tejas Ramdas and Gautam Ahuja', citation:'Ramdas, T., & Ahuja, G.', status:'Job market paper',
    summary:'How do firms use technological breakthroughs to move beyond their own inventive experience and toward areas of strength for other firms?',
    abstract:'We examine inventive search through which firms move beyond their own prior inventive activity and toward knowledge domains more closely associated with other firms. We call this movement search incursion. Generative inventions make previously infeasible combinations of knowledge possible and can weaken the conditions protecting other firms\' advantages. Technological proximity shapes both a firm\'s ability to use an invention and its exposure to the changes that adoption requires. Using patent data, we examine how the likelihood of search incursion varies with technological proximity and the structure of the firm\'s knowledge base.',
    detail:'The study draws on 5.87 million patents and examines firms citing 5,548 generative inventions. Among these firms, incursions are most common when prior inventions are moderately related to the breakthrough. Text reviews conducted without access to the measure\'s score or classification check the search-incursion measure.',
    figure:'search-incursion.png', caption:'Search incursion in inventive space. The red star represents a focal patent; gray squares show earlier patents from the same firm, and blue circles show earlier patents from other firms. The maps illustrate comparisons of patent text. Blinded text review, rather than the visual layout, determines the classifications.' },
  { id:'shaping-the-search-landscape', group:'innovation', title:'Shaping the Search Landscape: Generative Inventions and Follow-On Invention', short:'Shaping the Search Landscape', authors:'Tejas Ramdas', citation:'Ramdas, T.', status:'Working paper',
    summary:'How does the first firm to build on a breakthrough shape the inventive paths and opportunities available to firms that follow?',
    abstract:'I develop competitive shaping search to explain how a firm\'s early choices of knowledge elements and linkages can affect later search around the same generative invention. Horizontal shaping makes a derivative path less attractive to other firms. Vertical shaping positions the first searcher to benefit from future recombination possibilities. Using patent data, I relate knowledge relationships established before the breakthrough to the timing of later follow-on invention.',
    detail:'For 4,030 generative inventions, I identify the first external citing firm and firms that cite the invention later. Other firms follow sooner when the first searcher had previously drawn on knowledge from a larger share of those firms. They follow later when more of those firms had drawn on the first searcher\'s knowledge and the first searcher had accumulated a larger patent stock.',
    figure:'search-landscape.png', caption:'Initial searcher and follow-on search. The network panels depict the same 17 firms and 69 prior citation ties; the ring identifies the initial searcher. The central illustration is conceptual and does not represent a measured patent architecture.' },
  { id:'ai-collectives', group:'coordination', title:'Spontaneous Coordination and Common Knowledge in AI Collectives', short:'Coordination and Common Knowledge in AI Collectives', authors:'Tejas Ramdas and Michael W. Macy', citation:'Ramdas, T., & Macy, M. W.', status:'Working paper',
    summary:'When can independently acting AI agents coordinate their choices, and how do their information and expectations affect collective outcomes?',
    abstract:'We study coordination among large language model agents in two experiments: distributed graph coloring and joint protocol switching after finite chains of acknowledgements. The experiments vary models, network conditions, and what agents know about one another\'s information. Collective outcomes vary substantially: repeated adjustments can leave conflicts unresolved, and additional acknowledgements do not consistently improve joint action. The findings motivate direct evaluation of coordination alongside individual model performance.',
    detail:'Among seven models with complete graph-coloring coverage, 13 of 126 runs reach a legal coloring; none of the 21 simple-cycle conditions is solved. Across five acknowledgement conditions involving 23 model pairs, 30 of 38 unsuccessful outcomes are unilateral moves. Single runs per condition and differences accompanying acknowledgement depth limit causal interpretation.',
    figure:'ai-coordination.png', caption:'Two coordination tasks. Connected agents must choose different colors in graph coloring. In the protocol-switching task, agents must act together after a finite sequence of acknowledgements. Finite acknowledgements provide levels of shared knowledge without establishing common knowledge.' },
  { id:'changing-recombination-spaces', group:'innovation', title:'Generative Inventions and Changing Recombination Spaces', authors:'Tejas Ramdas and Y. S. Wang', citation:'Ramdas, T., & Wang, Y. S.', status:'Work in progress', summary:'How breakthroughs change the combinations of knowledge available to firms and the interfirm networks through which knowledge is used.' },
  { id:'genesis-of-constitutions', group:'statistics', title:'The Genesis of Constitutions: A Natural Language Processing Approach', authors:'Tejas Ramdas, Patrick Huang, Nuno Garoupa, Martin T. Wells, Yun-chien Chang, and Tom Ginsburg', citation:'Ramdas, T., Huang, P., Garoupa, N., Wells, M. T., Chang, Y., & Ginsburg, T.', status:'Accepted at ICON', summary:'A method for estimating how constitutional language combines contributions associated with earlier texts and vocabulary absent from those references.', abstract:'Using 569 constitutions adopted between 1900 and 2020, the study models each constitution\'s word-frequency profile as a combination of earlier reference constitutions and a novel component. Chronological restrictions and separate analyses of rights provisions allow continuity and departures from earlier constitutional language to be examined together.' },
  { id:'iconic-constitutions', group:'statistics', title:'Algorithmic Selection of Iconic Constitutions', authors:'Tejas Ramdas, C. Huang, Nuno Garoupa, Martin T. Wells, Yun-chien Chang, and Tom Ginsburg', citation:'Ramdas, T., Huang, C., Garoupa, N., Wells, M. T., Chang, Y., & Ginsburg, T.', status:'Revise and resubmit', summary:'Selecting reference constitutions by balancing originality with coverage of language in subsequent constitutions.', abstract:'The procedure selects sets of four reference texts from 180 constitutions enacted through 1899 and evaluates their coverage of 581 later constitutions. It identifies alternative balances between originality and coverage, making the choice of reference texts explicit and repeatable.', url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5437774', outlet:'SSRN' },
  { id:'bellwether-trades', group:'statistics', title:'Bellwether Trades: Characteristics of Trades Influential in Predicting Future Price Movements in Markets', authors:'Tejas Ramdas and Martin T. Wells', citation:'Ramdas, T., & Wells, M. T.', status:'Working paper', summary:'Explainable AI identifies which trades influence a model\'s price forecast and how that influence depends on trading context.', abstract:'I measure a neural network forecast\'s local sensitivity to individual trades, then examine how influence varies with trade size, venue, timing, asset type, and surrounding transactions. The method connects the model\'s predictions to economic heterogeneity in the information supplied by trades.', url:'https://arxiv.org/abs/2409.05192', outlet:'arXiv' },
  { id:'phylogenetic-constitutions', group:'statistics', title:'A Phylogenetic Tree of Constitutions 1799 to 2025', authors:'Tejas Ramdas, Martin T. Wells, and Yun-chien Chang', citation:'Ramdas, T., Wells, M. T., & Chang, Y.', status:'Work in progress' },
  { id:'b-corp', group:'earlier', title:'Substantive and Subjective: A Multi-Method Investigation of B Corp Certification on Customer Ratings', authors:'K. Qiao, Wesley D. Sine, Tejas Ramdas, and M. Ross', citation:'Qiao, K., Sine, W. D., Ramdas, T., & Ross, M.', status:'Revise and resubmit at Academy of Management Journal' },
  { id:'executive-skills', group:'earlier', title:'The Demand for Executive Skills', authors:'Stephen Hansen, Tejas Ramdas, Raffaella Sadun, and Joseph Fuller', citation:'Hansen, S., Ramdas, T., Sadun, R., & Fuller, J.', status:'NBER Working Paper 28959', url:'https://www.nber.org/papers/w28959', outlet:'NBER' },
  { id:'management-ideas', group:'earlier', title:'Visualizing a Century of Management Ideas', authors:'Tejas Ramdas, Raffaella Sadun, and Nicholas Bloom', citation:'Ramdas, T., Sadun, R., & Bloom, N.', status:'Harvard Business Review, 2022', url:'https://hbr.org/2022/09/visualizing-a-century-of-management-ideas', outlet:'Harvard Business Review' }
];
const researchFigures = {
  'generative-inventions': [
    {file:'search-incursion.png', width:1198, height:763, caption:'Search incursion in inventive space. The maps illustrate patent-text comparisons; classification comes from blinded text review.'},
    {file:'search-incursion-distance.png', width:1859, height:1046, caption:'Observed search-incursion rates across technological-distance bins. The fitted curve is descriptive; intervals are unadjusted.'}
  ],
  'shaping-the-search-landscape': [
    {file:'search-landscape.png', width:2218, height:863, caption:'Prior knowledge relationships and the timing of follow-on search. The central artifact illustration is conceptual.'}
  ],
  'ai-collectives': [
    {file:'ai-coordination.png', width:2009, height:1496, caption:'Graph coloring and protocol switching under finite acknowledgement chains.'}
  ],
  'changing-recombination-spaces': [
    {file:'recombination-spaces.png', width:2219, height:986, caption:'How a generative invention can reconfigure interfirm knowledge flows. Network changes are hypothetical.'}
  ],
  'genesis-of-constitutions': [
    {file:'genesis-of-constitutions.png', width:2219, height:1131, caption:'Decomposing constitutional language into earlier reference contributions and novel vocabulary. Conceptual schematic.'}
  ],
  'bellwether-trades': [
    {file:'bellwether-trades.png', width:2219, height:1298, caption:'From trade sequences to forecasts and trade-level influence. Conceptual schematic.'}
  ],
  'iconic-constitutions': [
    {file:'iconic-constitutions.png', width:2218, height:1188, caption:'Genetic search for reference constitutions, balancing originality and coverage. Illustrative, not estimated results.'}
  ]
};
const paperFigures = (p) => (researchFigures[p.id] || []).map(figure=>`<figure class="paper-visual"><a href="assets/${figure.file}" aria-label="View full-size figure for ${esc(p.title)}" title="Open full-size figure" data-track="view_figure" data-track-target="${p.id}"><img src="assets/${figure.file}" width="${figure.width}" height="${figure.height}" alt="${esc(figure.caption)}" loading="lazy" decoding="async"></a><figcaption>${esc(figure.caption)}</figcaption></figure>`).join('');

const education = [
  ['2026 (expected December)', 'Ph.D. in Statistics', 'Cornell University', 'Advisor: Martin T. Wells'],
  ['2026 (August)', 'Ph.D. in Management', 'Cornell University, S.C. Johnson College of Business', 'Advisor: Gautam Ahuja'],
  ['2018', 'M.S. in Applied Mathematics', 'University of Colorado Denver', ''],
  ['2018', 'M.A. in Economics', 'University of Colorado Denver', ''],
  ['2015', 'B.E. in Mechanical Engineering', 'Visvesvaraya Technological University', 'With Distinction']
];
const experience = [
  ['2023', 'Morgan Stanley', 'Summer Associate, Wealth Management Analytics, Data and Innovation'],
  ['2018', 'Research Associate, HBS', 'Strategy Unit'],
  ['2015', 'Accenture', 'Associate Software Engineer, following B.E.'],
  ['2013-2014', 'National Aerospace Laboratories', 'Undergraduate Researcher, Experimental Aerodynamics Division']
];
const courses = [
  ['MBA', 'NBA 6650', 'The Strategic Management of Technology and Innovation'],
  ['MBA', 'NBA 6050', 'Strategy Formulation and Competitive Analysis'],
  ['MBA', 'NBA 6029', 'Leading Agile Innovation'],
  ['MBA', 'NBA 5645', 'Dilemmas in Founding New Ventures'],
  ['MBA', 'NBA 5100', 'Social Entrepreneurship'],
  ['Graduate', 'CS 5726', 'Learning, Inference and Decision Making with Data'],
  ['Graduate', 'BANA 6610', 'Optimization in Machine Learning'],
  ['Graduate', 'BANA 6612', 'Time Series Analysis'],
  ['Graduate', 'ECON 5083', 'Macroeconomic Theory'],
  ['Undergraduate', 'ECON 3811', 'Statistics with Computer Applications'],
  ['Undergraduate', 'ECON 2022', 'Principles of Microeconomics'],
  ['Undergraduate', 'ECON 2021', 'Principles of Macroeconomics'],
  ['Undergraduate', 'ECON 3100', 'Economics of Race and Gender'],
  ['Undergraduate', 'ECON 3010', 'Probability and Statistics for Social Science'],
  ['Undergraduate', 'MATH 1710', 'Statistical Theory and Applications']
];
const pageNames = [];
function page(file, title, description, content, active = '', schema = null) {
  const navigation = [['./','About'],['research.html','Research'],['teaching.html','Teaching'],['cv.html','CV'],['./#contact','Contact']];
  const url = base+'/'+(file === 'index.html' ? '' : file);
  const article = schema?.['@type'] === 'ScholarlyArticle' ? {...schema,'@id':url+'#article',mainEntityOfPage:{'@id':url+'#webpage'}} : null;
  const structuredData = {'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':base+'/#website',url:base+'/',name:'Tejas Ramdas',alternateName:'Tejas Ramdas | Cornell University',publisher:{'@id':person['@id']},inLanguage:'en'},
    person,
    {'@type':file === 'index.html' ? 'ProfilePage' : 'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'en',isPartOf:{'@id':base+'/#website'},about:{'@id':person['@id']},...(file === 'index.html' ? {mainEntity:{'@id':person['@id']}} : article ? {mainEntity:{'@id':article['@id']}} : {})},
    ...(article ? [article] : [])
  ]};
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Tejas Ramdas">
  <meta name="robots" content="index, follow, max-image-preview:large">
  ${file === 'index.html' ? `<meta name="google-site-verification" content="${searchVerification}">` : ''}
  <meta name="theme-color" content="#b31b1b">
  <title>${esc(title)}</title>
  <link rel="canonical" href="${base}/${file === 'index.html' ? '' : file}">
  <meta property="og:type" content="${file === 'index.html' ? 'profile' : 'website'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${base}/${file === 'index.html' ? '' : file}">
  <meta property="og:image" content="${base}/assets/tejas-ramdas-portrait-wide.jpg">
  <meta property="og:image:alt" content="Tejas Ramdas">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Libre+Baskerville:wght@400;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=${version}">
  <script src="navigation.js?v=${version}" defer></script>
  <script src="script.js?v=${version}" defer></script>
  <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<','\\u003c')}</script>
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="./">Tejas Ramdas</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation" title="Navigation">${icon('menu')}</button>
    <nav class="site-nav" id="primary-nav" aria-label="Primary navigation">${navigation.map(([url,label])=>`<a href="${url}"${active===label ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
  </div></header>
  <main id="main">${content}</main>
  <footer class="site-footer" id="academic-links">${footerDirectory()}<div class="container footer-inner"><span>&copy; <span id="year">2026</span> Tejas Ramdas</span><nav class="footer-links" aria-label="Footer navigation"><a href="profiles-and-papers.html">Profiles &amp; links</a><a href="research-areas.html">Research areas</a><a href="privacy.html">Privacy</a><a href="mailto:tr336@cornell.edu" data-track="click_email" data-track-target="footer_email">Email</a></nav></div></footer>
</body>
</html>
`;
  writeFileSync(join(root,file),html);
  pageNames.push(file);
}
const intro = (label, title, body='') => `<section class="page-intro"><div class="container"><p class="eyebrow">${label}</p><h1>${title}</h1>${body}</div></section>`;
const contents = (items) => `<nav class="contents" aria-label="On this page"><p>On this page</p>${items.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</nav>`;
const timeline = (items) => `<ol class="timeline">${items.map(([year,title,desc,extra])=>`<li><time>${esc(year)}</time><h3>${linkedText(title)}</h3><p>${linkedText(desc)}${extra ? `<br>${linkedText(extra)}` : ''}</p></li>`).join('')}</ol>`;
const featured = [papers[0],papers[1],papers[2]];
const researchPanels = [
  { id:'management', title:'Management research', description:'Strategy, innovation search, organizations, and AI coordination.', previews:featured, groups:['innovation','coordination','earlier'] },
  { id:'statistics', title:'Statistics research', description:'Statistical methods, explainable AI, finance, and constitutional text.', previews:[
    {...papers[4], short:'The Genesis of Constitutions'},
    {...papers[6], short:'Bellwether Trades'},
    {...papers[5], short:'Algorithmic Selection of Iconic Constitutions'}
  ], groups:['statistics'] }
];
const previewPaper = (p) => {
  const href = p.detail ? p.id+'.html' : 'research.html#'+p.id;
  return `<article class="panel-paper"><p class="paper-status">${p.status}</p><h4><a href="${href}" data-track="paper_interest" data-track-target="${p.id}">${p.short}</a></h4><p class="authors">${linkedText(p.authors)}</p>${paperFigures(p)}<p>${esc(p.summary)}</p>${link(href,'Read summary',p.id,'right')}</article>`;
};

page('index.html', 'Tejas Ramdas | Cornell Strategy & Statistics Research', 'Tejas Ramdas at Cornell: Ph.D. in Management and Ph.D. candidate in Statistics. Research in strategy, innovation, AI coordination, and statistical methods. Papers and CV.', `
<section class="profile container" aria-labelledby="name">
  <div class="profile-title"><div><p class="eyebrow">${linkedText('Cornell University')}</p><h1 id="name">Tejas Ramdas</h1></div><p class="disciplines">Strategy &middot; Organization theory &middot; Statistics</p></div>
  <div class="profile-grid">
    <div><figure class="portrait"><img src="assets/tejas-ramdas-portrait-wide.jpg" alt="Portrait of Tejas Ramdas" width="1200" height="800" fetchpriority="high"><figcaption class="portrait-caption"><strong>${linkedText('Cornell University')}</strong><br>${linkedText('S.C. Johnson College of Business')}<br>${linkedText('Statistics and Data Science')}</figcaption></figure><div class="profile-links">${link('mailto:tr336@cornell.edu','Email','profile_email','mail')}${link('cv.html','Curriculum vitae','profile_cv','right')}${link(cornellSite,'Cornell website','profile_cornell')}${link('profiles-and-papers.html','Profiles','profile_links')}</div></div>
    <div class="bio"><p class="credentials"><strong>Ph.D. in Management</strong>, ${linkedText('Cornell University')}, August 2026<br><strong>Ph.D. candidate in Statistics</strong>, expected December 2026</p>
    <p class="lead">I study how firms compete through innovation search, and how technological breakthroughs change the possibilities for invention.</p>
    <p>My research examines how firms move into new areas of invention and shape the opportunities available to other firms. I also study coordination and common knowledge in collectives of AI agents.</p>
    <p>My statistics research develops methods in explainable AI, causal machine learning, and natural language processing, with applications in finance and law.</p>
    <div class="inline-actions">${link('generative-inventions.html','Job market paper','home_job_market_paper','right','button')}${link('assets/Tejas_Ramdas_Academic_CV_August_2026.pdf','CV (PDF)','home_cv_download','download')}</div></div>
  </div>
</section>
<section id="research" class="band quiet"><div class="container" id="writing"><div class="section-top"><h2>Selected research</h2>${link('research.html','All research','all_research','right')}</div>
  <div class="research-panels">${researchPanels.map(panel=>`<section class="research-panel" aria-labelledby="home-${panel.id}"><header class="panel-heading"><h3 id="home-${panel.id}">${panel.title}</h3><p>${panel.description}</p></header><div class="panel-papers">${panel.previews.map(previewPaper).join('')}</div><div class="panel-footer">${link('research.html#'+panel.id,'All '+panel.id+' research','all_'+panel.id,'right')}</div></section>`).join('')}</div>
</div></section>
<section id="timeline" class="band"><div class="container"><div class="section-top"><h2>Education &amp; experience</h2>${link('cv.html','Full CV','background_cv','right')}</div><div class="background-grid"><div><h3 class="column-label">Education</h3>${timeline(education)}</div><div><h3 class="column-label">Professional experience</h3>${timeline(experience)}</div></div></div></section>
<section id="teaching" class="band quiet"><div class="container teaching-preview"><div><p class="section-label">Teaching</p><h2>Theory, evidence, and independent judgment.</h2><p>Teaching assistant experience across 15 MBA, graduate, and undergraduate courses.</p></div><div><ul class="course-shortlist"><li>Strategy Formulation and Competitive Analysis</li><li>The Strategic Management of Technology and Innovation</li><li>Learning, Inference and Decision Making with Data</li></ul>${link('teaching.html','Teaching approach and experience','teaching_overview','right')}</div></div></section>
<section id="contact" class="band"><div class="container contact-inner"><div><p class="section-label">Contact</p><h2>Get in touch</h2>${link('mailto:tr336@cornell.edu','tr336@cornell.edu','contact_email','mail')}</div><address class="contact-address">320 Tata Innovation Center, ${linkedText('Cornell Tech')}<br>11 East Loop Road<br>New York, NY 10044</address></div></section>
`, 'About');

const researchGroups = [['innovation','Innovation &amp; competitive search'],['coordination','Coordination in AI collectives'],['statistics','Statistics, finance &amp; law'],['earlier','Earlier collaborative work']];
function paperRow(p, heading = 'h3') {
  const local = !!p.detail;
  return `<article class="paper" id="${p.id}"><p class="paper-status">${p.status}</p><${heading}>${local?`<a href="${p.id}.html" data-track="paper_interest" data-track-target="${p.id}">${p.title}</a>`:p.title}</${heading}><p class="authors">${linkedText(p.authors)}</p>${paperFigures(p)}${p.summary?`<p>${esc(p.summary)}</p>`:''}${p.abstract?`<details><summary data-track="expand_abstract" data-track-target="${p.id}">Summary</summary><p>${esc(p.abstract)}</p></details>`:''}${local||p.url?`<div class="inline-actions">${local?link(p.id+'.html','Paper overview',p.id,'right'):''}${p.url?link(p.url,p.outlet,p.id):''}</div>`:''}</article>`;
}
page('research.html','Research | Tejas Ramdas | Cornell','Management and Statistics research by Tejas Ramdas: generative inventions, search incursions, AI collectives, explainable AI, finance, and constitutional text.',intro('Research','Research',`<p class="lead">Two research programs: management and statistics.</p><nav class="research-jumps" aria-label="Research programs">${researchPanels.map(panel=>link('#'+panel.id,panel.title,'research_'+panel.id,'right')).join('')}</nav>`)+`<div class="container research-panels research-directory">${researchPanels.map(panel=>`<section class="research-panel" id="${panel.id}" aria-labelledby="${panel.id}-title"><header class="panel-heading"><h2 id="${panel.id}-title">${panel.title}</h2><p>${panel.description}</p></header>${researchGroups.filter(([id])=>panel.groups.includes(id)).map(([id,label])=>`<section class="research-subgroup"${id!==panel.id?` id="${id}"`:''}><h3 class="subgroup-title">${label}</h3>${papers.filter(p=>p.group===id).map(p=>paperRow(p,'h4')).join('')}</section>`).join('')}</section>`).join('')}</div>`,'Research');

for (const p of featured) {
  page(p.id+'.html',p.short+' | Tejas Ramdas',p.summary,`<section class="page-intro"><div class="container paper-heading"><div class="back-link">${link('research.html','All research','','left')}</div><p class="eyebrow">${p.status}</p><h1>${p.title}</h1><p class="authors">${linkedText(p.authors)}</p></div></section><article class="container reading"><h2>Overview</h2><p class="lead">${p.summary}</p><p>${esc(p.abstract)}</p><h2>The study</h2><p>${esc(p.detail)}</p><figure class="research-figure"><a href="assets/${p.figure}" aria-label="View full-size research figure" data-track="view_figure" data-track-target="${p.id}"><img src="assets/${p.figure}" alt="${esc(p.caption)}" loading="lazy"></a><figcaption>${p.caption}</figcaption></figure><div class="topic-list">${link('research.html','All research','','right')}${link('cv.html','Curriculum vitae','','right')}</div></article>`,'Research',{'@context':'https://schema.org','@type':'ScholarlyArticle',headline:p.title,author:p.authors.split(' and ').map(name=>({'@type':'Person',name,...(peopleLinks.has(name)?{url:peopleLinks.get(name)}:{})})),description:p.abstract,url:base+'/'+p.id+'.html',creativeWorkStatus:'Working paper',isPartOf:{'@type':'WebSite',name:'Tejas Ramdas',url:base}});
}

const courseTable = (level) => `<table class="course-table"><thead><tr><th scope="col">Course</th><th scope="col">Title</th></tr></thead><tbody>${courses.filter(c=>c[0]===level).map(c=>`<tr><td>${c[1]}</td><td>${c[2]}</td></tr>`).join('')}</tbody></table>`;
page('teaching.html','Teaching | Tejas Ramdas','Teaching approach and experience in strategy, organization theory, statistics, and analytical methods. Teaching assistant experience across 15 courses.',intro('Teaching','Teaching',`<p class="lead">My teaching objective is to develop students' capacity to explain organizational phenomena, evaluate strategic alternatives, and exercise independent judgment.</p>`)+`<div class="container page-layout">${contents([['approach','Teaching approach'],['experience','Course experience'],['evaluations','Student evaluations']])}<div><section id="approach" class="research-section"><h2>Theory, evidence, and action</h2><p>I organize instruction around the relationship between a theoretical explanation, the evidence for it, and the action that follows. Students should be able to explain the grounds of a recommendation, test its assumptions, and revise their judgment as evidence warrants.</p><div class="teaching-principles"><div><h3>Framework command</h3><p>Define constructs, explain mechanisms, and derive predictions accurately.</p></div><div><h3>Conditional judgment</h3><p>Examine whether a framework's assumptions hold in the setting at hand.</p></div><div><h3>Independent evaluation</h3><p>Compare explanations and identify the evidence that distinguishes them.</p></div></div><p>In MBA case teaching, I would structure discussion around diagnosis, decision, and implementation. In organization theory, I would emphasize assumptions, mechanisms, and explanatory scope. In analytical courses, I would connect substantive questions to measurement, research design, and inference.</p></section><section id="experience" class="research-section"><h2>Teaching assistant experience</h2><p>My experience spans fifteen MBA, graduate, and undergraduate courses.</p>${['MBA','Graduate','Undergraduate'].map(level=>`<h3>${level}</h3>${courseTable(level)}`).join('')}</section><section id="evaluations" class="research-section"><h2>Student evaluations</h2><div class="evaluation"><p class="score">4.90 / 5</p><p>Willingness and availability to help students</p><small>Cornell MATH 1710, Fall 2020 and Spring 2021, across four sections. 31 responses to this item; 32 evaluation forms from 77 enrollments. This is an item-specific rating, not an overall teaching score.</small></div><p>In undergraduate recitations, I connect computational procedures to statistical concepts, anticipate common points of confusion, and check understanding before proceeding. I aim to give students the confidence to reason independently when the next problem takes an unfamiliar form.</p></section></div></div>`,'Teaching');

page('cv.html','Curriculum Vitae | Tejas Ramdas','Original August 2026 academic curriculum vitae of Tejas Ramdas.',`<section class="page-intro"><div class="container cv-intro"><div><p class="eyebrow">Curriculum vitae</p><h1>Tejas Ramdas</h1><p>August 2026</p></div><div>${link('assets/Tejas_Ramdas_Academic_CV_August_2026.pdf','Download CV','cv_download','download','button')}</div></div></section><section class="container cv-viewer" aria-label="Original curriculum vitae">${['Education, research interests, and management research papers','Statistics research, presentations, awards, and professional experience','Teaching assistant experience and references'].map((description,i)=>`<figure class="cv-page"><a href="assets/Tejas_Ramdas_Academic_CV_August_2026.pdf#page=${i+1}" aria-label="Open original CV at page ${i+1}" data-track="download_document" data-track-target="cv_page_${i+1}"><img src="assets/cv-original-page-${i+1}.png" width="1237" height="1600" alt="Original CV page ${i+1}: ${description}." loading="${i===0?'eager':'lazy'}"></a></figure>`).join('')}</section>`,'CV');

const profiles = [
  ['My Cornell website',cornellSite],
  ['Cornell Bowers','https://bowers.cornell.edu/people/tejas-ramdas'],
  ['Cornell Johnson doctoral program','https://www.johnson.cornell.edu/programs/phd-program/current-students/'],
  ['NBER','https://www.nber.org/people/rtejasonline'],
  ['LinkedIn','https://www.linkedin.com/in/tejas-ramdas-'],
  ['GitHub','https://github.com/tejasramdas'],
  ['ResearchGate','https://www.researchgate.net/scientific-contributions/Tejas-Ramdas-2292054360']
];
const directory = (items) => `<ul class="profile-directory">${items.map(([name,url])=>`<li><a href="${url}" data-track="click_external" data-track-target="${esc(name)}"><span>${esc(name)}</span>${icon('arrow')}</a></li>`).join('')}</ul>`;
page('profiles-and-papers.html','Profiles & Paper Links | Tejas Ramdas','Academic profiles and public paper links for Tejas Ramdas at Cornell, NBER, HBR, SSRN, and arXiv.',intro('Elsewhere','Profiles &amp; paper links')+`<div class="container reading"><h2>Academic &amp; professional profiles</h2>${directory(profiles)}<h2>Public papers &amp; writing</h2>${directory(papers.filter(p=>p.url).map(p=>[p.title+' | '+p.outlet,p.url]))}<div class="topic-list">${link('research.html','All research','','right')}${link('cv.html','Curriculum vitae','','right')}</div></div>`);

page('research-areas.html','Research Areas | Tejas Ramdas','Research on strategy, organization theory, technology and innovation, AI coordination, and statistical methods.',intro('Research areas','Strategy, organizations &amp; statistics',`<p class="lead">I study how firms compete as they pursue inventions after technological breakthroughs, and how information and interdependence shape collective outcomes.</p>`)+`<div class="container reading"><h2>Innovation and competitive search</h2><p>My management dissertation, <em>Competing in Inventive Space: Innovation Search, Generative Inventions, and Technological Rivalry</em>, develops two connected accounts of competition in inventive search. Search incursion explains movement toward inventive areas associated with other firms. Competitive shaping search examines how the first firm to build on a breakthrough can influence the paths available to firms that follow.</p>${link('generative-inventions.html','Generative Inventions and Search Incursions','research_area_gi','right')}<h2>Organization theory and AI collectives</h2><p>With ${linkedText('Michael W. Macy')}, I examine spontaneous coordination and common knowledge in groups of AI agents. The research studies the relationship among what agents know, what they expect others to do, and whether their independent choices produce a successful collective outcome.</p>${link('ai-collectives.html','Coordination in AI collectives','research_area_ai','right')}<h2>Statistical methods</h2><p>My statistics research, advised by ${linkedText('Martin T. Wells')}, develops methods in explainable AI, causal machine learning, and natural language processing. Applications include the influence of individual trades on model forecasts and the inheritance of language across constitutions.</p>${link('research.html#statistics','Statistics, finance and law','research_area_statistics','right')}<div class="topic-list"><a href="innovation.html">Innovation</a><a href="innovation-search.html">Innovation search</a><a href="technology-strategy.html">Technology strategy</a><a href="search-incursions.html">Search incursions</a></div></div>`,'Research');

// Preserve established topic URLs while connecting them to the current research.
const topics = [
  ['innovation','Innovation','How do technological breakthroughs change competition?', 'Some inventions alter the possibilities for subsequent invention. My research examines how firms use these breakthroughs to enter new areas of inventive activity and how early derivative inventions can affect later search by other firms.', 'generative-inventions'],
  ['innovation-search','Innovation search','How firms choose where and how to invent', 'Firms search by selecting knowledge elements and establishing linkages among them. My work examines the direction of that search, the knowledge positions from which firms begin, and how early search choices change opportunities for subsequent invention.', 'shaping-the-search-landscape'],
  ['technology-strategy','Technology strategy','Competition over the possibilities for invention', 'My research connects innovation search to competitive strategy. Generative inventions can change which knowledge combinations become feasible and which earlier technological advantages remain defensible. I study how firms respond through their inventive activity.', 'shaping-the-search-landscape'],
  ['search-incursions','Search incursions','Inventive movement toward other firms\' areas of strength', 'A search incursion moves beyond a firm\'s own prior inventive activity and toward knowledge elements more closely associated with other firms\' earlier work. The concept identifies competitive movement in inventive space before downstream product-market rivalry.', 'generative-inventions'],
  ['technological-proximity','Technological proximity','Related knowledge, adoption, and exposure to change', 'Technological proximity can help a firm recognize and use a generative invention. High proximity may also mean that adoption implicates more of the firm\'s existing knowledge, products, and commitments. My job-market paper examines these opposing effects on search incursion.', 'generative-inventions'],
  ['follow-on-inventive-activity','Follow-on inventive activity','What happens after a generative invention?', 'I study which firms build on a breakthrough, where their subsequent invention is directed, and when other firms follow. These questions connect a firm\'s prior knowledge to the competitive consequences of technological change.', 'shaping-the-search-landscape'],
  ['sequential-entry','Sequential search','The timing of follow-on invention', 'My current work on search timing appears in Shaping the Search Landscape. It examines how the first external searcher\'s pre-existing knowledge relationships are associated with the timing of subsequent search by other firms around the same generative invention.', 'shaping-the-search-landscape'],
  ['enabling-technologies','Enabling technologies','New combinations of knowledge', 'Technological breakthroughs can enable firms to pursue combinations that were previously infeasible. My work focuses on generative inventions and the ways their derivative inventions reshape possibilities for further inventive search.', 'generative-inventions']
];
for (const [slug,title,heading,body,paperId] of topics) {
  const p = papers.find(x=>x.id===paperId);
  page(slug+'.html',title+' | Tejas Ramdas',body,intro('Research topic',title)+`<article class="container reading"><h2>${esc(heading)}</h2><p class="lead">${esc(body)}</p><h2>Related research</h2>${paperRow(p)}<div class="topic-list">${link('research.html','All research','','right')}${link('research-areas.html','Research areas','','right')}</div></article>`,'Research');
}

page('privacy.html','Privacy | Tejas Ramdas','Privacy notice for Tejas Ramdas\' academic website.',intro('Privacy','Privacy notice')+`<div class="container reading"><p>This site uses basic analytics to understand visits and interactions with academic work. Analytics may record page views, paper-interest clicks, contact clicks, referrers, device/browser information, approximate location metadata, IP address, and a first-party visitor ID cookie used to distinguish repeat visits.</p><p>The analytics are used to understand which research areas and pages are drawing attention and to improve the site. The site does not require visitors to log in and does not sell analytics data.</p><p>If you prefer not to be included in site analytics, you can block cookies and analytics requests in your browser or contact <a href="mailto:tr336@cornell.edu">tr336@cornell.edu</a>.</p></div>`);

writeFileSync(join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageNames.map(file=>`  <url><loc>${base}/${file==='index.html'?'':file}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${pageNames.length} static pages.`);
