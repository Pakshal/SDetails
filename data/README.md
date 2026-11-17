# Editing the directory

Only two files need routine updates. Use GitHub's pencil icon to edit, then **Commit changes… → Commit directly to main → Commit changes**. The public site updates automatically after the Publish directory workflow succeeds.

## Locations: sadhviji.json

The initial file is `[]` (an empty list). Replace it with entries such as the following, using real names and addresses:

```json
[
  {
    "name": "First Sadhviji name",
    "address": "First current address"
  },
  {
    "name": "Second Sadhviji name",
    "address": "Second current address"
  }
]
```

- **Edit:** replace the name or address inside double quotes.
- **Add:** insert another `{ "name": "…", "address": "…" }` before the closing `]`. Put a comma between entries.
- **Delete:** remove an entry's entire `{…}` block and adjust the comma. Use `[]` if none remain.
- Keep the exact keys `name` and `address`. Both values are required. Do not add other fields.
- Keep double quotes and brackets. No trailing comma after the final entry.
- Inside an address, type `\n` for a new line, `\"` for a double quote, or `\\` for a literal backslash.
- Gujarati, Hindi, and English text are supported.
- Maximum 500 entries; Name up to 160 characters; Address up to 2,000 characters.

If a check fails, the last successfully published site stays live. Open **Actions → Publish directory → failed run → validate** to read the error, then correct the file.

## Shared Suvichar: suvichar.txt

Replace its contents with plain text in any language. No JSON, quotation marks, or other formatting required. Line breaks are preserved. Maximum 4,000 characters. Leave the file empty to hide the Suvichar section.

Do not delete or rename these files. They contain public information, including publicly visible edit history.
