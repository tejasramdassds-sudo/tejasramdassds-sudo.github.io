// Official profiles and personal sites verified in September 2026.
// Leave ambiguous coauthor initials unlinked until their identities are confirmed.
const huang = 'https://www.law.ntu.edu.tw/index.php/full-time-professor/itemlist/user/941-chung-chia-huang';
export const peopleLinks = new Map([
  ['Gautam Ahuja', 'https://business.cornell.edu/profiles/ga337/'],
  ['Michael W. Macy', 'https://sociology.cornell.edu/michael-macy'],
  ['Martin T. Wells', 'https://stat.cornell.edu/people/martin-t-wells'],
  ['Patrick Huang', huang],
  ['C. Huang', huang],
  ['Nuno Garoupa', 'https://www.law.gmu.edu/directory/profiles/garoupa_nuno'],
  ['Yun-chien Chang', 'https://www.lawschool.cornell.edu/faculty-research/faculty-directory/yun-chien-chang/'],
  ['Tom Ginsburg', 'https://www.law.uchicago.edu/faculty/ginsburg-t'],
  ['Wesley D. Sine', 'https://business.cornell.edu/profiles/wds4/'],
  ['Stephen Hansen', 'https://sekhansen.github.io/'],
  ['Raffaella Sadun', 'https://www.hbs.edu/about/leadership/raffaella-sadun'],
  ['Joseph Fuller', 'https://www.hbs.edu/competitiveness/faculty/Pages/faculty-profile-details.aspx?profile=jfuller'],
  ['Nicholas Bloom', 'https://nbloom.people.stanford.edu/']
]);

export const institutionLinks = new Map([
  ['Cornell University', 'https://www.cornell.edu/'],
  ['S.C. Johnson College of Business', 'https://business.cornell.edu/'],
  ['Statistics and Data Science', 'https://stat.cornell.edu/'],
  ['Cornell Tech', 'https://tech.cornell.edu/'],
  ['HBS', 'https://www.hbs.edu/'],
  ['Morgan Stanley', 'https://www.morganstanley.com/']
]);

export const footerGroups = [
  ['Cornell', [
    ['Cornell University', institutionLinks.get('Cornell University')],
    ['SC Johnson College of Business', institutionLinks.get('S.C. Johnson College of Business')],
    ['Statistics & Data Science', institutionLinks.get('Statistics and Data Science')],
    ['Department of Economics', 'https://economics.cornell.edu/'],
    ['Cornell Law School', 'https://www.lawschool.cornell.edu/']
  ]],
  ['Faculty & research groups', [
    ['Management & Organizations', 'https://business.cornell.edu/expertise/faculty-areas/management-organizations/'],
    ['Strategy & Business Economics', 'https://business.cornell.edu/expertise/faculty-areas/strategy-business-economics/'],
    ['Statistics faculty directory', 'https://stat.cornell.edu/directory'],
    ['Sociology faculty', 'https://sociology.cornell.edu/faculty']
  ]],
  ['Management journals', [
    ['Strategic Management Journal', 'https://onlinelibrary.wiley.com/journal/10970266'],
    ['Academy of Management Journal', 'https://www.aom.org/publications/journals/journal/'],
    ['Academy of Management Review', 'https://www.aom.org/publications/journals/review/'],
    ['Administrative Science Quarterly', 'https://journals.sagepub.com/home/asq'],
    ['Organization Science', 'https://pubsonline.informs.org/journal/orsc']
  ]],
  ['Economics journals', [
    ['American Economic Review', 'https://www.aeaweb.org/journals/aer'],
    ['Quarterly Journal of Economics', 'https://academic.oup.com/qje'],
    ['Journal of Political Economy', 'https://www.journals.uchicago.edu/toc/jpe/current'],
    ['Econometrica', 'https://www.econometricsociety.org/publications/econometrica'],
    ['Review of Economic Studies', 'https://academic.oup.com/restud']
  ]],
  ['Professional links', [
    ['Harvard Business School', institutionLinks.get('HBS')],
    ['HBS Strategy Unit', 'https://www.hbs.edu/faculty/units/strategy/Pages/default.aspx'],
    ['Morgan Stanley', institutionLinks.get('Morgan Stanley')]
  ]]
];
