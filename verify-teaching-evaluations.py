"""Verify complete review coverage, numerical summaries, and PDF integrity."""

from pathlib import Path
import hashlib
import json
import re

from bs4 import BeautifulSoup
from pypdf import PdfReader


root = Path(__file__).resolve().parent
data = json.loads((root / 'teaching-evaluations.json').read_text())
pdf = root / 'assets' / data['document']
assert hashlib.sha256(pdf.read_bytes()).hexdigest() == data['documentSha256']
reader = PdfReader(pdf)
assert len(reader.pages) == 13
assert sum(section['forms'] for section in data['sections']) == 32
assert sum(section['enrolled'] for section in data['sections']) == 77
full = BeautifulSoup((root / 'teaching-evaluations.html').read_text(encoding='utf-8'), 'html.parser')
teaching = BeautifulSoup((root / 'teaching.html').read_text(encoding='utf-8'), 'html.parser')
assert not teaching.select('.evaluation .score')
assert teaching.find('a', href='teaching-evaluations.html')
assert len(full.select('.evaluation-table tbody tr')) == 20
assert len(full.select('.evaluation-reviews li')) == 37
expected_means = ['4.77', '4.90', '4.84', '4.67']
expected_counts = [31, 31, 32, 30]
for index, metric in enumerate(data['metrics']):
    frequencies = [sum(s['ratings'][metric['id']]['counts'][i] for s in data['sections']) for i in range(5)]
    n = sum(frequencies)
    points = sum((i + 1) * count for i, count in enumerate(frequencies))
    assert f'{points / n:.2f}' == expected_means[index]
    assert n == expected_counts[index]
    for soup in (full, teaching):
        row = soup.select('.evaluation-table tbody tr')[index]
        assert [cell.get_text(strip=True) for cell in row.select('td')] == [expected_means[index], str(n)]
for section in data['sections']:
    rendered = full.find(id=section['id'])
    assert [p.get_text() for p in rendered.select('.evaluation-reviews p')] == section['comments'] + section['recommendations']
    original_text = ' '.join(reader.pages[page].extract_text() for page in range(section['pdfPage'] - 1, section['pdfPage'] + 2))
    normalized = re.sub(r'\s+', ' ', original_text)
    for review in section['comments'] + section['recommendations']:
        assert review in normalized
    for row, metric in zip(rendered.select('.evaluation-table tbody tr'), data['metrics']):
        rating = section['ratings'][metric['id']]
        assert [cell.get_text(strip=True) for cell in row.select('td')] == [rating['mean'], str(rating['responses'])]
assert full.find('a', href='assets/' + data['document'])
assert full.find('a', href='teaching.html')
assert 'It was very bland.' in full.get_text()
assert 'I could not reccomend Tejas more highly.' in full.get_text()
print(json.dumps({'sections': 4, 'writtenResponses': 37, 'sectionRatingItems': 16, 'pooledMeans': expected_means, 'pooledResponseCounts': expected_counts, 'originalPdfPages': 13, 'sourceIntegrity': 'pass'}))
