# Al-Hayat Kids Islam — Dynamic 3,000 Q/A Learning System

This update replaces the old static root pages with dynamic dashboard pages connected to the structured question bank.

## Replace these root files

- about.html
- curriculum.html
- age-3-4.html
- age-5-6.html
- age-7-8.html
- duas.html
- surahs.html
- islamic-manners.html
- prophet-stories.html
- arabic-letters.html
- prayer-basics.html
- ramadan-eid.html
- parents-corner.html
- safety-privacy.html
- contact.html
- privacy-policy.html
- terms.html
- faq.html
- sitemap.xml

## Replace these JS files

- assets/js/question-bank.js
- assets/js/filter-engine.js

## Important

Do not delete the question JSON files. These pages expect:

- assets/data/levels/levels.json
- assets/data/topics/topics.json
- assets/data/questions/questions-level-1.json
- assets/data/questions/questions-level-2.json
- assets/data/questions/questions-level-3.json
- assets/data/questions/questions-level-4.json
- assets/data/questions/questions-level-5.json

## Test after upload

Open:

- https://drimranhayat.github.io/al-hayat-kids-islam/curriculum.html
- https://drimranhayat.github.io/al-hayat-kids-islam/duas.html
- https://drimranhayat.github.io/al-hayat-kids-islam/prayer-basics.html
- https://drimranhayat.github.io/al-hayat-kids-islam/progress/

If a page says "Content could not load", one of the JSON files is missing, empty, or in the wrong path.

## Review note

The learning bank is child-friendly and structured, but Arabic, Qur'an-related wording, duas, fiqh wording, and religious explanations should be reviewed by a qualified Islamic teacher before final public release.
