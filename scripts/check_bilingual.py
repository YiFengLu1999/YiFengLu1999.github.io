"""Require complete bilingual metadata for posts from 2026-11-03 onward."""
from pathlib import Path
import re
errors=[]
for p in Path('_posts').glob('*.md'):
    if p.name[:10] < '2026-11-03':
        continue
    front=p.read_text().split('---',2)[1]
    fields=dict(re.findall(r'^([a-z_]+):\s*(.+)$',front,re.M))
    for key in ('bilingual','translation_en','title_en','subtitle_en'):
        if not fields.get(key): errors.append(f'{p}: missing {key}')
    if fields.get('bilingual')!='true': errors.append(f'{p}: bilingual must be true')
    target=Path('_includes')/fields.get('translation_en','MISSING')
    if not target.is_file() or not target.read_text().strip(): errors.append(f'{p}: missing English content')
if errors: raise SystemExit('\n'.join(errors))
print('Bilingual post checks passed.')
