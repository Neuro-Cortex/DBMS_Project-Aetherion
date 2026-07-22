import re, os

services_dir = 'src/services'
for fname in sorted(os.listdir(services_dir)):
    if not fname.endswith('.ts'):
        continue
    fpath = os.path.join(services_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    has_mock = bool(re.search(r'mock|Mock|MOCK|simulateDelay', content))
    uses_api = 'api.get' in content or 'api.post' in content or 'api.put' in content or 'api.delete' in content or 'api.patch' in content
    has_todo = bool(re.search(r'TODO.*real|TODO.*Uncomment|TODO.*api', content, re.IGNORECASE))
    lines = content.count('\n')
    
    tags = []
    if has_mock: tags.append('MOCK')
    if uses_api: tags.append('REAL-API')
    if has_todo: tags.append('TODO')
    
    tag_str = ' | '.join(tags) if tags else 'CLEAN'
    print(f'{fname:30s} {lines:5d}L  {tag_str}')
