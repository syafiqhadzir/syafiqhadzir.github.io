# API Reference

Documentation for Eleventy filters, shortcodes, and transforms.

## Filters

### `dateFormat`

Format a date for display.

```nunjucks
{{ page.date | dateFormat }}
<!-- Output: December 24, 2025 -->

{{ page.date | dateFormat("short") }}
<!-- Output: Dec 24, 2025 -->
```

**Parameters:**

- `format` (optional): `"long"` (default), `"short"`, `"iso"`

---

### `isoDate`

Format a date as ISO 8601 string.

```nunjucks
{{ page.date | isoDate }}
<!-- Output: 2025-12-24T00:00:00.000Z -->
```

---

### `relativeDate`

Format a date relative to now.

```nunjucks
{{ page.date | relativeDate }}
<!-- Output: 2 days ago -->
```

---

### `readingTime`

Calculate reading time for content.

```nunjucks
{{ content | readingTime }}
<!-- Output: 5 min read -->
```

**Options:**

- Words per minute: 200 (default)

---

### `wordCount`

Count words in content.

```nunjucks
{{ content | wordCount }}
<!-- Output: 1234 -->
```

---

## Shortcodes

### `ampImg`

Generate an AMP-compliant responsive image.

```nunjucks
{% ampImg {
  src: "/images/photo.jpg",
  alt: "Description",
  width: 800,
  height: 600,
  layout: "responsive"
} %}
```

**Parameters:**

| Param    | Type   | Required | Default        | Description      |
| -------- | ------ | -------- | -------------- | ---------------- |
| `src`    | string | Yes      | -              | Image source URL |
| `alt`    | string | Yes      | -              | Alt text         |
| `width`  | number | Yes      | -              | Image width      |
| `height` | number | Yes      | -              | Image height     |
| `layout` | string | No       | `"responsive"` | AMP layout type  |

**Layouts:**

- `responsive` - Scales with container
- `fixed` - Fixed dimensions
- `fill` - Fills parent container
- `intrinsic` - Scales down only

---

## Transforms

### `cssGuard`

Validates that inline CSS doesn't exceed AMP's 75KB limit.

**Usage:** Automatically applied to all HTML output.

**Behavior:**

- Throws error if CSS exceeds 75KB
- Logs CSS size in development

---

### `htmlMinify`

Minifies HTML output for production.

**Options:**

- Removes comments
- Collapses whitespace
- Minifies inline CSS/JS
- Preserves AMP boilerplate

---

## Data Files

### `site.json`

Global site metadata in `src/_data/site.json`:

```json
{
  "title": "Syafiq Hadzir",
  "description": "Software QA Engineer",
  "url": "https://syafiqhadzir.dev",
  "author": {
    "name": "Syafiq Hadzir",
    "email": "syafiqhadzir@live.com.my"
  }
}
```

Access in templates:

```nunjucks
{{ site.title }}
{{ site.author.name }}
```
