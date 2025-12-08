#!/bin/bash


# NEVER EVER TESTED,
# VIBE CODED


# Configuration
EXTENSION_NAME="tab-lister"
ZIP_FILE="dist/$EXTENSION_NAME.zip"
CRX_FILE="dist/$EXTENSION_NAME.crx"
KEY_FILE="key.pem"
FILES="manifest.json background.js tabs.html tabs.js"

# Ensure dist directory exists
mkdir -p dist

# Create Zip
echo "Creating zip package..."
rm -f "$ZIP_FILE"
zip -r "$ZIP_FILE" $FILES

# Generate private key if it doesn't exist
if [ ! -f "$KEY_FILE" ]; then
	echo "Generating private key..."
	openssl genrsa -out "$KEY_FILE" 2048
fi

# Create CRX (v2 format)
echo "Creating CRX package..."

# Calculate signatures and keys
openssl sha1 -sign "$KEY_FILE" "$ZIP_FILE" > "$ZIP_FILE.sig"
openssl rsa -in "$KEY_FILE" -pubout -outform DER > "$KEY_FILE.pub"

pub_len=$(stat -c%s "$KEY_FILE.pub")
sig_len=$(stat -c%s "$ZIP_FILE.sig")

# Write Header
# Magic: Cr24
printf "Cr24" > "$CRX_FILE"
# Version: 2 (0x02 0x00 0x00 0x00)
printf "\x02\x00\x00\x00" >> "$CRX_FILE"

# Public Key Length (Little Endian)
printf "$(printf '\\x%02x\\x%02x\\x%02x\\x%02x' $((pub_len&255)) $((pub_len>>8&255)) $((pub_len>>16&255)) $((pub_len>>24&255)))" >> "$CRX_FILE"

# Signature Length (Little Endian)
printf "$(printf '\\x%02x\\x%02x\\x%02x\\x%02x' $((sig_len&255)) $((sig_len>>8&255)) $((sig_len>>16&255)) $((sig_len>>24&255)))" >> "$CRX_FILE"

# Append Public Key, Signature, and Zip content
cat "$KEY_FILE.pub" "$ZIP_FILE.sig" "$ZIP_FILE" >> "$CRX_FILE"

# Cleanup temporary files
rm "$ZIP_FILE.sig" "$KEY_FILE.pub"

echo "Build complete!"
echo "Zip: $ZIP_FILE"
echo "CRX: $CRX_FILE"
