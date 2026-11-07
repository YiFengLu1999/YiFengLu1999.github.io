# Publishing bilingual notes

New posts dated 2026-11-03 or later must include complete English and Chinese versions. Existing earlier posts retain their original language.

Keep Chinese Markdown in `_posts/YYYY-MM-DD-slug.md`. Put the complete English translation (including sources, captions and formulas) in `_includes/translations/slug-en.md`.

Required front matter:

```yaml
layout: post
bilingual: true
translation_en: translations/slug-en.md
title: 中文标题
title_en: English title
subtitle: 中文副标题
subtitle_en: English subtitle
```

The post layout shows English first. English / 中文 buttons switch the content and title. `?lang=zh` links directly to Chinese; an ordinary fresh visit always opens English.

For the Ilya archive, add the item to `_data/ilya.json` and set `ilya_id` on its post to the matching item ID. Set `ilya_type: lecture` or `ilya_type: paper`. Published progress is derived from matching posts, not manually entered counters. Do not count citations as dedicated notes. Keep stable IDs and source URLs, and preserve the distinction between the 27-item circulating archive and a verified personal recommendation.

Run `python3 scripts/check_bilingual.py` before publishing. The script checks metadata and existence of English text; editorial review must still check translation completeness.

## Ilya question notebook

Maintain `_data/ilya_questions.json` for `/ilya/questions/`. Each entry needs both languages, a stable ID, an exact bilingual source-note anchor, attribution (talk question / conjecture / our reformulation), a narrowly scoped remaining question, and dated research references. Never infer that a problem remains universally unsolved from an old talk alone. Distinguish later research from Ilya’s own recommendations. Update the reviewed date only after checking sources. Add independent source-note mappings if the notebook expands beyond the current talk.
