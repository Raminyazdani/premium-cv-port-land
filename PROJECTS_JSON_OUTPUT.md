# Projects Section - JSON Output

This document contains the normalized and deduplicated JSON output for the Projects section of the CV website.

## Normalization Applied

1. **Deduplication**: Removed one duplicate "Cosmetic Shop Marketplace Template (Django)" entry
2. **URL Field**: All projects have `url` field (set to `null` when missing)
3. **Type Keys**: Preserved as-is from source data
4. **Order**: Maintained original order from source

## JSON Output

```json
{
  "projects": [
    {
      "title": "Integrated Omics Pipeline for Microbial Genomics",
      "description": "Developed a comprehensive pipeline integrating metagenomic, transcriptomic, and proteomic data for functional gene analysis and microbial community profiling.",
      "url": null,
      "type_key": [
        "Full CV",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "Policy Compliance Checker (Flask + React + SQLite)",
      "description": "Built a FReMP stack web application to upload dynamic security policies and user datasets (JSON/CSV), evaluate per-user compliance server-side, and present filterable/exportable pass/fail results with explanations in a React UI.",
      "url": "https://github.com/Raminyazdani/policy-compliance-checker",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Cosmetic Shop Marketplace Template (Django)",
      "description": "Built a multi-app Django 4.1 marketplace template for a cosmetics shop with a reusable Core layer (centralized field factories, base models with soft-delete, shared mixins, and a custom app scaffolding command), plus product catalog listing/search/filtering, cart & checkout flow, and order/payment/shipment models rendered with Bootstrap templates on SQLite.",
      "url": "https://github.com/Raminyazdani/Cosmetic_Shop",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Maktab 78 File Store (Framework-less Python + PostgreSQL)",
      "description": "Developed an educational, framework-less Python project featuring a nested CLI router/menu system with dynamic callbacks, a lightweight PostgreSQL persistence layer (psycopg2) with small ORM-like models and query builders for CRUD, and domain modules for users, files, comments, carts, and order items.",
      "url": "https://github.com/Raminyazdani/m78bookstore",
      "type_key": [
        "Full CV",
        "Programming",
        "Student Projects"
      ]
    },
    {
      "title": "Python Bootcamp Portfolio — Maktab 78 Assignments & Projects",
      "description": "Compiled and documented a monorepo of Python Bootcamp coursework and projects, organized by homework modules (fundamentals, OOP, system scripting, data validation, databases with PostgreSQL/MongoDB, and Flask REST APIs), including multiple major subprojects in a single structured repository.",
      "url": "https://github.com/Raminyazdani/HW_all_maktab-78",
      "type_key": [
        "Full CV",
        "Programming",
        "Student Projects"
      ]
    },
    {
      "title": "IranDoc Ganj Research Paper & Thesis Scraper (Selenium + BeautifulSoup)",
      "description": "Developed a Python web-scraping tool using Selenium and BeautifulSoup to crawl ganj.irandoc.ac.ir year-by-year (and page-by-page when needed), extract thesis/paper metadata (e.g., subject, type, course, year, university, contributors) with UTF-8 Persian support, and export the results to CSV with an additional CSV cleaning utility.",
      "url": "https://github.com/Raminyazdani/irandoc",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Personal CV Website (Django + React)",
      "description": "Built a personal CV website with a React single-page frontend and a Django backend for data storage and API services, showcasing skills, projects, and professional experience in a web format.",
      "url": "https://github.com/Raminyazdani/My-CV-Website",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Movie/TV Discovery & Personalization App (React + Express + MySQL)",
      "description": "Built a full-stack movie/TV discovery and personalization monorepo with a React client (Redux Toolkit, Material UI) and an Express server backed by MySQL, integrating Firebase Auth and OMDb/TMDb metadata APIs to support per-user favorites, ratings, reviews, and recommendation requests via a REST API.",
      "url": "https://github.com/Raminyazdani/movie-rating-app",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Hospital Database Management System (MySQL + SQL)",
      "description": "Developed a MySQL hospital database schema for managing patients, doctors, services, departments, surgeries, and visits, providing SQL scripts to create tables, insert sample records, and generate multiple report views, alongside an ERD for documentation.",
      "url": "https://github.com/Raminyazdani/Hospital-Data-base",
      "type_key": [
        "Full CV",
        "Programming",
        "Student Projects"
      ]
    },
    {
      "title": "Terminal Calculator (TUI) — Python",
      "description": "Developed a Python 3.10 terminal calculator (TUI) with safe expression evaluation, command history (view/replay), and light/dark theming using Rich + prompt_toolkit, packaged as a CLI with pytest tests and GitHub Pages documentation.",
      "url": "https://github.com/Raminyazdani/Calculator",
      "type_key": [
        "Full CV",
        "Programming",
        "Student Projects"
      ]
    },
    {
      "title": "CV Generator — JSON → Awesome-CV PDF (Jinja2 + XeLaTeX)",
      "description": "Developed a Python-based CV generator that renders structured JSON into modular Jinja2+LaTeX section templates using the Awesome-CV class, then compiles polished PDFs via XeLaTeX with multi-CV batch support, optional profile photos, StrictUndefined validation, LaTeX-escaping helpers, and reliable intermediate-file cleanup.",
      "url": "https://github.com/Raminyazdani/cv_generator",
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Python Projects Roadmap (Ongoing)",
      "description": "Maintaining an ongoing curated roadmap of ~100 Python project ideas categorized by difficulty (Beginner/Intermediate/Advanced) to guide consistent practice and portfolio-building, alongside repository utilities (e.g., create_projects.py).",
      "url": "https://github.com/Raminyazdani/Python-projects",
      "type_key": [
        "Full CV",
        "Programming",
        "Student Projects"
      ]
    },
    {
      "title": "Single-Cell & Spatial Transcriptomics Workflow",
      "description": "Implemented analysis workflows for single-cell RNA-seq and spatial transcriptomics data, enabling cell type identification and trajectory inference.",
      "url": null,
      "type_key": [
        "Full CV",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "Bioprocess Optimization for Protein Production",
      "description": "Optimized fed-batch fermentation processes for heterologous protein expression in Pichia pastoris, including pathway engineering and bioreactor management.",
      "url": null,
      "type_key": [
        "Full CV",
        "Biotechnology",
        "Academic"
      ]
    },
    {
      "title": "Automation & Web Data Extraction Solutions",
      "description": "Designed and deployed Python-based web crawlers and automation scripts for data extraction, cleaning, and processing from diverse online sources.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Full-Stack Web Application for Data Visualization",
      "description": "Built interactive dashboards and visualization tools using Django, React, and Plotly for scientific data representation and reporting.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Machine Learning Applications in Bioinformatics",
      "description": "Developed predictive models and clustering algorithms for biological data analysis, focusing on gene expression and classification tasks.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "Containerized Bioinformatics Workflows",
      "description": "Deployed reproducible bioinformatics pipelines using Docker and Kubernetes for scalable and collaborative research environments.",
      "url": null,
      "type_key": [
        "Full CV",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "CI/CD Pipeline Implementation for Web Applications",
      "description": "Configured and automated continuous integration and deployment pipelines using GitLab CI/CD and Docker for web applications, ensuring robust delivery workflows.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Backend API Development for Data-Driven Applications",
      "description": "Designed RESTful APIs with Django Rest Framework and FastAPI to serve as backends for data-driven applications, focusing on performance and scalability.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Real-Time Data Visualization Dashboard",
      "description": "Developed a real-time dashboard for monitoring and visualizing streaming data using React, WebSockets, and Plotly for interactive user experience.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Bioinformatics",
        "Biotechnology",
        "Academic"
      ]
    },
    {
      "title": "Full-Stack E-commerce Web Platform",
      "description": "Built a scalable e-commerce platform integrating user management, product catalogs, and payment systems using Django, React, and PostgreSQL.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Linux System Automation & Monitoring Scripts",
      "description": "Created Bash and Python scripts for automating server maintenance tasks, log management, and resource monitoring on Linux-based systems.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Bioinformatics",
        "Academic"
      ]
    },
    {
      "title": "Cloud-Based Microservices Deployment",
      "description": "Implemented microservices architecture and deployed containerized services on cloud infrastructure using Docker and Kubernetes.",
      "url": null,
      "type_key": [
        "Full CV",
        "Programming",
        "Academic"
      ]
    },
    {
      "title": "Robotics & Embedded Systems Developer — High School & Personal Projects (2011–2015)",
      "description": "Microcontroller programming and robot development for student competitions; designed and built embedded robotics systems and control logic.",
      "url": null,
      "type_key": [
        "Full CV",
        "Robotics",
        "Embedded Systems",
        "Student Projects"
      ]
    }
  ]
}
```

## Summary

- **Total Projects in Source**: 26 (with 1 duplicate)
- **Unique Projects**: 25
- **Projects with URLs**: 12
- **Projects without URLs**: 13
- **Domains Represented**: Programming, Bioinformatics, Biotechnology, Academic, Student Projects, Robotics, Embedded Systems
