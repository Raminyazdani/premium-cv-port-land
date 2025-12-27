# Workshops & Certifications Section — JSON Output

## Normalized Data

The following JSON represents the workshops and certifications section with proper normalization:
- Dates are kept in original format with invalid dates flagged
- All fields preserved from source data
- Structure maintained as array of issuer objects

```json
[
  {
    "issuer": "Tuf North Academy",
    "certifications": [
      {
        "name": "Microarray Data Analysis in R Software and Systems Biology",
        "date": "2020-09-31",
        "date_parse_error": true,
        "duration": "18 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_TUV_north_Academy_MicroArray_dspdq4.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Bioinformatics of Proteins, Molecular Dynamic Simulation, and Vaccine Design",
        "date": "2021-04-10",
        "duration": "58 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_TUV_north_Academy_MD_wfwvnm.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      }
    ]
  },
  {
    "issuer": "ICAD Academy International",
    "certifications": [
      {
        "name": "GLP",
        "date": "2023-12-08",
        "duration": "16 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530887/certificate_ICAD_glp_EN_vjmbcp.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      }
    ]
  },
  {
    "issuer": "Rahpouyan Fanavar Sadegh",
    "certifications": [
      {
        "name": "Biosafety, biosecurity, and biological risk",
        "date": "2023-12-09",
        "duration": "8 hours",
        "certificate": false,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530886/certificate_Biosafety_biosecurity_and_biological_risk_xeazln.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "GMP in drug industry",
        "date": "2023-12-20",
        "duration": "90 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "Fermentation process of heterologous protein production",
        "date": "2024-02-25",
        "duration": "20 weeks",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      }
    ]
  },
  {
    "issuer": "University of Tehran",
    "certifications": [
      {
        "name": "Histological Techniques and Equipment",
        "date": "2023-09-13",
        "duration": "15 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530890/certificate_UoT_Histological_Techniques_and_Equipment_cyqakk.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "Fundamental Principles of Molecular Testing Techniques",
        "date": "2023-09-10",
        "duration": "45 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530888/certificate_UoT_Fundamental_Principles_of_Molecular_Testing_Techniques_stnnhk.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "Fundamental Techniques for Handling, Bleeding, and Injection of Lab Animals",
        "date": "2023-09-20",
        "duration": "6 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530888/certificate_UoT_Fundamental_Techniques_for_Handling_Bleeding_and_Injection_of_Lab_Animals_oiho0j.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "Applied Bioinformatics",
        "date": "2023-09-20",
        "duration": "10 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530887/certificate_UoT_Applied_Bioinformatics_urbeov.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Fundamental Principles of In Vitro Cell Culture Techniques",
        "date": "2023-09-15",
        "duration": "10 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530888/certificate_UoT_Fundamental_Principles_of_In_Vitro_Cell_Culture_Techniques_vsz0f3.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      },
      {
        "name": "Introduction to Microbiological Lab Techniques",
        "date": "2023-09-17",
        "duration": "10 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530890/certificate_UoT_Introduction_to_Microbiological_Lab_Techniques_gflaji.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic"
        ]
      }
    ]
  },
  {
    "issuer": "Actin Academy",
    "certifications": [
      {
        "name": "ChIP-Seq Data Analysis",
        "date": "2024-06-06",
        "duration": "12 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Online Databases",
        "date": "2024-03-14",
        "duration": "8 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Genomic Data Analysis",
        "date": "2024-04-04",
        "duration": "24 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Microarray Data Analysis",
        "date": "2024-04-15",
        "duration": "16 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Single Cell RNA Sequencing",
        "date": "2024-04-22",
        "duration": "12 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Bulk RNA Sequencing",
        "date": "2024-04-29",
        "duration": "12 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Proteomics Data Analysis",
        "date": "2024-05-06",
        "duration": "16 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Machine Learning",
        "date": "2024-06-27",
        "duration": "20 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Metagenomic Data Analysis",
        "date": "2024-05-27",
        "duration": "12 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Precision Medicine Biological Systems",
        "date": "2024-02-19",
        "duration": "8 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Gene Regulatory Network Analysis",
        "date": "2024-06-10",
        "duration": "8 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Complex Biological Network Analysis",
        "date": "2024-06-13",
        "duration": "20 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Metabolic Network Reconstruction",
        "date": "2024-05-20",
        "duration": "20 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Introduction to Big Biological Data",
        "date": "2024-03-04",
        "duration": "8 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics"
        ]
      },
      {
        "name": "Docker and Visualization",
        "date": "2024-07-04",
        "duration": "8 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics",
          "Programming"
        ]
      }
    ]
  },
  {
    "issuer": "Maktab Sharif Academy",
    "certifications": [
      {
        "name": "Python & Django",
        "date": "2023-01-18",
        "duration": "400 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530890/certificate_maktabsharif_python_django_qi5tcd.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics",
          "Programming"
        ]
      }
    ]
  },
  {
    "issuer": "Maktabkhooneh",
    "certifications": [
      {
        "name": "Front-End Web Development and Design",
        "date": "2020-09-18",
        "duration": "70 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530887/certificate_maktabkhune_front_end_pt2jrn.pdf",
        "type_key": [
          "Full CV",
          "Academic",
          "Programming"
        ]
      },
      {
        "name": "Python Programming for Beginners",
        "date": "2020-07-23",
        "duration": "57 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530890/certificate_maktabkhune_beginner_python_zvfwzv.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics",
          "Programming"
        ]
      },
      {
        "name": "Advanced Python Programming",
        "date": "2021-12-11",
        "duration": "57 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749530887/certificate_maktabkhune_advanced_python_porkqg.pdf",
        "type_key": [
          "Full CV",
          "Biotechnology",
          "Academic",
          "Bioinformatics",
          "Programming"
        ]
      }
    ]
  },
  {
    "issuer": "Daneshjooyar",
    "certifications": [
      {
        "name": "UI/UX",
        "date": "2021-11-09",
        "duration": "30 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Academic",
          "Programming"
        ]
      }
    ]
  },
  {
    "issuer": "Hamrah Academy",
    "certifications": [
      {
        "name": "Fundamentals and Roadmap of Data Science",
        "date": "2023-07-15",
        "duration": "3 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531338/certificate_Hamrah_academy_Fundamentals_and_Roadmap_of_Data_Science_lea7xa.pdf",
        "type_key": []
      },
      {
        "name": "Mathematics for Data Science and Artificial Intelligence",
        "date": "2023-09-01",
        "duration": "8 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531339/certificate_Hamrah_academy_Mathematics_for_Data_Science_and_Artificial_Intelligence_tufiqi.pdf",
        "type_key": []
      },
      {
        "name": "Data Mining and Business Intelligence with KNIME",
        "date": "2023-09-05",
        "duration": "6 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531339/certificate_Hamrah_academy_Data_Mining_and_Business_Intelligence_with_KNIME_kctnfx.pdf",
        "type_key": []
      },
      {
        "name": "Comprehensive Python Programming",
        "date": "2023-09-12",
        "duration": "12 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531338/certificate_Hamrah_academy_Comprehensive_Python_Programming_aofpwo.pdf",
        "type_key": []
      },
      {
        "name": "Data Visualization Tools",
        "date": "2023-10-22",
        "duration": "5 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531339/certificate_Hamrah_academy_Data_Visualization_Tools_ooqjbj.pdf",
        "type_key": []
      },
      {
        "name": "Introductory Database Principles",
        "date": "2023-10-19",
        "duration": "10 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531339/certificate_Hamrah_academy_Introductory_Database_Principles_dby3im.pdf",
        "type_key": []
      },
      {
        "name": "Data Mining with Python",
        "date": "2023-11-01",
        "duration": "8 hours",
        "certificate": true,
        "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/v1749531338/certificate_Hamrah_academy_Data_Mining_with_Python_fz3e0c.pdf",
        "type_key": []
      }
    ]
  },
  {
    "issuer": "Faradars",
    "certifications": [
      {
        "name": "Linear Algebra Toward Data Science",
        "date": "2024-03-18",
        "duration": "60 hours",
        "certificate": false,
        "URL": null,
        "type_key": [
          "Full CV",
          "Academic",
          "Bioinformatics",
          "Programming"
        ]
      }
    ]
  }
]
```
