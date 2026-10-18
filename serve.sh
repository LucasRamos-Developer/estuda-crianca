#!/usr/bin/env bash
# Sobe o app na rede local para abrir no celular, tablet ou outro computador.
# Uso: ./serve.sh [porta]   (padrão: 8080)
set -e
PORT="${1:-8080}"
cd "$(dirname "$0")"

IPS=$(hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || true)
echo ""
echo "  Tabuada rodando! Abra em qualquer aparelho da mesma rede Wi-Fi:"
echo ""
echo "    Neste computador:  http://localhost:${PORT}"
MAIN=""
for ip in $IPS; do
  case "$ip" in *:*|172.17.*|10.0.3.*) ;; *) MAIN="$ip"; break ;; esac
done
[ -n "$MAIN" ] && echo "    Na rede (celular): http://${MAIN}:${PORT}"
echo ""
echo "  Para parar: Ctrl+C"
echo ""
exec python3 -m http.server "$PORT" --bind 0.0.0.0
