#!/usr/bin/env bash
# Cleanup old logs while keeping recent context
# Rotates gba-portal/dev-server.log and memory/next-dev.log

MAX_LINES=5000

truncate_log() {
    local file=$1
    if [ -f "$file" ]; then
        echo "Truncating $file to last $MAX_LINES lines..."
        tail -n "$MAX_LINES" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
}

truncate_log "gba-portal/dev-server.log"
truncate_log "memory/next-dev.log"
