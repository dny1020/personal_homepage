#!/bin/bash
# Script para convertir .env multilínea a formato Docker compatible (una línea)

INPUT_FILE="${1:-backend/.env}"
OUTPUT_FILE="${2:-backend/.env.docker}"

echo "🔄 Converting $INPUT_FILE to Docker-compatible format..."

# Leer el archivo y procesar
python3 << 'PYTHON_SCRIPT'
import sys
import re

input_file = sys.argv[1] if len(sys.argv) > 1 else "backend/.env"
output_file = sys.argv[2] if len(sys.argv) > 2 else "backend/.env.docker"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Regex para encontrar variables con valores multilínea entre comillas simples
pattern = r"^([A-Z_]+)='(.*?)'$"
matches = list(re.finditer(pattern, content, re.MULTILINE | re.DOTALL))

result = content

# Procesar cada match en orden inverso para no afectar las posiciones
for match in reversed(matches):
    var_name = match.group(1)
    var_value = match.group(2)
    
    # Reemplazar saltos de línea y espacios extras en JSON
    var_value_oneline = ' '.join(var_value.split())
    
    # Crear la nueva línea
    new_line = f'{var_name}=\'{var_value_oneline}\''
    
    # Reemplazar en el contenido
    result = result[:match.start()] + new_line + result[match.end():]

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(result)

print(f"✅ Converted file saved to: {output_file}")
print(f"📋 Lines in original: {len(content.splitlines())}")
print(f"📋 Lines in output: {len(result.splitlines())}")

PYTHON_SCRIPT

if [ -f "$OUTPUT_FILE" ]; then
    echo ""
    echo "✅ Conversion complete!"
    echo "📄 Output file: $OUTPUT_FILE"
    echo ""
    echo "To use it, run:"
    echo "  cp $OUTPUT_FILE backend/.env"
    echo "  docker compose down && docker compose up -d"
fi
