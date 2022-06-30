#!/usr/bin/env sh
set -e

JSON_URL="https://raw.githubusercontent.com/vvo/tzdb/main/time-zones-names.json"
OUT_DIR=$( dirname "$( readlink -f "$0" )" )

echo "fetching ${JSON_URL} to ${OUT_DIR}"
echo "export default " > "${OUT_DIR}/tz.js"
curl -sL "${JSON_URL}" >> "${OUT_DIR}/tz.js"

echo "done"
