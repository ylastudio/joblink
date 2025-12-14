import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ro" | "pl";

interface Translations {
  nav: {
    home: string;
    findJobs: string;
    postJob: string;
    contact: string;
    findWork: string;
    hireTalent: string;
  };
  hero: {
    title: string;
    titleAccent: string;
    subtitle: string;
    findJobs: string;
    postJob: string;
  };
  stats: {
    jobsPosted: string;
    candidatesHired: string;
    partnerCompanies: string;
    satisfactionRate: string;
  };
  categories: {
    title: string;
    subtitle: string;
    hotels: {
      title: string;
      description: string;
    };
    construction: {
      title: string;
      description: string;
    };
    plumbing: {
      title: string;
      description: string;
    };
    helper: {
      title: string;
      description: string;
    };
    openPositions: string;
    viewJobs: string;
  };
  whyChoose: {
    title: string;
    subtitle: string;
    vettedEmployers: {
      title: string;
      description: string;
    };
    securePrivate: {
      title: string;
      description: string;
    };
    quickMatching: {
      title: string;
      description: string;
    };
    careerSupport: {
      title: string;
      description: string;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    browseJobs: string;
    hireWorkers: string;
  };
  findJobsPage: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    allLocations: string;
    allRegions: string;
    search: string;
    showing: string;
    jobs: string;
    applyNow: string;
    noJobs: string;
    clearFilters: string;
  };
  postJobPage: {
    title: string;
    subtitle: string;
    benefits: {
      vettedTalent: { title: string; description: string };
      quickTurnaround: { title: string; description: string };
      industryExpertise: { title: string; description: string };
    };
    form: {
      title: string;
      subtitle: string;
      companyName: string;
      contactPerson: string;
      email: string;
      phone: string;
      industry: string;
      positions: string;
      location: string;
      country: string;
      jobDetails: string;
      submit: string;
      responseTime: string;
    };
    success: {
      title: string;
      message: string;
      submitAnother: string;
    };
  };
  contactPage: {
    title: string;
    subtitle: string;
    info: {
      email: { title: string; description: string };
      phone: { title: string; description: string };
      visit: { title: string; description: string };
      hours: { title: string; value: string; description: string };
    };
    form: {
      title: string;
      subtitle: string;
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      send: string;
    };
    location: {
      title: string;
      subtitle: string;
      quickContact: string;
    };
    success: {
      title: string;
      message: string;
    };
  };
  applicationModal: {
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    uploadCV: string;
    uploadPlaceholder: string;
    coverLetter: string;
    coverLetterPlaceholder: string;
    cancel: string;
    submit: string;
    success: {
      title: string;
      message: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    industries: string;
    contactUs: string;
    privacyPolicy: string;
    termsOfService: string;
    copyright: string;
  };
  jobTypes: {
    fullTime: string;
    partTime: string;
    contract: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      findJobs: "Find Jobs",
      postJob: "Post a Job",
      contact: "Contact Us",
      findWork: "Find Work",
      hireTalent: "Hire Talent",
    },
    hero: {
      title: "Find Your Next",
      titleAccent: "Career Opportunity",
      subtitle: "JobLink connects skilled professionals with trusted employers in Warehousing, construction, Kitchen, and Cleaning services. Your dream job is just a click away.",
      findJobs: "Find Jobs",
      postJob: "Post a Job",
    },
    stats: {
      jobsPosted: "Jobs Posted",
      candidatesHired: "Candidates Hired",
      partnerCompanies: "Partner Companies",
      satisfactionRate: "Satisfaction Rate",
    },
    categories: {
      title: "Explore Job Categories",
      subtitle: "We specialize in connecting talent with opportunities across four key industries",
      hotels: {
        title: "Warehouse & Logistics Work",
        description: "Working in warehouse and logistics environments requires efficiency, attention to detail, and good physical coordination. Employees ensure that goods are received, stored, prepared, and shipped correctly to keep supply chains running smoothly. This field is essential for fast, accurate distribution and reliable customer service.",
      },
      construction: {
        title: "Construction & On-Site Workforce",
        description: "The construction sector requires skilled, disciplined workers who can perform in dynamic and demanding environments. On-site activities are essential for infrastructure development and involve a wide range of specialties. We recruit experienced workers who are ready to operate efficiently and collaboratively.",
      },
      plumbing: {
        title: "Kitchen Support & Food Delivery",
        description: "The hospitality sector relies on dedicated kitchen assistants and efficient food delivery staff. Working behind the scenes or on the road, they help ensure smooth restaurant operations and timely service. These roles are essential for maintaining quality, speed, and customer satisfaction.",
      },
      helper: {
        title: "Cleaning Services for Offices, Residential Buildings & Private Spaces",
        description: "Cleaning work in offices, apartment buildings, and private properties requires attention to detail, organization, and reliability. Professional cleaners ensure a hygienic, safe, and pleasant environment by performing tasks such as dusting, vacuuming, sanitizing surfaces, and maintaining common areas. These services help keep workplaces efficient, residential spaces comfortable, and private homes spotless.",
      },
      openPositions: "Open Positions",
      viewJobs: "View Jobs",
    },
    whyChoose: {
      title: "Why Choose JobLink",
      subtitle: "We're committed to making your job search or hiring process seamless and successful",
      vettedEmployers: {
        title: "Vetted Employers",
        description: "Every company on our platform is thoroughly verified to ensure quality opportunities.",
      },
      securePrivate: {
        title: "Secure & Private",
        description: "Your personal information and CV are protected with enterprise-grade security.",
      },
      quickMatching: {
        title: "Quick Matching",
        description: "Our streamlined process connects you with the right opportunity within days.",
      },
      careerSupport: {
        title: "Career Support",
        description: "Get guidance and resources to help you succeed in your new role.",
      },
    },
    cta: {
      title: "Ready to Take the Next Step?",
      subtitle: "Whether you're looking for your dream job or searching for the perfect candidate, we're here to help.",
      browseJobs: "Browse Jobs",
      hireWorkers: "Hire Workers",
    },
    findJobsPage: {
      title: "Find Your Perfect Job",
      subtitle: "Browse through hundreds of opportunities in hospitality, construction, plumbing, and support services",
      searchPlaceholder: "Search jobs or companies...",
      allCategories: "All Categories",
      allLocations: "All Locations",
      allRegions: "All Regions",
      search: "Search",
      showing: "Showing",
      jobs: "jobs",
      applyNow: "Apply Now",
      noJobs: "No jobs found matching your criteria.",
      clearFilters: "Clear Filters",
    },
    postJobPage: {
      title: "Hire Top Talent",
      subtitle: "Connect with qualified candidates in hospitality, construction, plumbing, and support services",
      benefits: {
        vettedTalent: { title: "Access to Vetted Talent", description: "Connect with pre-screened candidates ready to work" },
        quickTurnaround: { title: "Quick Turnaround", description: "Get qualified applicants within 48 hours" },
        industryExpertise: { title: "Industry Expertise", description: "Specialized recruitment for your sector" },
      },
      form: {
        title: "Contact Our Recruitment Team",
        subtitle: "Fill out the form below and our team will get in touch to help you find the perfect candidates",
        companyName: "Company Name",
        contactPerson: "Contact Person",
        email: "Email Address",
        phone: "Phone Number",
        industry: "Industry",
        positions: "Number of Positions",
        location: "Job Location",
        country: "Country",
        jobDetails: "Job Details & Requirements",
        submit: "Submit Request",
        responseTime: "We typically respond within 24 business hours",
      },
      success: {
        title: "Request Submitted!",
        message: "Thank you for your interest in posting a job with JobLink. Our recruitment team will contact you within 24 hours to discuss your hiring needs and set up your job posting.",
        submitAnother: "Submit Another Request",
      },
    },
    contactPage: {
      title: "Get In Touch",
      subtitle: "Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.",
      info: {
        email: { title: "Email Us", description: "We'll respond within 24 hours" },
        phone: { title: "Call Us", description: "Mon-Fri, 9AM-6PM EST" },
        visit: { title: "Visit Us", description: "Suite 100, New York, NY 10001" },
        hours: { title: "Business Hours", value: "Monday - Friday", description: "9:00 AM - 6:00 PM EST" },
      },
      form: {
        title: "Send Us a Message",
        subtitle: "Fill out the form below and our team will get back to you within 24 hours.",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        subject: "Subject",
        message: "Message",
        send: "Send Message",
      },
      location: {
        title: "Our Location",
        subtitle: "Visit our headquarters or schedule a meeting with our team.",
        quickContact: "Quick Contact",
      },
      success: {
        title: "Message Sent!",
        message: "Thank you for reaching out. We'll get back to you soon.",
      },
    },
    applicationModal: {
      title: "Apply for Position",
      subtitle: "Complete the form below to submit your application",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      uploadCV: "Upload CV/Resume",
      uploadPlaceholder: "Click to upload PDF, DOC, or DOCX",
      coverLetter: "Cover Letter (Optional)",
      coverLetterPlaceholder: "Tell us why you're a great fit for this position...",
      cancel: "Cancel",
      submit: "Submit Application",
      success: {
        title: "Application Submitted!",
        message: "Thank you for applying. We'll be in touch soon.",
      },
    },
    footer: {
      description: "Connecting skilled workers with trusted employers in hospitality, construction, plumbing, and support services.",
      quickLinks: "Quick Links",
      industries: "Industries",
      contactUs: "Contact Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "© 2024 JobLink. All rights reserved.",
    },
    jobTypes: {
      fullTime: "Full-time",
      partTime: "Part-time",
      contract: "Contract",
    },
  },
  ro: {
    nav: {
      home: "Acasă",
      findJobs: "Găsește Joburi",
      postJob: "Postează Job",
      contact: "Contact",
      findWork: "Caută Muncă",
      hireTalent: "Angajează",
    },
    hero: {
      title: "Găsește Următoarea Ta",
      titleAccent: "Oportunitate de Carieră",
      subtitle: "JobLink conectează profesioniști calificați cu angajatori de încredere în Depozitare, construcții, Bucătărie și servicii de Curățenie. Jobul visurilor tale este la un click distanță.",
      findJobs: "Găsește Joburi",
      postJob: "Postează Job",
    },
    stats: {
      jobsPosted: "Joburi Postate",
      candidatesHired: "Candidați Angajați",
      partnerCompanies: "Companii Partenere",
      satisfactionRate: "Rata de Satisfacție",
    },
    categories: {
      title: "Explorează Categoriile de Joburi",
      subtitle: "Suntem specializați în conectarea talentelor cu oportunități în patru industrii cheie",
      hotels: {
        title: "Depozite & Logistică",
        description: "Lucrul în medii de depozit și logistică necesită eficiență, atenție la detalii și o bună coordonare fizică. Angajații se asigură că mărfurile sunt recepționate, depozitate, pregătite și expediate corect pentru a menține lanțurile de aprovizionare funcționale. Acest domeniu este esențial pentru distribuție rapidă, precisă și servicii fiabile pentru clienți.",
      },
      construction: {
        title: "Construcții & Forță de Muncă pe Șantier",
        description: "Sectorul construcțiilor necesită muncitori calificați și disciplinați care pot performa în medii dinamice și solicitante. Activitățile pe șantier sunt esențiale pentru dezvoltarea infrastructurii și implică o gamă largă de specializări. Recrutăm muncitori cu experiență care sunt pregătiți să opereze eficient și colaborativ.",
      },
      plumbing: {
        title: "Suport Bucătărie & Livrare Mâncare",
        description: "Sectorul ospitalității se bazează pe asistenți de bucătărie dedicați și personal eficient de livrare a alimentelor. Lucrând în culise sau pe drum, aceștia ajută la asigurarea operațiunilor fluide ale restaurantelor și a serviciilor la timp. Aceste roluri sunt esențiale pentru menținerea calității, vitezei și satisfacției clienților.",
      },
      helper: {
        title: "Servicii de Curățenie pentru Birouri, Clădiri Rezidențiale și Spații Private",
        description: "Munca de curățenie în birouri, blocuri de apartamente și proprietăți private necesită atenție la detalii, organizare și fiabilitate. Curățătorii profesioniști asigură un mediu igienic, sigur și plăcut prin efectuarea sarcinilor precum ștergerea prafului, aspirarea, dezinfectarea suprafețelor și întreținerea spațiilor comune. Aceste servicii ajută la menținerea locurilor de muncă eficiente, a spațiilor rezidențiale confortabile și a caselor private impecabile.",
      },
      openPositions: "Poziții Deschise",
      viewJobs: "Vezi Joburi",
    },
    whyChoose: {
      title: "De Ce Să Alegi JobLink",
      subtitle: "Suntem dedicați să facem căutarea ta de job sau procesul de angajare simplu și de succes",
      vettedEmployers: {
        title: "Angajatori Verificați",
        description: "Fiecare companie de pe platforma noastră este verificată temeinic pentru oportunități de calitate.",
      },
      securePrivate: {
        title: "Sigur & Privat",
        description: "Informațiile tale personale și CV-ul sunt protejate cu securitate de nivel enterprise.",
      },
      quickMatching: {
        title: "Potrivire Rapidă",
        description: "Procesul nostru simplificat te conectează cu oportunitatea potrivită în câteva zile.",
      },
      careerSupport: {
        title: "Suport în Carieră",
        description: "Primește îndrumare și resurse pentru a reuși în noul tău rol.",
      },
    },
    cta: {
      title: "Gata Să Faci Următorul Pas?",
      subtitle: "Fie că îți cauți jobul visurilor sau candidatul perfect, suntem aici să te ajutăm.",
      browseJobs: "Răsfoiește Joburi",
      hireWorkers: "Angajează Muncitori",
    },
    findJobsPage: {
      title: "Găsește Jobul Perfect",
      subtitle: "Răsfoiește sute de oportunități în hotelărie, construcții, instalații și servicii auxiliare",
      searchPlaceholder: "Caută joburi sau companii...",
      allCategories: "Toate Categoriile",
      allLocations: "Toate Locațiile",
      allRegions: "Toate Regiunile",
      search: "Caută",
      showing: "Se afișează",
      jobs: "joburi",
      applyNow: "Aplică Acum",
      noJobs: "Nu s-au găsit joburi care să corespundă criteriilor tale.",
      clearFilters: "Șterge Filtrele",
    },
    postJobPage: {
      title: "Angajează Talente de Top",
      subtitle: "Conectează-te cu candidați calificați în hotelărie, construcții, instalații și servicii auxiliare",
      benefits: {
        vettedTalent: { title: "Acces la Talente Verificate", description: "Conectează-te cu candidați pre-selectați gata de muncă" },
        quickTurnaround: { title: "Răspuns Rapid", description: "Primește aplicanți calificați în 48 de ore" },
        industryExpertise: { title: "Expertiză în Industrie", description: "Recrutare specializată pentru sectorul tău" },
      },
      form: {
        title: "Contactează Echipa de Recrutare",
        subtitle: "Completează formularul de mai jos și echipa noastră te va contacta pentru a te ajuta să găsești candidații perfecți",
        companyName: "Numele Companiei",
        contactPerson: "Persoană de Contact",
        email: "Adresă de Email",
        phone: "Număr de Telefon",
        industry: "Industrie",
        positions: "Număr de Poziții",
        location: "Locația Jobului",
        country: "Țara",
        jobDetails: "Detalii și Cerințe Job",
        submit: "Trimite Cererea",
        responseTime: "Răspundem de obicei în 24 de ore lucrătoare",
      },
      success: {
        title: "Cerere Trimisă!",
        message: "Mulțumim pentru interesul tău în postarea unui job cu JobLink. Echipa noastră de recrutare te va contacta în 24 de ore pentru a discuta nevoile tale de angajare.",
        submitAnother: "Trimite Altă Cerere",
      },
    },
    contactPage: {
      title: "Contactează-ne",
      subtitle: "Ai întrebări? Suntem aici să te ajutăm. Contactează echipa noastră și îți vom răspunde cât mai curând posibil.",
      info: {
        email: { title: "Email", description: "Răspundem în 24 de ore" },
        phone: { title: "Telefon", description: "Luni-Vineri, 9:00-18:00" },
        visit: { title: "Vizitează-ne", description: "Suite 100, New York, NY 10001" },
        hours: { title: "Program", value: "Luni - Vineri", description: "9:00 - 18:00" },
      },
      form: {
        title: "Trimite-ne un Mesaj",
        subtitle: "Completează formularul de mai jos și echipa noastră îți va răspunde în 24 de ore.",
        name: "Nume Complet",
        email: "Adresă de Email",
        phone: "Număr de Telefon",
        subject: "Subiect",
        message: "Mesaj",
        send: "Trimite Mesajul",
      },
      location: {
        title: "Locația Noastră",
        subtitle: "Vizitează sediul nostru sau programează o întâlnire cu echipa noastră.",
        quickContact: "Contact Rapid",
      },
      success: {
        title: "Mesaj Trimis!",
        message: "Mulțumim că ne-ai contactat. Îți vom răspunde în curând.",
      },
    },
    applicationModal: {
      title: "Aplică pentru Poziție",
      subtitle: "Completează formularul de mai jos pentru a trimite aplicația ta",
      firstName: "Prenume",
      lastName: "Nume",
      email: "Adresă de Email",
      phone: "Număr de Telefon",
      uploadCV: "Încarcă CV/Rezumat",
      uploadPlaceholder: "Click pentru a încărca PDF, DOC sau DOCX",
      coverLetter: "Scrisoare de Intenție (Opțional)",
      coverLetterPlaceholder: "Spune-ne de ce ești potrivit pentru această poziție...",
      cancel: "Anulează",
      submit: "Trimite Aplicația",
      success: {
        title: "Aplicație Trimisă!",
        message: "Mulțumim pentru aplicare. Te vom contacta în curând.",
      },
    },
    footer: {
      description: "Conectăm muncitori calificați cu angajatori de încredere în hotelărie, construcții, instalații și servicii auxiliare.",
      quickLinks: "Linkuri Rapide",
      industries: "Industrii",
      contactUs: "Contact",
      privacyPolicy: "Politica de Confidențialitate",
      termsOfService: "Termeni și Condiții",
      copyright: "© 2024 JobLink. Toate drepturile rezervate.",
    },
    jobTypes: {
      fullTime: "Full-time",
      partTime: "Part-time",
      contract: "Contract",
    },
  },
  pl: {
    nav: {
      home: "Strona Główna",
      findJobs: "Znajdź Pracę",
      postJob: "Dodaj Ofertę",
      contact: "Kontakt",
      findWork: "Szukaj Pracy",
      hireTalent: "Zatrudnij",
    },
    hero: {
      title: "Znajdź Swoją Następną",
      titleAccent: "Szansę Kariery",
      subtitle: "JobLink łączy wykwalifikowanych specjalistów z zaufanymi pracodawcami w branży Magazynowej, budowlanej, Kuchennej i Sprzątania. Twoja wymarzona praca jest na wyciągnięcie ręki.",
      findJobs: "Znajdź Pracę",
      postJob: "Dodaj Ofertę",
    },
    stats: {
      jobsPosted: "Ofert Pracy",
      candidatesHired: "Zatrudnionych",
      partnerCompanies: "Firm Partnerskich",
      satisfactionRate: "Satysfakcji",
    },
    categories: {
      title: "Przeglądaj Kategorie Pracy",
      subtitle: "Specjalizujemy się w łączeniu talentów z możliwościami w czterech kluczowych branżach",
      hotels: {
        title: "Magazyny i Logistyka",
        description: "Praca w środowiskach magazynowych i logistycznych wymaga wydajności, dbałości o szczegóły i dobrej koordynacji fizycznej. Pracownicy zapewniają prawidłowe przyjmowanie, przechowywanie, przygotowanie i wysyłkę towarów, aby łańcuchy dostaw działały sprawnie. Ta dziedzina jest niezbędna dla szybkiej, dokładnej dystrybucji i niezawodnej obsługi klienta.",
      },
      construction: {
        title: "Budownictwo & Praca na Budowie",
        description: "Sektor budowlany wymaga wykwalifikowanych, zdyscyplinowanych pracowników, którzy potrafią pracować w dynamicznych i wymagających środowiskach. Prace na budowie są niezbędne dla rozwoju infrastruktury i obejmują szeroki zakres specjalizacji. Rekrutujemy doświadczonych pracowników gotowych do wydajnej i zespołowej pracy.",
      },
      plumbing: {
        title: "Wsparcie Kuchni & Dostawa Jedzenia",
        description: "Sektor hotelarsko-gastronomiczny opiera się na oddanych pomocnikach kuchennych i sprawnym personelu dostawczym. Pracując za kulisami lub w terenie, pomagają zapewnić płynne działanie restauracji i terminową obsługę. Te role są niezbędne dla utrzymania jakości, szybkości i satysfakcji klientów.",
      },
      helper: {
        title: "Usługi Sprzątania dla Biur, Budynków Mieszkalnych i Przestrzeni Prywatnych",
        description: "Praca sprzątająca w biurach, blokach mieszkalnych i prywatnych nieruchomościach wymaga dbałości o szczegóły, organizacji i niezawodności. Profesjonalni sprzątacze zapewniają higieniczne, bezpieczne i przyjemne środowisko poprzez wykonywanie zadań takich jak odkurzanie, ścieranie kurzu, dezynfekcja powierzchni i utrzymanie części wspólnych. Te usługi pomagają utrzymać miejsca pracy wydajne, przestrzenie mieszkalne komfortowe i prywatne domy nieskazitelne.",
      },
      openPositions: "Otwartych Pozycji",
      viewJobs: "Zobacz Oferty",
    },
    whyChoose: {
      title: "Dlaczego JobLink",
      subtitle: "Jesteśmy zaangażowani w to, aby Twoje poszukiwania pracy lub proces rekrutacji były płynne i udane",
      vettedEmployers: {
        title: "Zweryfikowani Pracodawcy",
        description: "Każda firma na naszej platformie jest dokładnie zweryfikowana.",
      },
      securePrivate: {
        title: "Bezpieczne i Prywatne",
        description: "Twoje dane osobowe i CV są chronione zabezpieczeniami klasy enterprise.",
      },
      quickMatching: {
        title: "Szybkie Dopasowanie",
        description: "Nasz usprawniony proces łączy Cię z odpowiednią możliwością w ciągu dni.",
      },
      careerSupport: {
        title: "Wsparcie Kariery",
        description: "Otrzymaj wskazówki i zasoby, które pomogą Ci odnieść sukces w nowej roli.",
      },
    },
    cta: {
      title: "Gotowy na Następny Krok?",
      subtitle: "Niezależnie od tego, czy szukasz wymarzonej pracy, czy idealnego kandydata, jesteśmy tutaj, aby pomóc.",
      browseJobs: "Przeglądaj Oferty",
      hireWorkers: "Zatrudnij Pracowników",
    },
    findJobsPage: {
      title: "Znajdź Idealną Pracę",
      subtitle: "Przeglądaj setki możliwości w branży hotelarskiej, budowlanej, hydraulicznej i usługowej",
      searchPlaceholder: "Szukaj pracy lub firm...",
      allCategories: "Wszystkie Kategorie",
      allLocations: "Wszystkie Lokalizacje",
      allRegions: "Wszystkie Regiony",
      search: "Szukaj",
      showing: "Pokazuję",
      jobs: "ofert",
      applyNow: "Aplikuj Teraz",
      noJobs: "Nie znaleziono ofert spełniających Twoje kryteria.",
      clearFilters: "Wyczyść Filtry",
    },
    postJobPage: {
      title: "Zatrudnij Najlepszych",
      subtitle: "Połącz się z wykwalifikowanymi kandydatami w branży hotelarskiej, budowlanej, hydraulicznej i usługowej",
      benefits: {
        vettedTalent: { title: "Dostęp do Zweryfikowanych Talentów", description: "Połącz się z wstępnie sprawdzonymi kandydatami gotowymi do pracy" },
        quickTurnaround: { title: "Szybka Realizacja", description: "Otrzymaj wykwalifikowanych kandydatów w ciągu 48 godzin" },
        industryExpertise: { title: "Ekspertyza Branżowa", description: "Specjalistyczna rekrutacja dla Twojego sektora" },
      },
      form: {
        title: "Skontaktuj się z Zespołem Rekrutacji",
        subtitle: "Wypełnij poniższy formularz, a nasz zespół skontaktuje się z Tobą, aby pomóc znaleźć idealnych kandydatów",
        companyName: "Nazwa Firmy",
        contactPerson: "Osoba Kontaktowa",
        email: "Adres Email",
        phone: "Numer Telefonu",
        industry: "Branża",
        positions: "Liczba Stanowisk",
        location: "Lokalizacja Pracy",
        country: "Kraj",
        jobDetails: "Szczegóły i Wymagania",
        submit: "Wyślij Zapytanie",
        responseTime: "Zazwyczaj odpowiadamy w ciągu 24 godzin roboczych",
      },
      success: {
        title: "Zapytanie Wysłane!",
        message: "Dziękujemy za zainteresowanie dodaniem oferty pracy w JobLink. Nasz zespół rekrutacyjny skontaktuje się z Tobą w ciągu 24 godzin.",
        submitAnother: "Wyślij Kolejne Zapytanie",
      },
    },
    contactPage: {
      title: "Skontaktuj się",
      subtitle: "Masz pytania? Jesteśmy tutaj, aby pomóc. Skontaktuj się z naszym zespołem, a odpowiemy tak szybko, jak to możliwe.",
      info: {
        email: { title: "Email", description: "Odpowiemy w ciągu 24 godzin" },
        phone: { title: "Telefon", description: "Pon-Pt, 9:00-18:00" },
        visit: { title: "Odwiedź Nas", description: "Suite 100, New York, NY 10001" },
        hours: { title: "Godziny Pracy", value: "Poniedziałek - Piątek", description: "9:00 - 18:00" },
      },
      form: {
        title: "Wyślij Nam Wiadomość",
        subtitle: "Wypełnij poniższy formularz, a nasz zespół odpowie w ciągu 24 godzin.",
        name: "Imię i Nazwisko",
        email: "Adres Email",
        phone: "Numer Telefonu",
        subject: "Temat",
        message: "Wiadomość",
        send: "Wyślij Wiadomość",
      },
      location: {
        title: "Nasza Lokalizacja",
        subtitle: "Odwiedź naszą siedzibę lub umów się na spotkanie z naszym zespołem.",
        quickContact: "Szybki Kontakt",
      },
      success: {
        title: "Wiadomość Wysłana!",
        message: "Dziękujemy za kontakt. Odpowiemy wkrótce.",
      },
    },
    applicationModal: {
      title: "Aplikuj na Stanowisko",
      subtitle: "Wypełnij poniższy formularz, aby przesłać swoją aplikację",
      firstName: "Imię",
      lastName: "Nazwisko",
      email: "Adres Email",
      phone: "Numer Telefonu",
      uploadCV: "Prześlij CV",
      uploadPlaceholder: "Kliknij, aby przesłać PDF, DOC lub DOCX",
      coverLetter: "List Motywacyjny (Opcjonalnie)",
      coverLetterPlaceholder: "Powiedz nam, dlaczego jesteś idealnym kandydatem na to stanowisko...",
      cancel: "Anuluj",
      submit: "Wyślij Aplikację",
      success: {
        title: "Aplikacja Wysłana!",
        message: "Dziękujemy za aplikację. Skontaktujemy się wkrótce.",
      },
    },
    footer: {
      description: "Łączymy wykwalifikowanych pracowników z zaufanymi pracodawcami w branży hotelarskiej, budowlanej, hydraulicznej i usługowej.",
      quickLinks: "Szybkie Linki",
      industries: "Branże",
      contactUs: "Kontakt",
      privacyPolicy: "Polityka Prywatności",
      termsOfService: "Regulamin",
      copyright: "© 2024 JobLink. Wszelkie prawa zastrzeżone.",
    },
    jobTypes: {
      fullTime: "Pełny etat",
      partTime: "Częściowy etat",
      contract: "Kontrakt",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
