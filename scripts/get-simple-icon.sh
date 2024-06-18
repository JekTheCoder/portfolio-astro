REMOTE_NAME="$1"
LOCAL_NAME="${2:-$REMOTE_NAME}"

LOCAL_FILE="./public/icons/$LOCAL_NAME.svg"

curl -o "public/icons/$LOCAL_NAME.svg" "https://simpleicons.org/icons/$REMOTE_NAME.svg"
awk '{sub(/viewBox/,"fill=\"currentColor\" viewBox")}1' "$LOCAL_FILE" > "$LOCAL_FILE.temp"
rm "$LOCAL_FILE"
mv "$LOCAL_FILE.temp" "$LOCAL_FILE"
