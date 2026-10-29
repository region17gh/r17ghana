# Architecture rules

- The join story uses an opaque fixed masthead and one inverse logo, so scrolling content cannot undermine header readability.
- Buttons come from `@/components/ui/Button`, which composes the design system's Button and adds the rest shadow. The library's Button is vendor code and stays unedited; the shadow rides as a class (`r17-lift`) so `:focus-visible`'s box-shadow focus ring still wins, and its colour derives from `--overlay-modal` because the system's navy-tinted shadows composite invisibly on navy bands.