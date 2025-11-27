#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_code_blocks(file_path):
    """Fix code blocks that have broken closing tags"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Pattern: <code>{" ... "} followed by whitespace and }</code>
    # Replace with: <code>{" ... "}</code>
    pattern = r'(<code>\{"[^"]*"\})\s*\n\s*\n\s*\n?\s*\n?\s*\n?\s*\n?\s*\n?\s*\n?\s*(}</code>)'
    content = re.sub(pattern, r'\1\2', content)
    
    # Also handle single newline cases
    pattern2 = r'(<code>\{"[^"]*"\})\s*\n\s*(}</code>)'
    content = re.sub(pattern2, r'\1\2', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed: {file_path}")
        return True
    return False

def main():
    print("🔧 Fixing code blocks in docs...")
    
    docs_path = Path("/Users/manwook-han/Desktop/i18nexus-turborepo/apps/demo/app/docs")
    fixed_count = 0
    
    for tsx_file in docs_path.rglob("*.tsx"):
        if fix_code_blocks(tsx_file):
            fixed_count += 1
    
    print(f"✅ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()

