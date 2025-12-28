# Test Matrix for QA Audit

## Languages/Locales
| Code | Name | Direction | Notes |
|------|------|-----------|-------|
| en | English | LTR | Default language |
| de | German | LTR | Includes German translations |
| fa | Persian/Farsi | RTL | Right-to-left layout |

## Viewports
| Name | Width | Height | Notes |
|------|-------|--------|-------|
| Desktop | 1440 | 900 | Standard desktop |
| Tablet | 768 | 1024 | iPad-like portrait |
| Mobile | 390 | 844 | iPhone 14 Pro-like |

## Pages/Routes
| Route | Description | Parameters |
|-------|-------------|------------|
| / | Main CV page | ?lang=en/de/fa |

*Note: Single Page Application - no additional routes detected*

## Sections to Test
1. Header/Navigation
2. Hero Section (with avatar, name, roles)
3. Enhanced UI Demo
4. Basics Section (About Me)
5. Profiles Section (Social Links)
6. Education Section
7. Experiences Section
8. Projects Section
9. Publications Section
10. Languages Section
11. Workshop & Certifications Section
12. Skills Section
13. Skills Visualization Dashboard
14. Testimonials Section
15. Articles Section
16. References Section
17. Contact Section
18. Footer

## States to Test
| State | Description |
|-------|-------------|
| Initial Load | Page load with default state |
| After Language Switch | Content updated for new language |
| Mobile Menu Open | Hamburger menu expanded |
| Theme Toggle | Dark/Light mode (if available) |
| Scroll States | Header behavior on scroll |

## Test Combinations
Total combinations: 3 languages × 3 viewports × 18 sections = 162 section screenshots
Plus: 3 languages × 3 viewports × full-page = 9 full-page screenshots

## Functional Checks
- [ ] Language switching works correctly
- [ ] No "undefined" or "null" strings visible
- [ ] No "[object Object]" text
- [ ] RTL layout correct for Persian
- [ ] All sections have content
- [ ] Console has no critical errors
- [ ] Images load correctly
- [ ] External links have correct attributes
