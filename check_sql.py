import re, subprocess

# Get actual table columns from DB
result = subprocess.run(
    ['C:/xampp/mysql/bin/mysql.exe', '-u', 'root', '-N', '-e',
     "SELECT TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY ORDINAL_POSITION) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='aethion_db' GROUP BY TABLE_NAME"],
    capture_output=True, text=True
)

actual_cols = {}
for line in result.stdout.strip().split('\n'):
    parts = line.split('\t')
    if len(parts) == 2:
        actual_cols[parts[0]] = parts[1].split(',')

# Parse SQL file INSERT statements
with open('seed_data.sql', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

errors = []
for i, line in enumerate(lines, 1):
    if line.startswith('INSERT INTO'):
        match = re.search(r'INSERT INTO `(\w+)` \(([^)]+)\) VALUES', line)
        if match:
            table = match.group(1)
            if table in actual_cols:
                sql_cols = [c.strip().strip('`') for c in match.group(2).split(',')]
                missing = [c for c in sql_cols if c not in actual_cols[table]]
                if missing:
                    errors.append(f'Line {i}: {table} - UNKNOWN columns: {missing}')
                    
                # Also check value count vs column count
                if i < len(lines):
                    val_line = lines[i]
                    # Quick: count commas at depth 1
                    vals = []
                    current = ''
                    depth = 0
                    in_str = False
                    for ch in val_line:
                        if ch == "'":
                            in_str = not in_str
                        if not in_str:
                            if ch == '(':
                                depth += 1
                            elif ch == ')':
                                depth -= 1
                        if ch == ',' and depth == 1 and not in_str:
                            vals.append(current.strip())
                            current = ''
                        elif depth >= 1:
                            current += ch
                    if current.strip():
                        vals.append(current.strip())
                    
                    if len(vals) > 0 and len(vals) != len(sql_cols):
                        errors.append(f'Line {i}: {table} - cols={len(sql_cols)}, vals={len(vals)}')

if errors:
    print('ERRORS:')
    for e in errors:
        print(f'  {e}')
else:
    print('ALL CHECKS PASSED - no mismatches found')
