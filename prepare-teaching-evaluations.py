"""Extract the complete evaluation record from the original Cornell reports."""

from argparse import ArgumentParser
from pathlib import Path
import hashlib
import json
import re
import shutil

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
parser = ArgumentParser()
parser.add_argument('packet', type=Path)
args = parser.parse_args()
specifications = [
    ('Fall 2020', '203', 9, 19, 'CourseEval-Fall_2020-MATH_1710-DIS_203.pdf'),
    ('Spring 2021', '201', 7, 20, 'CourseEval-Spring_2021-MATH_1710-DIS_201.pdf'),
    ('Spring 2021', '202', 9, 20, 'CourseEval-Spring_2021-MATH_1710-DIS_202.pdf'),
    ('Spring 2021', '203', 7, 18, 'CourseEval-Spring_2021-MATH_1710-DIS_203.pdf'),
]
metrics = [
    {'id': 'organization', 'label': 'Organization and clarity', 'question': 'Was the recitation organized and clear?', 'low': 'Disorganized and unclear', 'high': 'Very organized and lucid'},
    {'id': 'availability', 'label': 'Willingness and availability to help', 'question': 'Was the teaching assistant willing and available to help you overcome difficulties?', 'low': 'Was of no help', 'high': 'Was very helpful'},
    {'id': 'command', 'label': 'Command of the course material', 'question': "How would you rate your teaching assistant's command of the course material?", 'low': 'Poor command of material', 'high': 'Excellent command of material'},
    {'id': 'interaction', 'label': 'Educational quality of interactions', 'question': 'What was the overall quality of your interaction with the teaching assistant?', 'low': 'Low, taught me little', 'high': 'High, extremely educational'},
]


def comments(text):
    body = text.split('Cornell University')[0]
    markers = list(re.finditer(r'(?m)^\s*(\d{4,6})\.\s*', body))
    return [
        re.sub(r'\s+', ' ', body[marker.end():markers[i + 1].start() if i + 1 < len(markers) else len(body)]).strip()
        for i, marker in enumerate(markers)
    ]


sections = []
row_pattern = re.compile(r'^([1-5]\.\d{2})\s+([\d.]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$', re.MULTILINE)
combined = PdfReader(args.packet / 'Teaching_Evaluations_Tejas_Ramdas.pdf')
assert len(combined.pages) == 13
for index, (term, section, forms, enrolled, filename) in enumerate(specifications):
    reader = PdfReader(args.packet / filename)
    assert len(reader.pages) == 3
    texts = [page.extract_text() for page in reader.pages]
    for offset, text in enumerate(texts):
        assert re.sub(r'\s+', '', text) == re.sub(r'\s+', '', combined.pages[1 + 3 * index + offset].extract_text())
    assert f'{forms} Responses, {enrolled} Enrolled' in texts[0]
    matches = row_pattern.findall(texts[0])
    assert len(matches) == len(metrics), filename
    ratings = {}
    for metric, match in zip(metrics, matches):
        mean, deviation, count, *frequencies = match
        frequencies = list(map(int, frequencies))
        count = int(count)
        assert sum(frequencies) == count
        points = sum((value + 1) * number for value, number in enumerate(frequencies))
        assert abs(points / count - float(mean)) <= 0.00501
        ratings[metric['id']] = {'mean': mean, 'responses': count, 'counts': frequencies}
    sections.append({
        'id': term.lower().replace(' ', '-') + '-' + section,
        'term': term, 'section': section, 'forms': forms, 'enrolled': enrolled,
        'source': filename, 'pdfPage': 2 + 3 * index,
        'ratings': ratings, 'comments': comments(texts[1]), 'recommendations': comments(texts[2]),
    })

assert [len(s['comments']) for s in sections] == [6, 1, 7, 3]
assert [len(s['recommendations']) for s in sections] == [7, 3, 7, 3]
document = 'Teaching_Evaluations_Tejas_Ramdas.pdf'
shutil.copyfile(args.packet / document, ROOT / 'assets' / document)
digest = hashlib.sha256((args.packet / document).read_bytes()).hexdigest()
assert hashlib.sha256((ROOT / 'assets' / document).read_bytes()).hexdigest() == digest
data = {'course': 'MATH 1710 - Statistical Theory and Application', 'institution': 'Cornell University', 'role': 'Teaching assistant', 'document': document, 'documentSha256': digest, 'metrics': metrics, 'sections': sections}
(ROOT / 'teaching-evaluations.json').write_text(json.dumps(data, ensure_ascii=True, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'sections': len(sections), 'ratingItems': 16, 'writtenResponses': 37, 'pdfPages': 13, 'pdfSha256': digest}))
